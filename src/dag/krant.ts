import { useEffect, useState } from 'react'
import { laadLeerlijn } from './leerstof'
import { krantVoor } from './rooster'
import type { Artikel, Geheugen, KrantStand } from './geheugen'
import type { Eenheid } from './types'

// Elk leesonderwerp is een vaste rubriek in de krant.
export const RUBRIEK: Record<string, { naam: string; perArtikel: number }> = {
  elektronica: { naam: 'Techniek', perArtikel: 1 },
  vervoer: { naam: 'Motor & luchtvaart', perArtikel: 1 },
  klussen: { naam: 'De werkplaats', perArtikel: 2 },
  geschiedenis: { naam: 'Terug in de tijd', perArtikel: 5 },
  europa: { naam: 'Machten van Europa', perArtikel: 3 },
  kerk: { naam: 'Kerk & geloof', perArtikel: 3 },
  vogels: { naam: 'Vogels spotten', perArtikel: 3 },
  planten: { naam: 'In het veld', perArtikel: 3 },
  geld: { naam: 'Geld van toen', perArtikel: 4 },
  klaverjas: { naam: 'Aan de kaarttafel', perArtikel: 3 },
  voetbal: { naam: 'Uit het sportarchief', perArtikel: 5 },
  weetjes: { naam: 'Wist u dat?', perArtikel: 1 },
}

export const RUBRIEKEN = Object.keys(RUBRIEK)

const sleutel = (m: string, id: string) => `${m}|${id}`

// De volgende eenheden in de leerlijn die je nog niet gelezen hebt. Is alles
// gelezen, dan komen de stukken terug die het langst geleden zijn.
export function volgende(m: string, eenheden: Eenheid[], k: KrantStand, bezet: Set<string>): string[] {
  const n = RUBRIEK[m]?.perArtikel ?? 1
  const vrij = eenheden.filter((e) => !bezet.has(sleutel(m, e.id)))
  const nieuw = vrij.filter((e) => !k.gelezen[sleutel(m, e.id)])
  const bron = nieuw.length ? nieuw : [...vrij].sort((a, b) => k.gelezen[sleutel(m, a.id)] - k.gelezen[sleutel(m, b.id)])
  return bron.slice(0, n).map((e) => e.id)
}

function bezetIn(artikelen: Artikel[]): Set<string> {
  return new Set(artikelen.flatMap((a) => a.ids.map((id) => sleutel(a.m, id))))
}

export function voortgangRubriek(m: string, eenheden: Eenheid[], k: KrantStand | undefined) {
  const gelezen = eenheden.filter((e) => k?.gelezen[sleutel(m, e.id)]).length
  return { gelezen, totaal: eenheden.length }
}

// Laadt de leerlijnen van alle rubrieken die vandaag (of als extra) in de krant staan.
export function useLeerlijnen(ids: string[]) {
  const [lijnen, setLijnen] = useState<Record<string, Eenheid[]>>({})
  const sleutelLijst = [...new Set(ids)].sort().join(',')
  useEffect(() => {
    let actief = true
    for (const m of sleutelLijst.split(',').filter(Boolean)) {
      laadLeerlijn(m).then((e) => actief && setLijnen((oud) => (oud[m] ? oud : { ...oud, [m]: e })))
    }
    return () => {
      actief = false
    }
  }, [sleutelLijst])
  return lijnen
}

// De krant van vandaag: wordt één keer per dag samengesteld en bewaard,
// zodat hij op elk apparaat hetzelfde is.
export function useKrant(g: Geheugen, vandaag: number, wijzigKrant: (f: (k: KrantStand) => KrantStand, klaar?: boolean) => void) {
  const rooster = krantVoor()
  const k = g.krant ?? { gelezen: {} }
  const vanVandaag = k.dag === vandaag ? (k.artikelen ?? []) : null
  const lijnen = useLeerlijnen([...rooster, ...(vanVandaag ?? []).map((a) => a.m)])
  const alleGeladen = rooster.every((m) => lijnen[m])

  useEffect(() => {
    if (vanVandaag || !alleGeladen) return
    wijzigKrant((oud) => {
      if (oud.dag === vandaag) return oud
      const artikelen: Artikel[] = []
      for (const m of rooster) artikelen.push({ m, ids: volgende(m, lijnen[m], oud, bezetIn(artikelen)) })
      return { ...oud, dag: vandaag, artikelen: artikelen.filter((a) => a.ids.length) }
    })
  }, [vanVandaag, alleGeladen, vandaag]) // eslint-disable-line react-hooks/exhaustive-deps

  const artikelen = vanVandaag ?? []
  const basis = Math.min(rooster.length, artikelen.length)

  function zetGelezen(i: number, aan: boolean) {
    wijzigKrant(
      (oud) => {
        const lijst = [...(oud.artikelen ?? [])]
        const a = lijst[i]
        if (!a) return oud
        lijst[i] = { ...a, gelezen: aan }
        const gelezen = { ...oud.gelezen }
        for (const id of a.ids) {
          if (aan) gelezen[sleutel(a.m, id)] = Date.now()
        }
        return { ...oud, artikelen: lijst, gelezen }
      },
      artikelen.slice(0, basis).every((a, j) => (j === i ? aan : a.gelezen)),
    )
  }

  async function extra(m: string) {
    const eenheden = lijnen[m] ?? (await laadLeerlijn(m))
    wijzigKrant((oud) => {
      const lijst = oud.dag === vandaag ? [...(oud.artikelen ?? [])] : []
      const ids = volgende(m, eenheden, oud, bezetIn(lijst))
      if (!ids.length) return oud
      return { ...oud, dag: vandaag, artikelen: [...lijst, { m, ids }] }
    })
  }

  return { artikelen, basis, lijnen, zetGelezen, extra, klaar: basis > 0 && artikelen.slice(0, basis).every((a) => a.gelezen) }
}
