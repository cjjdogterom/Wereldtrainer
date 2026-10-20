// Openingslogica van de Biedtrainer (public/bridge/biedtrainer.html), in TypeScript,
// zodat de dagtrainer exact dezelfde regels gebruikt: honneur- plus lengtepunten.

export type Kleur = 'S' | 'H' | 'D' | 'C'
export type Rang = 'A' | 'H' | 'V' | 'B' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2'
export type Kaart = { k: Kleur; r: Rang }

export const KLEUREN: Kleur[] = ['S', 'H', 'D', 'C']
export const RANGEN: Rang[] = ['A', 'H', 'V', 'B', '10', '9', '8', '7', '6', '5', '4', '3', '2']
export const SYMBOOL: Record<Kleur, string> = { S: '♠', H: '♥', D: '♦', C: '♣' }
const PUNTEN: Partial<Record<Rang, number>> = { A: 4, H: 3, V: 2, B: 1 }
const NAAM: Record<Kleur, string> = { S: 'schoppen', H: 'harten', D: 'ruiten', C: 'klaveren' }

export type Lengtes = Record<Kleur, number>

export function lengtes(hand: Kaart[]): Lengtes {
  const l: Lengtes = { S: 0, H: 0, D: 0, C: 0 }
  for (const c of hand) l[c.k] += 1
  return l
}

export function hcp(hand: Kaart[]): number {
  return hand.reduce((t, c) => t + (PUNTEN[c.r] ?? 0), 0)
}

export function lengtePunten(l: Lengtes): number {
  return KLEUREN.reduce((t, k) => t + Math.max(0, l[k] - 4), 0)
}

function verdeling(l: Lengtes): string {
  return KLEUREN.map((k) => l[k]).sort((a, b) => b - a).join('-')
}

function isSans(l: Lengtes): boolean {
  const v = verdeling(l)
  return v === '4-3-3-3' || v === '4-4-3-2' || v === '5-3-3-2'
}

// Bodnotatie zoals in de trainer: '1S', '1NT', 'PAS'.
export function bodTekst(b: string): string {
  if (b === 'PAS') return 'Pas'
  const s = b.slice(1)
  return b[0] + (s === 'NT' ? 'SA' : SYMBOOL[s as Kleur])
}

export function opening(hand: Kaart[]): { bod: string; uitleg: string } {
  const l = lengtes(hand)
  const p = hcp(hand) + lengtePunten(l)
  const sans = isSans(l)
  const uit = (bod: string, uitleg: string) => ({ bod, uitleg })

  if (p >= 22) return uit('2C', `Met ${p} punten open je 2♣: de sterkste opening, mancheforcing.`)
  if (sans && p >= 20 && p <= 21) return uit('2NT', `Sans-verdeling (${verdeling(l)}) met ${p} punten: open 2SA (20–21).`)
  if (sans && p >= 15 && p <= 17) return uit('1NT', `Sans-verdeling (${verdeling(l)}) met ${p} punten: open 1SA (15–17).`)
  if (p >= 12) {
    if (l.S >= 5 || l.H >= 5) {
      if (l.S >= 5 && l.H >= 5) return uit('1S', `Twee vijfkaarten hoog: open de hoogste, 1♠. (${p} punten)`)
      const bod = l.S > l.H ? '1S' : l.H > l.S ? '1H' : '1S'
      const k: Kleur = bod === '1S' ? 'S' : 'H'
      return uit(bod, `Met ${p} punten en een ${l[k]}-kaart ${NAAM[k]} open je ${bodTekst(bod)} (5-kaart hoog).`)
    }
    if (l.D > l.C) return uit('1D', `Geen 5-kaart hoog: open je langste lage kleur, ${l.D}-kaart ruiten. (${p} punten)`)
    if (l.C > l.D) return uit('1C', `Geen 5-kaart hoog: open je langste lage kleur, ${l.C}-kaart klaveren. (${p} punten)`)
    if (l.D >= 4) return uit('1D', `Geen 5-kaart hoog, lage kleuren gelijk (${l.D}-${l.C}): met 4-4 of langer open je 1♦. (${p} punten)`)
    return uit('1C', `Geen 5-kaart hoog, lage kleuren 3-3: open 1♣. (${p} punten)`)
  }
  for (const k of ['S', 'H', 'D'] as Kleur[]) {
    if (l[k] === 6 && p >= 6 && p <= 10)
      return uit(`2${k}`, `Zwakke twee: 6–10 punten met een 6-kaart ${NAAM[k]}. Lastig voor de tegenpartij, beschrijvend voor partner.`)
  }
  for (const k of KLEUREN) {
    if (l[k] >= 7 && p >= 5 && p <= 9)
      return uit(`3${k}`, `Preëmptief: een 7-kaart ${NAAM[k]} met ${p} punten. Op 3-niveau openen neemt de tegenpartij biedruimte af.`)
  }
  return uit('PAS', `Met ${p} punten (minder dan 12) en geen preëmptieve hand: pas.`)
}
