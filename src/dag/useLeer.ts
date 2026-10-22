import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { LEERSTOF, laadLeerlijn } from './leerstof'
import { bewaar, dagNummer, dagSleutel, laadGesynchroniseerd, laadLokaal, planLes, pocoVandaag, reeks, voortgang, type DagLes, type Geheugen, type KrantStand, type ModuleStand } from './geheugen'
import { dagTaken } from './rooster'
import type { Eenheid } from './types'

// Eén gedeelde opslag voor de hele app: elk scherm (dagsessie, les, krant)
// ziet direct dezelfde voortgang.
let huidig: Geheugen | null = null
const luisteraars = new Set<() => void>()
let syncGestart = false

const lees = () => (huidig ??= laadLokaal())

function zet(f: (oud: Geheugen) => Geheugen, opslaan = true) {
  const oud = lees()
  const nieuw = f(oud)
  if (nieuw === oud) return
  huidig = nieuw
  if (opslaan) bewaar(nieuw)
  luisteraars.forEach((l) => l())
}

function abonneer(l: () => void) {
  luisteraars.add(l)
  if (!syncGestart) {
    syncGestart = true
    const ververs = () => laadGesynchroniseerd().then((s) => s && zet(() => s, false))
    ververs()
    document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && ververs())
  }
  return () => {
    luisteraars.delete(l)
  }
}

export function useGeheugen() {
  const g = useSyncExternalStore(abonneer, lees)
  const vandaag = dagNummer()

  const wijzig = useCallback(
    (moduleId: string, nieuw: ModuleStand, klaarVandaag?: boolean) => {
      zet((oud) => {
        const sleutel = dagSleutel(vandaag)
        const dag = oud.dagen[sleutel] ?? { gepland: dagTaken(), klaar: [] }
        const dagen = klaarVandaag ? { ...oud.dagen, [sleutel]: { gepland: dag.gepland, klaar: [...new Set([...dag.klaar, moduleId])] } } : oud.dagen
        const volgende: Geheugen = { ...oud, modules: { ...oud.modules, [moduleId]: nieuw }, dagen, updatedAt: Date.now() }
        return volgende
      })
    },
    [vandaag],
  )

  // De krant: lijst van vandaag en wat er gelezen is.
  const wijzigKrant = useCallback(
    (nieuw: (oud: KrantStand) => KrantStand, klaarVandaag?: boolean) => {
      zet((oud) => {
        const sleutel = dagSleutel(vandaag)
        const dag = oud.dagen[sleutel] ?? { gepland: dagTaken(), klaar: [] }
        const klaar = klaarVandaag ? [...new Set([...dag.klaar, 'krant'])] : dag.klaar.filter((x) => klaarVandaag !== false || x !== 'krant')
        const volgende: Geheugen = {
          ...oud,
          krant: nieuw(oud.krant ?? { gelezen: {} }),
          dagen: { ...oud.dagen, [sleutel]: { gepland: dag.gepland, klaar } },
          updatedAt: Date.now(),
        }
        return volgende
      })
    },
    [vandaag],
  )

  // Een stap van de dag (herhalen, spaans …) als afgehandeld markeren.
  const markeer = useCallback(
    (taak: string) => {
      zet((oud) => {
        const sleutel = dagSleutel(vandaag)
        const dag = oud.dagen[sleutel] ?? { gepland: dagTaken(), klaar: [] }
        if (dag.klaar.includes(taak)) return oud
        const volgende: Geheugen = { ...oud, dagen: { ...oud.dagen, [sleutel]: { gepland: dag.gepland, klaar: [...dag.klaar, taak] } }, updatedAt: Date.now() }
        return volgende
      })
    },
    [vandaag],
  )

  return { g, vandaag, wijzig, wijzigKrant, markeer, reeks: reeks(g, vandaag) }
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
