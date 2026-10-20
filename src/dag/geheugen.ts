import { fetchKey, saveKey } from '../lib/sync'
import type { Eenheid } from './types'

// ─── Opslag van wat je kent ───
// Elke eenheid zit in een "bakje" (box). Goed in de overhoring → een bakje
// verder en langer wachten; fout → terug naar bakje 0 en morgen opnieuw.

export type ItemStand = { box: number; due: number; laatst: number; goed: number; fout: number }

export type DagLes = {
  dag: number
  nieuw: string[]
  herhaal: string[]
  klaar?: { goed: number; totaal: number; gehaald: string[]; gemist: string[] }
}

export type ModuleStand = { items: Record<string, ItemStand>; les?: DagLes }

export type Geheugen = {
  v: 2
  modules: Record<string, ModuleStand>
  // datum → modules die die dag klaar waren, en wat er gepland stond
  dagen: Record<string, { gepland: string[]; klaar: string[] }>
  updatedAt: number
}

// Wachttijd in dagen per bakje (bakje 0 = morgen opnieuw).
export const INTERVAL = [1, 1, 3, 7, 14, 30, 60]
const MAX_BOX = INTERVAL.length - 1

const LS = 'wt-leren-v2'

export function dagNummer(d = new Date()): number {
  return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000)
}

export function dagSleutel(n: number): string {
  return new Date(n * 86400000).toISOString().slice(0, 10)
}

function leeg(): Geheugen {
  return { v: 2, modules: {}, dagen: {}, updatedAt: 0 }
}

export function laadLokaal(): Geheugen {
  try {
    const d = JSON.parse(localStorage.getItem(LS) ?? '') as Geheugen
    return d && d.v === 2 ? d : leeg()
  } catch {
    return leeg()
  }
}

export function bewaar(g: Geheugen) {
  try {
    localStorage.setItem(LS, JSON.stringify(g))
  } catch {
    /* vol of privémodus */
  }
  saveKey('dag', g)
}

export function samenvoegen(a: Geheugen, b: Geheugen): Geheugen {
  const modules: Geheugen['modules'] = { ...a.modules }
  for (const [id, mb] of Object.entries(b.modules ?? {})) {
    const ma = modules[id] ?? { items: {} }
    const items = { ...ma.items }
    for (const [iid, ib] of Object.entries(mb.items ?? {})) {
      const ia = items[iid]
      if (!ia || ib.laatst > ia.laatst) items[iid] = ib
    }
    let les = ma.les
    const lb = mb.les
    if (lb && (!les || lb.dag > les.dag || (lb.dag === les.dag && lb.klaar && !les.klaar))) les = lb
    modules[id] = { items, les }
  }
  const dagen = { ...a.dagen }
  for (const [d, x] of Object.entries(b.dagen ?? {})) {
    const y = dagen[d]
    dagen[d] = y ? { gepland: y.gepland.length ? y.gepland : x.gepland, klaar: [...new Set([...y.klaar, ...x.klaar])] } : x
  }
  return { v: 2, modules, dagen, updatedAt: Math.max(a.updatedAt, b.updatedAt ?? 0) }
}

export async function laadGesynchroniseerd(): Promise<Geheugen | null> {
  const extern = await fetchKey<Geheugen>('dag')
  if (!extern || extern.v !== 2) return null
  const samen = samenvoegen(laadLokaal(), extern)
  try {
    localStorage.setItem(LS, JSON.stringify(samen))
  } catch {
    /* negeren */
  }
  return samen
}

// ─── Les van vandaag plannen ───

export function planLes(
  eenheden: Eenheid[],
  stand: ModuleStand | undefined,
  vandaag: number,
  perDag: number,
  maxHerhaal: number,
  stapsgewijs: boolean,
): DagLes {
  if (stand?.les && stand.les.dag === vandaag) return stand.les
  const items = stand?.items ?? {}
  const bekend = new Set(Object.keys(items))
  const herhaal = eenheden
    .filter((e) => bekend.has(e.id) && items[e.id].due <= vandaag)
    .sort((a, b) => items[a.id].due - items[b.id].due || items[a.id].box - items[b.id].box)
    .slice(0, maxHerhaal)
    .map((e) => e.id)
  // Bij een cursus pas verder als alles tot nu toe gehaald is.
  const blokkade = stapsgewijs && eenheden.some((e) => bekend.has(e.id) && items[e.id].box === 0)
  const nieuw = blokkade ? [] : eenheden.filter((e) => !bekend.has(e.id)).slice(0, perDag).map((e) => e.id)
  return { dag: vandaag, nieuw, herhaal }
}

export function verwerkUitslag(
  stand: ModuleStand | undefined,
  les: DagLes,
  gehaald: string[],
  gemist: string[],
  vandaag: number,
  goed: number,
  totaal: number,
): ModuleStand {
  const items = { ...(stand?.items ?? {}) }
  const nu = Date.now()
  for (const id of gehaald) {
    const oud = items[id]
    const box = Math.min((oud?.box ?? 0) + 1, MAX_BOX)
    items[id] = { box, due: vandaag + INTERVAL[box], laatst: nu, goed: (oud?.goed ?? 0) + 1, fout: oud?.fout ?? 0 }
  }
  for (const id of gemist) {
    const oud = items[id]
    items[id] = { box: 0, due: vandaag + 1, laatst: nu, goed: oud?.goed ?? 0, fout: (oud?.fout ?? 0) + 1 }
  }
  return { items, les: { ...les, klaar: { goed, totaal, gehaald, gemist } } }
}

// ─── Overzichten ───

export function voortgang(eenheden: Eenheid[], stand: ModuleStand | undefined) {
  const items = stand?.items ?? {}
  let gekend = 0
  let beheerst = 0
  let bezig = 0
  for (const e of eenheden) {
    const s = items[e.id]
    if (!s) continue
    if (s.box >= 4) beheerst += 1
    if (s.box >= 1) gekend += 1
    else bezig += 1
  }
  return { totaal: eenheden.length, gekend, beheerst, bezig }
}

export function reeks(g: Geheugen, vandaag: number): number {
  const vol = (n: number) => {
    const d = g.dagen[dagSleutel(n)]
    return !!d && d.gepland.length > 0 && d.gepland.every((m) => d.klaar.includes(m))
  }
  let n = vandaag
  if (!vol(n)) n -= 1
  let teller = 0
  while (vol(n)) {
    teller += 1
    n -= 1
  }
  return teller
}

// Poco a Poco bewaart zijn eigen voortgang; hier lezen we alleen hoeveel van
// de 30 woorden van vandaag af zijn.
export function pocoVandaag(vandaag: number): { klaar: number; totaal: number } {
  try {
    const raw = localStorage.getItem('pocoapoco.v1')
    if (!raw) return { klaar: 0, totaal: 30 }
    const d = JSON.parse(raw) as {
      settings?: { dailyWords?: number }
      daily?: { day: number; ids: string[]; prog: Record<string, { done?: number }>; done?: boolean }
    }
    const totaal = d.settings?.dailyWords ?? 30
    if (!d.daily || d.daily.day !== vandaag) return { klaar: 0, totaal }
    const klaar = d.daily.ids.filter((id) => d.daily!.prog[id]?.done).length
    return { klaar: d.daily.done ? Math.max(klaar, d.daily.ids.length) : klaar, totaal: d.daily.ids.length || totaal }
  } catch {
    return { klaar: 0, totaal: 30 }
  }
}
