import { useCallback, useEffect, useState } from 'react'
import { BRONNEN, kiesVanDag, type DagItem } from './bronnen'
import {
  bewaar,
  dagNummer,
  dagSleutel,
  laadGesynchroniseerd,
  laadLokaal,
  pocoVandaag,
  reeks,
  type DagStand,
  type Uitslag,
} from './stand'

export function useDagStand() {
  const [stand, setStand] = useState<DagStand>(laadLokaal)
  const vandaag = dagNummer()
  const sleutel = dagSleutel(vandaag)
  const [poco, setPoco] = useState(() => pocoVandaag(vandaag))

  useEffect(() => {
    let actief = true
    laadGesynchroniseerd().then((s) => {
      if (actief && s) setStand(s)
    })
    const opFocus = () => {
      setPoco(pocoVandaag(vandaag))
      laadGesynchroniseerd().then((s) => {
        if (actief && s) setStand(s)
      })
    }
    window.addEventListener('focus', opFocus)
    document.addEventListener('visibilitychange', opFocus)
    return () => {
      actief = false
      window.removeEventListener('focus', opFocus)
      document.removeEventListener('visibilitychange', opFocus)
    }
  }, [vandaag])

  const markeer = useCallback(
    (moduleId: string, uitslag: Uitslag | null) => {
      setStand((oud) => {
        const dag = { ...(oud.dagen[sleutel] ?? {}) }
        if (uitslag) dag[moduleId] = uitslag
        else delete dag[moduleId]
        const nieuw: DagStand = { v: 1, dagen: { ...oud.dagen, [sleutel]: dag }, updatedAt: Date.now() }
        bewaar(nieuw)
        return nieuw
      })
    },
    [sleutel],
  )

  const vandaagUitslagen = stand.dagen[sleutel] ?? {}
  const pocoKlaar = poco.totaal > 0 && poco.klaar >= poco.totaal

  useEffect(() => {
    if (pocoKlaar && !vandaagUitslagen.spaans) markeer('spaans', 'goed')
  }, [pocoKlaar, vandaagUitslagen.spaans, markeer])

  return {
    vandaag,
    uitslagen: vandaagUitslagen,
    poco,
    pocoKlaar,
    reeks: reeks(stand, vandaag),
    markeer,
  }
}

export function useDagItems(vandaag: number) {
  const [items, setItems] = useState<Record<string, DagItem | null>>({})
  const [laden, setLaden] = useState(true)

  useEffect(() => {
    let actief = true
    Promise.all(
      BRONNEN.map(async (b) => {
        try {
          const lijst = await b.laad()
          return [b.moduleId, lijst.length ? kiesVanDag(lijst, b.moduleId, vandaag) : null] as const
        } catch {
          return [b.moduleId, null] as const
        }
      }),
    ).then((paren) => {
      if (!actief) return
      setItems(Object.fromEntries(paren))
      setLaden(false)
    })
    return () => {
      actief = false
    }
  }, [vandaag])

  return { items, laden }
}
