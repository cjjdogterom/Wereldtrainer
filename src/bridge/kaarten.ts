// Bridge-engine: handen genereren, punten tellen en het openingsbod bepalen
// volgens het beginnerssysteem "vijfkaart hoog".
export type Kleur = 'S' | 'H' | 'D' | 'C'
export const KLEUREN: Kleur[] = ['S', 'H', 'D', 'C']
export const KLEUR_SYMBOOL: Record<Kleur, string> = { S: '♠', H: '♥', D: '♦', C: '♣' }

// rang 14=A, 13=H, 12=V, 11=B, 10…2
export type Hand = Record<Kleur, number[]>

export function rangLabel(r: number): string {
  return { 14: 'A', 13: 'H', 12: 'V', 11: 'B' }[r] ?? String(r)
}

export function maakHand(): Hand {
  const dek: { kleur: Kleur; rang: number }[] = []
  for (const kleur of KLEUREN) for (let r = 2; r <= 14; r += 1) dek.push({ kleur, rang: r })
  for (let i = dek.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[dek[i], dek[j]] = [dek[j], dek[i]]
  }
  const hand: Hand = { S: [], H: [], D: [], C: [] }
  for (const kaart of dek.slice(0, 13)) hand[kaart.kleur].push(kaart.rang)
  for (const kleur of KLEUREN) hand[kleur].sort((a, b) => b - a)
  return hand
}

export function hcp(hand: Hand): number {
  let punten = 0
  for (const kleur of KLEUREN)
    for (const r of hand[kleur]) punten += r === 14 ? 4 : r === 13 ? 3 : r === 12 ? 2 : r === 11 ? 1 : 0
  return punten
}

export function verdeling(hand: Hand): number[] {
  return KLEUREN.map((k) => hand[k].length).sort((a, b) => b - a)
}

export function isSans(hand: Hand): boolean {
  const v = verdeling(hand).join('')
  return v === '4333' || v === '4432' || v === '5332'
}

export type Bod = 'pas' | '1♣' | '1♦' | '1♥' | '1♠' | '1SA' | '2♣' | '2SA'

// Openingsbod volgens vijfkaart hoog (beginnersregels).
// Retourneert null voor handen die we in de trainer overslaan (20-21 onregelmatig).
export function openingsbod(hand: Hand): Bod | null {
  const punten = hcp(hand)
  const sans = isSans(hand)
  if (punten >= 22) return '2♣'
  if (punten >= 20) return sans ? '2SA' : null
  if (punten >= 15 && punten <= 17 && sans) return '1SA'
  if (punten >= 12) {
    const s = hand.S.length
    const h = hand.H.length
    if (s >= 5 || h >= 5) return s >= h ? '1♠' : '1♥'
    const d = hand.D.length
    const c = hand.C.length
    if (d > c) return '1♦'
    if (c > d) return '1♣'
    return d >= 4 ? '1♦' : '1♣'
  }
  return 'pas'
}

// Uitleg bij het goede openingsbod, voor de feedback in de trainer.
export function legUitOpening(hand: Hand, bod: Bod): string {
  const punten = hcp(hand)
  const s = hand.S.length
  const h = hand.H.length
  switch (bod) {
    case '2♣': return `${punten} punten: met 22+ open je altijd 2♣ (mancheforcing).`
    case '2SA': return `${punten} punten en een sans-verdeling: 2SA belooft 20–21 gebalanceerd.`
    case '1SA': return `${punten} punten en een sans-verdeling (geen renonce/singleton, hooguit één doubleton): 1SA = 15–17.`
    case '1♠': return `${punten} punten met een ${s}-kaart schoppen: met een vijfkaart hoog open je die kleur (bij 5-5 de hoogste).`
    case '1♥': return `${punten} punten met een ${h}-kaart harten en geen langere schoppen: open 1♥.`
    case '1♦': return `${punten} punten, geen vijfkaart hoog: open je langste lage kleur — hier ruiten.`
    case '1♣': return `${punten} punten, geen vijfkaart hoog: open je langste lage kleur — hier klaveren (bij 3-3 kies je 1♣, bij 4-4 1♦).`
    default: return `${punten} punten: minder dan 12, dus passen.`
  }
}
