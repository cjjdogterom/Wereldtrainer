import { useEffect, useState } from 'react'
import { laadLeerlijn } from './leerstof'
import { krantVoor } from './rooster'
import { laadStukken, type Stuk } from '../krant/stukken'
import type { Artikel, Geheugen, KrantStand } from './geheugen'
import type { Eenheid } from './types'

// Elk leesonderwerp is een vaste rubriek in de krant. Een rubriek put eerst
// uit de lange artikelen (src/krant/stukken); zijn die gelezen, dan volgen
// korte stukken op basis van de leerstof.
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

// Verhoog dit als de opbouw van de krant verandert: de krant van vandaag
// wordt dan opnieuw samengesteld (wat gelezen is blijft bewaard).
const VERSIE = 3

const sleutel = (m: string, id: string) => `${m}|${id}`
const stukSleutel = (m: string, id: string) => `${m}|stuk:${id}`

export type Bron = { eenheden: Eenheid[]; stukken: Stuk[] }

// Het volgende artikel uit een rubriek: eerst een ongelezen lang stuk, dan
// ongelezen leerstof, en als alles gelezen is wat het langst geleden is.
export function volgende(m: string, bron: Bron, k: KrantStand, bezet: Set<string>): Omit<Artikel, 'gelezen'> | null {
  const stuk = bron.stukken.find((s) => !k.gelezen[stukSleutel(m, s.id)] && !bezet.has(stukSleutel(m, s.id)))
  if (stuk) return { m, ids: [], stuk: stuk.id }
  const n = RUBRIEK[m]?.perArtikel ?? 1
  const vrij = bron.eenheden.filter((e) => !bezet.has(sleutel(m, e.id)))
  const nieuw = vrij.filter((e) => !k.gelezen[sleutel(m, e.id)])
  const lijst = nieuw.length ? nieuw : [...vrij].sort((a, b) => k.gelezen[sleutel(m, a.id)] - k.gelezen[sleutel(m, b.id)])
  const ids = lijst.slice(0, n).map((e) => e.id)
  return ids.length ? { m, ids } : null
}

function bezetIn(artikelen: Artikel[]): Set<string> {
  return new Set(artikelen.flatMap((a) => (a.stuk ? [stukSleutel(a.m, a.stuk)] : a.ids.map((id) => sleutel(a.m, id)))))
}

export function voortgangRubriek(m: string, bron: Bron, k: KrantStand | undefined) {
  if (bron.stukken.length) {
    const gelezen = bron.stukken.filter((s) => k?.gelezen[stukSleutel(m, s.id)]).length
    return { gelezen, totaal: bron.stukken.length, soort: 'artikelen' }
  }
  const gelezen = bron.eenheden.filter((e) => k?.gelezen[sleutel(m, e.id)]).length
  return { gelezen, totaal: bron.eenheden.length, soort: 'stukjes' }
}

// Laadt per rubriek de leerstof en de lange artikelen.
export function useBronnen(ids: string[]) {
  const [bronnen, setBronnen] = useState<Record<string, Bron>>({})
  const sleutelLijst = [...new Set(ids)].sort().join(',')
  useEffect(() => {
    let actief = true
    for (const m of sleutelLijst.split(',').filter(Boolean)) {
      Promise.all([laadLeerlijn(m), laadStukken(m)]).then(([eenheden, stukken]) => {
        if (actief) setBronnen((oud) => (oud[m] ? oud : { ...oud, [m]: { eenheden, stukken } }))
      })
    }
    return () => {
      actief = false
    }
  }, [sleutelLijst])
  return bronnen
}

// De krant van vandaag: wordt één keer per dag samengesteld en bewaard,
// zodat hij op elk apparaat hetzelfde is.
export function useKrant(g: Geheugen, vandaag: number, wijzigKrant: (f: (k: KrantStand) => KrantStand, klaar?: boolean) => void) {
  const rooster = krantVoor()
  const k = g.krant ?? { gelezen: {} }
  const vanVandaag = k.dag === vandaag && k.versie === VERSIE ? (k.artikelen ?? []) : null
  const bronnen = useBronnen([...rooster, ...(vanVandaag ?? []).map((a) => a.m)])
  const alleGeladen = rooster.every((m) => bronnen[m])

  useEffect(() => {
    if (vanVandaag || !alleGeladen) return
    wijzigKrant((oud) => {
      if (oud.dag === vandaag && oud.versie === VERSIE) return oud
      const artikelen: Artikel[] = []
      for (const m of rooster) {
        const a = volgende(m, bronnen[m], oud, bezetIn(artikelen))
        if (a) artikelen.push(a)
      }
      return { ...oud, dag: vandaag, versie: VERSIE, artikelen }
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
        if (aan) {
          if (a.stuk) gelezen[stukSleutel(a.m, a.stuk)] = Date.now()
          for (const id of a.ids) gelezen[sleutel(a.m, id)] = Date.now()
        }
        return { ...oud, artikelen: lijst, gelezen }
      },
      artikelen.slice(0, basis).every((a, j) => (j === i ? aan : a.gelezen)),
    )
  }

  async function extra(m: string): Promise<number | null> {
    const bron = bronnen[m] ?? { eenheden: await laadLeerlijn(m), stukken: await laadStukken(m) }
    const lijst = [...artikelen]
    const a = volgende(m, bron, k, bezetIn(lijst))
    if (!a) return null
    wijzigKrant((oud) => ({ ...oud, dag: vandaag, versie: VERSIE, artikelen: [...(oud.dag === vandaag ? (oud.artikelen ?? []) : []), a] }))
    return lijst.length
  }

  // Stuk of eenheden van een artikel, als ze geladen zijn.
  function inhoud(a: Artikel): { stuk?: Stuk; units?: Eenheid[] } | null {
    const bron = bronnen[a.m]
    if (!bron) return null
    if (a.stuk) {
      const stuk = bron.stukken.find((s) => s.id === a.stuk)
      return stuk ? { stuk } : null
    }
    return { units: a.ids.map((id) => bron.eenheden.find((e) => e.id === id)!).filter(Boolean) }
  }

  return {
    artikelen,
    basis,
    bronnen,
    zetGelezen,
    extra,
    inhoud,
    klaar: basis > 0 && artikelen.slice(0, basis).every((a) => a.gelezen),
  }
}
