// De dag bestaat uit twee delen:
// 1. Stampen: elke dag Spaans (Poco a Poco) plus twee onderwerpen met
//    leerkaarten, overhoring en slim herhalen.
// 2. De krant: vier artikelen om rustig te lezen en af te vinken.
// Sleutel = dag van de week zoals Date.getDay() (0 = zondag).

export const STAMP_MODULES = ['topografie', 'bridge', 'seinen', 'rangen', 'knopen']

export const STAMP_ROOSTER: Record<number, string[]> = {
  1: ['topografie', 'bridge'],
  2: ['seinen', 'rangen'],
  3: ['topografie', 'knopen'],
  4: ['bridge', 'seinen'],
  5: ['topografie', 'rangen'],
  6: ['bridge', 'knopen'],
  0: ['topografie', 'seinen'],
}

// Het eerste onderwerp levert het hoofdartikel op de voorpagina.
export const KRANT_ROOSTER: Record<number, string[]> = {
  1: ['elektronica', 'geschiedenis', 'vogels', 'weetjes'],
  2: ['vervoer', 'europa', 'planten', 'geld'],
  3: ['klussen', 'geschiedenis', 'kerk', 'klaverjas'],
  4: ['elektronica', 'europa', 'vogels', 'voetbal'],
  5: ['vervoer', 'geschiedenis', 'planten', 'weetjes'],
  6: ['klussen', 'kerk', 'geld', 'voetbal'],
  0: ['elektronica', 'geschiedenis', 'planten', 'klaverjas'],
}

export const KRANT = 'krant'

export const DAGNAMEN = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag']

// Maandag eerst, zoals in een agenda.
export const WEEKVOLGORDE = [1, 2, 3, 4, 5, 6, 0]

export function stampVoor(datum = new Date()): string[] {
  return STAMP_ROOSTER[datum.getDay()] ?? []
}

export function krantVoor(datum = new Date()): string[] {
  return KRANT_ROOSTER[datum.getDay()] ?? []
}

// Wat er vandaag af moet voor de reeks (Spaans telt apart via Poco a Poco).
export function dagTaken(datum = new Date()): string[] {
  return [...stampVoor(datum), KRANT]
}
