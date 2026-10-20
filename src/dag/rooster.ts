// Vast weekrooster: elke dag Spaans (Poco a Poco) plus drie onderwerpen.
// Topografie, bridge, geschiedenis en elektronica komen twee keer per week.
// Sleutel = dag van de week zoals Date.getDay() (0 = zondag).
export const ROOSTER: Record<number, string[]> = {
  1: ['topografie', 'elektronica', 'bridge'],
  2: ['geschiedenis', 'planten', 'weetjes'],
  3: ['europa', 'vervoer', 'klaverjas'],
  4: ['topografie', 'klussen', 'bridge'],
  5: ['kerk', 'vogels', 'geld'],
  6: ['geschiedenis', 'elektronica', 'voetbal'],
  0: ['rangen', 'knopen', 'seinen'],
}

export const DAGNAMEN = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag']

// Maandag eerst, zoals in een agenda.
export const WEEKVOLGORDE = [1, 2, 3, 4, 5, 6, 0]

export function roosterVoor(datum = new Date()): string[] {
  return ROOSTER[datum.getDay()] ?? []
}
