import { dagSleutel, herhaalLijst, type Geheugen } from './geheugen'
import { HERHALEN, KRANT, SPAANS, STAMP_MODULES, stampVoor } from './rooster'

// De vaste volgorde van een dag: herhalen → nieuwe stof → Spaans → krant.
export type StapId = string

export type Stap = { id: StapId; soort: 'herhalen' | 'nieuw' | 'spaans' | 'krant'; klaar: boolean }

export function dagStappen(g: Geheugen, vandaag: number, poco: { klaar: number; totaal: number }): Stap[] {
  const klaar = g.dagen[dagSleutel(vandaag)]?.klaar ?? []
  const niets = herhaalLijst(g, STAMP_MODULES, vandaag).length === 0
  return [
    { id: HERHALEN, soort: 'herhalen', klaar: klaar.includes(HERHALEN) || niets },
    ...stampVoor().map((m) => ({ id: m, soort: 'nieuw' as const, klaar: klaar.includes(m) })),
    { id: SPAANS, soort: 'spaans', klaar: klaar.includes(SPAANS) || (poco.totaal > 0 && poco.klaar >= poco.totaal) },
    { id: KRANT, soort: 'krant', klaar: klaar.includes(KRANT) },
  ]
}

export function volgendeStap(stappen: Stap[]): Stap | undefined {
  return stappen.find((s) => !s.klaar)
}
