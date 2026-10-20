import { useCallback, useEffect, useState } from 'react'
import { LEERSTOF, laadLeerlijn } from './leerstof'
import { bewaar, dagNummer, dagSleutel, laadGesynchroniseerd, laadLokaal, planLes, pocoVandaag, reeks, voortgang, type DagLes, type Geheugen, type ModuleStand } from './geheugen'
import { roosterVoor } from './rooster'
import type { Eenheid } from './types'

export function useGeheugen() {
  const [g, setG] = useState<Geheugen>(laadLokaal)
  const vandaag = dagNummer()

  useEffect(() => {
    let actief = true
    const ververs = () =>
      laadGesynchroniseerd().then((s) => {
        if (actief && s) setG(s)
      })
    ververs()
    const opZicht = () => document.visibilityState === 'visible' && ververs()
    document.addEventListener('visibilitychange', opZicht)
    return () => {
      actief = false
      document.removeEventListener('visibilitychange', opZicht)
    }
  }, [])

  const wijzig = useCallback(
    (moduleId: string, nieuw: ModuleStand, klaarVandaag?: boolean) => {
      setG((oud) => {
        const sleutel = dagSleutel(vandaag)
        const dag = oud.dagen[sleutel] ?? { gepland: roosterVoor(), klaar: [] }
        const dagen = klaarVandaag ? { ...oud.dagen, [sleutel]: { gepland: dag.gepland, klaar: [...new Set([...dag.klaar, moduleId])] } } : oud.dagen
        const volgende: Geheugen = { ...oud, modules: { ...oud.modules, [moduleId]: nieuw }, dagen, updatedAt: Date.now() }
        bewaar(volgende)
        return volgende
      })
    },
    [vandaag],
  )

  return { g, vandaag, wijzig, reeks: reeks(g, vandaag) }
}

// Leerlijn plus de les van vandaag voor één onderwerp.
export function useLesPlan(moduleId: string, g: Geheugen, vandaag: number, wijzig: (id: string, s: ModuleStand) => void) {
  const [eenheden, setEenheden] = useState<Eenheid[] | null>(null)
  const leerstof = LEERSTOF[moduleId]

  useEffect(() => {
    let actief = true
    laadLeerlijn(moduleId).then((e) => actief && setEenheden(e))
    return () => {
      actief = false
    }
  }, [moduleId])

  const stand = g.modules[moduleId]
  let les: DagLes | null = null
  if (eenheden && leerstof) les = planLes(eenheden, stand, vandaag, leerstof.perDag, leerstof.maxHerhaal, !!leerstof.stapsgewijs)

  // Het plan vastleggen, zodat de les vandaag op elk apparaat dezelfde blijft.
  useEffect(() => {
    if (les && (!stand?.les || stand.les.dag !== les.dag)) wijzig(moduleId, { items: stand?.items ?? {}, les })
  }, [les?.dag, moduleId]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    leerstof,
    eenheden,
    les,
    voortgang: eenheden ? voortgang(eenheden, stand) : null,
  }
}

export function usePoco(vandaag: number) {
  const [poco, setPoco] = useState(() => pocoVandaag(vandaag))
  useEffect(() => {
    const opZicht = () => setPoco(pocoVandaag(vandaag))
    document.addEventListener('visibilitychange', opZicht)
    window.addEventListener('focus', opZicht)
    return () => {
      document.removeEventListener('visibilitychange', opZicht)
      window.removeEventListener('focus', opZicht)
    }
  }, [vandaag])
  return poco
}
