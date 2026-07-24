// Antwoordbod-scenario's (gecureerd): partner opent, wat bied jij?
// Handen als tekst per kleur (♠ ♥ ♦ ♣), hoog → laag.
export type AntwoordScenario = {
  opening: string
  hand: [string, string, string, string]
  hcp: number
  opties: string[]
  goed: number
  uitleg: string
}

export const ANTWOORD_SCENARIOS: AntwoordScenario[] = [
  {
    opening: '1♠',
    hand: ['V 8 4', 'H 7 3', 'B 8 6 2', '9 5 3'],
    hcp: 7,
    opties: ['2♠', '1SA', 'pas', '3♠'],
    goed: 0,
    uitleg: 'Met 6–9 punten en driekaart steun voor partners vijfkaart steun je gewoon: 2♠.',
  },
  {
    opening: '1♠',
    hand: ['8 4', 'V B 7 3', 'H 8 6 2', '9 5 3'],
    hcp: 6,
    opties: ['1SA', '2♥', 'pas', '2♠'],
    goed: 0,
    uitleg: 'Geen steun (maar twee schoppen) en 6–9 punten; een nieuwe kleur op 2-niveau belooft 10+ — dus 1SA als vangnet.',
  },
  {
    opening: '1♠',
    hand: ['H V 8 4', 'A 7 3', '8 6 2', '9 5 3'],
    hcp: 9,
    opties: ['3♠', '2♠', '4♠', '1SA'],
    goed: 1,
    uitleg: 'Vierkaart steun maar 9 punten: dat is nog gewoon 2♠ (6–9). Vanaf 10–11 bied je 3♠.',
  },
  {
    opening: '1♠',
    hand: ['A V 8 4', 'H 7 3', 'H 8 6 2', '9 5'],
    hcp: 13,
    opties: ['4♠', '2♠', '2♦', '3♠'],
    goed: 2,
    uitleg: 'Met 12+ punten eerst een nieuwe kleur op 2-niveau (2♦) — daarna kun je altijd nog naar de schoppenmanche.',
  },
  {
    opening: '1♥',
    hand: ['7 4', 'V 9 6 3', 'A 8 5 2', '8 6 3'],
    hcp: 6,
    opties: ['2♥', 'pas', '1SA', '2♦'],
    goed: 0,
    uitleg: 'Driekaart of langer mee in partners hartenkleur en 6–9 punten: steun met 2♥.',
  },
  {
    opening: '1♥',
    hand: ['A V 8 6 3', '7 4', 'H 8 5', '8 6 3'],
    hcp: 9,
    opties: ['1♠', '1SA', '2♠', 'pas'],
    goed: 0,
    uitleg: 'Een nieuwe kleur op 1-niveau (1♠) kan al vanaf 6 punten en toont je vijfkaart schoppen.',
  },
  {
    opening: '1♥',
    hand: ['8 3', '7 4', 'V 8 5 2', 'B 7 6 3 2'],
    hcp: 3,
    opties: ['pas', '1SA', '2♣', '2♥'],
    goed: 0,
    uitleg: 'Met 0–5 punten pas je op elke opening van partner.',
  },
  {
    opening: '1♣',
    hand: ['V 8 6 3', 'A 7 4 2', '8 5', '9 6 3'],
    hcp: 6,
    opties: ['1♥', '1♠', '1SA', 'pas'],
    goed: 0,
    uitleg: 'Nieuwe kleuren "van onderaf": met twee vierkaarten bied je de laagste eerst — 1♥.',
  },
  {
    opening: '1♦',
    hand: ['H B 8 6 3', '7 4', 'V 5 2', '9 6 3'],
    hcp: 7,
    opties: ['1♠', '2♦', '1SA', 'pas'],
    goed: 0,
    uitleg: 'Een vijfkaart schoppen eerst laten zien: 1♠ (6+ punten volstaat op 1-niveau).',
  },
  {
    opening: '1SA',
    hand: ['V 8 4', 'H 7 3', 'B 8 6 2', '9 5 3'],
    hcp: 7,
    opties: ['pas', '2SA', '3SA', '2♦'],
    goed: 0,
    uitleg: 'Partner heeft 15–17. Met 0–7 punten en een vlakke hand: pas — samen te weinig voor de manche.',
  },
  {
    opening: '1SA',
    hand: ['V 8 4', 'H 7 3', 'A 8 6 2', '9 5 3'],
    hcp: 9,
    opties: ['2SA', 'pas', '3SA', '2♣'],
    goed: 0,
    uitleg: 'Met 8–9 punten nodig je uit met 2SA: partner past met 15 en biedt 3SA met 16–17.',
  },
  {
    opening: '1SA',
    hand: ['V 8 4', 'H 7 3', 'A 8 6 2', 'H 5 3'],
    hcp: 12,
    opties: ['3SA', '2SA', 'pas', '2♦'],
    goed: 0,
    uitleg: 'Met 10+ punten en geen lange hoge kleur bied je meteen de manche: 3SA (samen minstens 25).',
  },
  {
    opening: '1♥',
    hand: ['V 8', 'H B 6 3', 'A 8 6 2', '9 5 3'],
    hcp: 11,
    opties: ['3♥', '2♥', '4♥', '1SA'],
    goed: 0,
    uitleg: 'Vierkaart steun en 10–11 punten: inviteer met 3♥; partner biedt met extra\'s de manche 4♥.',
  },
  {
    opening: '1♠',
    hand: ['H V 8 4', 'A 7 3', 'H 8 6', '9 5 3'],
    hcp: 13,
    opties: ['4♠', '2♠', '3♠', '2♣'],
    goed: 0,
    uitleg: 'Vierkaart steun en 12+ punten: samen genoeg voor de manche — bied 4♠ (of eerst een nieuwe kleur; direct 4♠ is hier prima).',
  },
]
