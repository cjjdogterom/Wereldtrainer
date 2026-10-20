import { fetchKey, saveKey } from '../lib/sync'

export type Uitslag = 'goed' | 'fout'

export type DagStand = {
  v: 1
  // datum (YYYY-MM-DD) → module-id → uitslag van het dagitem
  dagen: Record<string, Record<string, Uitslag>>
  updatedAt: number
}

const LS_KEY = 'wt-dag-v1'
// Een dag telt mee voor de reeks vanaf dit aantal afgeronde onderdelen.
export const REEKS_DREMPEL = 6

// Zelfde dagnummer als Poco a Poco, zodat beide het over "vandaag" eens zijn.
export function dagNummer(d = new Date()): number {
  return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000)
}

export function dagSleutel(n: number): string {
  return new Date(n * 86400000).toISOString().slice(0, 10)
}

function leeg(): DagStand {
  return { v: 1, dagen: {}, updatedAt: 0 }
}

export function laadLokaal(): DagStand {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return leeg()
    const d = JSON.parse(raw) as DagStand
    return d && d.dagen ? d : leeg()
  } catch {
    return leeg()
  }
}

export function bewaar(stand: DagStand) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(stand))
  } catch {
    /* privémodus of vol */
  }
  saveKey('dag', stand)
}

export function samenvoegen(a: DagStand, b: DagStand): DagStand {
  const dagen: DagStand['dagen'] = { ...a.dagen }
  for (const [dag, items] of Object.entries(b.dagen ?? {})) {
    dagen[dag] = { ...items, ...(dagen[dag] ?? {}) }
  }
  return { v: 1, dagen, updatedAt: Math.max(a.updatedAt, b.updatedAt ?? 0) }
}

export async function laadGesynchroniseerd(): Promise<DagStand | null> {
  const extern = await fetchKey<DagStand>('dag')
  if (!extern) return null
  const samen = samenvoegen(laadLokaal(), extern)
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(samen))
  } catch {
    /* negeren */
  }
  return samen
}

export function reeks(stand: DagStand, vandaag: number, extraVandaag = 0): number {
  const telt = (n: number) =>
    Object.keys(stand.dagen[dagSleutel(n)] ?? {}).length + (n === vandaag ? extraVandaag : 0) >= REEKS_DREMPEL
  let n = vandaag
  if (!telt(n)) n -= 1 // vandaag nog bezig telt niet tegen
  let teller = 0
  while (telt(n)) {
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
