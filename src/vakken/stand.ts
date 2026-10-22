import { useEffect, useState } from 'react'
import { laadLeerlijn, LEERSTOF } from '../dag/leerstof'
import { RUBRIEK, sleutel, stukSleutel } from '../dag/krant'
import { laadStukken, type Stuk } from '../krant/stukken'
import type { Geheugen } from '../dag/geheugen'
import type { Eenheid } from '../dag/types'

// Hoe een vak geleerd wordt: stampen (leerkaarten + herhaling), lezen
// (krantenrubriek) of de eigen Spaans-app.
export type Soort = 'stampen' | 'lezen' | 'spaans' | 'vrij'

export function soortVan(id: string): Soort {
  if (id === 'spaans') return 'spaans'
  if (RUBRIEK[id]) return 'lezen'
  if (LEERSTOF[id]) return 'stampen'
  return 'vrij'
}

export type Bron = { eenheden: Eenheid[]; stukken: Stuk[] }

const bronCache = new Map<string, Bron>()

export function useBron(id: string): Bron | null {
  const [bron, setBron] = useState<Bron | null>(() => bronCache.get(id) ?? null)
  useEffect(() => {
    if (bronCache.has(id)) return setBron(bronCache.get(id)!)
    let actief = true
    const s = soortVan(id)
    if (s === 'spaans' || s === 'vrij') return setBron({ eenheden: [], stukken: [] })
    Promise.all([laadLeerlijn(id), s === 'lezen' ? laadStukken(id) : Promise.resolve([])]).then(([eenheden, stukken]) => {
      const b = { eenheden, stukken }
      bronCache.set(id, b)
      if (actief) setBron(b)
    })
    return () => {
      actief = false
    }
  }, [id])
  return bron
}

// Status van één eenheid in een stampvak.
export type Status = 'gekend' | 'bezig' | 'nieuw'

export function statusVan(g: Geheugen, m: string, id: string): Status {
  const s = g.modules[m]?.items[id]
  if (!s) return 'nieuw'
  return s.box >= 1 ? 'gekend' : 'bezig'
}

export type VakStand = {
  klaar: number
  totaal: number
  eenheid: string // 'gekend', 'gelezen' …
  volgende?: string
}

export function vakStand(g: Geheugen, id: string, bron: Bron | null): VakStand | null {
  const s = soortVan(id)
  if (s === 'spaans') {
    const n = pocoGeleerd()
    return { klaar: n, totaal: 0, eenheid: 'woorden geleerd' }
  }
  if (!bron) return null
  if (s === 'lezen') {
    if (bron.stukken.length) {
      const gelezen = bron.stukken.filter((x) => g.krant?.gelezen[stukSleutel(id, x.id)])
      const volgende = bron.stukken.find((x) => !g.krant?.gelezen[stukSleutel(id, x.id)])
      return { klaar: gelezen.length, totaal: bron.stukken.length, eenheid: 'artikelen gelezen', volgende: volgende?.kop }
    }
    const gelezen = bron.eenheden.filter((e) => g.krant?.gelezen[sleutel(id, e.id)]).length
    return { klaar: gelezen, totaal: bron.eenheden.length, eenheid: 'gelezen' }
  }
  const gekend = bron.eenheden.filter((e) => statusVan(g, id, e.id) === 'gekend').length
  const volgende = bron.eenheden.find((e) => statusVan(g, id, e.id) === 'nieuw')
  return { klaar: gekend, totaal: bron.eenheden.length, eenheid: 'gekend', volgende: volgende?.naam }
}

// Aantal Spaanse woorden en zinnen dat Poco a Poco als geleerd bijhoudt.
export function pocoGeleerd(): number {
  try {
    const d = JSON.parse(localStorage.getItem('pocoapoco.v1') ?? '{}') as { items?: Record<string, { b?: number }> }
    return Object.values(d.items ?? {}).filter((x) => (x.b ?? 0) >= 1).length
  } catch {
    return 0
  }
}
