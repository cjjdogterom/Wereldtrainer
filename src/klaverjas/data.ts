// Klaverjassen (Amsterdams, "verplicht") — cursus en oefendata.
export type Kaart = { kleur: '♠' | '♥' | '♦' | '♣'; rang: string }

// Puntwaarden
export const TROEF_PUNTEN: Record<string, number> = { B: 20, '9': 14, A: 11, '10': 10, H: 4, V: 3, '8': 0, '7': 0 }
export const NIET_TROEF_PUNTEN: Record<string, number> = { A: 11, '10': 10, H: 4, V: 3, B: 2, '9': 0, '8': 0, '7': 0 }

// Sterkte (hoog → laag)
export const TROEF_VOLGORDE = ['B', '9', 'A', '10', 'H', 'V', '8', '7']
export const NIET_TROEF_VOLGORDE = ['A', '10', 'H', 'V', 'B', '9', '8', '7']

export const RANG_NAMEN: Record<string, string> = {
  A: 'aas', H: 'heer', V: 'vrouw', B: 'boer', '10': 'tien', '9': 'negen', '8': 'acht', '7': 'zeven',
}

// ── Wie wint de slag? (curated scenario's) ──
// kaarten in speelvolgorde; eerste kaart bepaalt de gevraagde kleur.
export type SlagScenario = {
  troef: Kaart['kleur']
  kaarten: { speler: string; kaart: Kaart }[]
  winnaar: string
  uitleg: string
}

export const SLAG_SCENARIOS: SlagScenario[] = [
  {
    troef: '♠',
    kaarten: [
      { speler: 'Noord', kaart: { kleur: '♥', rang: 'A' } },
      { speler: 'Oost', kaart: { kleur: '♥', rang: '10' } },
      { speler: 'Zuid', kaart: { kleur: '♥', rang: '7' } },
      { speler: 'West', kaart: { kleur: '♥', rang: 'H' } },
    ],
    winnaar: 'Noord',
    uitleg: 'Er is geen troef gespeeld, dus de hoogste kaart van de gevraagde kleur wint: de hartenaas.',
  },
  {
    troef: '♠',
    kaarten: [
      { speler: 'Noord', kaart: { kleur: '♥', rang: '10' } },
      { speler: 'Oost', kaart: { kleur: '♥', rang: 'H' } },
      { speler: 'Zuid', kaart: { kleur: '♥', rang: 'V' } },
      { speler: 'West', kaart: { kleur: '♥', rang: '9' } },
    ],
    winnaar: 'Noord',
    uitleg: 'Buiten troef is de volgorde A, 10, H, V, B, 9, 8, 7 — de tien is hier de hoogste.',
  },
  {
    troef: '♠',
    kaarten: [
      { speler: 'Noord', kaart: { kleur: '♥', rang: 'A' } },
      { speler: 'Oost', kaart: { kleur: '♠', rang: '7' } },
      { speler: 'Zuid', kaart: { kleur: '♥', rang: 'H' } },
      { speler: 'West', kaart: { kleur: '♥', rang: '10' } },
    ],
    winnaar: 'Oost',
    uitleg: 'Elke troef klopt elke niet-troefkaart: zelfs schoppen 7 wint van de hartenaas.',
  },
  {
    troef: '♠',
    kaarten: [
      { speler: 'Noord', kaart: { kleur: '♠', rang: 'A' } },
      { speler: 'Oost', kaart: { kleur: '♠', rang: '9' } },
      { speler: 'Zuid', kaart: { kleur: '♠', rang: 'H' } },
      { speler: 'West', kaart: { kleur: '♠', rang: '10' } },
    ],
    winnaar: 'Oost',
    uitleg: 'In troef is de volgorde B, 9, A, 10, H, V, 8, 7: de nel (troef 9) staat boven de aas.',
  },
  {
    troef: '♦',
    kaarten: [
      { speler: 'Zuid', kaart: { kleur: '♦', rang: '9' } },
      { speler: 'West', kaart: { kleur: '♦', rang: 'B' } },
      { speler: 'Noord', kaart: { kleur: '♦', rang: 'A' } },
      { speler: 'Oost', kaart: { kleur: '♦', rang: '10' } },
    ],
    winnaar: 'West',
    uitleg: 'De jas (troefboer) is de allerhoogste kaart van het spel.',
  },
  {
    troef: '♣',
    kaarten: [
      { speler: 'West', kaart: { kleur: '♥', rang: 'V' } },
      { speler: 'Noord', kaart: { kleur: '♥', rang: 'B' } },
      { speler: 'Oost', kaart: { kleur: '♣', rang: '8' } },
      { speler: 'Zuid', kaart: { kleur: '♣', rang: 'V' } },
    ],
    winnaar: 'Oost',
    uitleg: 'Twee spelers troeven in; in troef staat de 8 bóven de vrouw (B, 9, A, 10, H, V, 8, 7).',
  },
  {
    troef: '♥',
    kaarten: [
      { speler: 'Oost', kaart: { kleur: '♠', rang: 'A' } },
      { speler: 'Zuid', kaart: { kleur: '♥', rang: '7' } },
      { speler: 'West', kaart: { kleur: '♥', rang: '10' } },
      { speler: 'Noord', kaart: { kleur: '♠', rang: '10' } },
    ],
    winnaar: 'West',
    uitleg: 'Zuid troeft in, West overtroeft met de harten 10 — de hoogste troef wint.',
  },
  {
    troef: '♠',
    kaarten: [
      { speler: 'Zuid', kaart: { kleur: '♦', rang: 'H' } },
      { speler: 'West', kaart: { kleur: '♦', rang: '10' } },
      { speler: 'Noord', kaart: { kleur: '♦', rang: 'A' } },
      { speler: 'Oost', kaart: { kleur: '♦', rang: 'V' } },
    ],
    winnaar: 'Noord',
    uitleg: 'Geen troef gespeeld: de aas is buiten troef de hoogste kaart.',
  },
  {
    troef: '♣',
    kaarten: [
      { speler: 'Noord', kaart: { kleur: '♣', rang: 'B' } },
      { speler: 'Oost', kaart: { kleur: '♣', rang: '9' } },
      { speler: 'Zuid', kaart: { kleur: '♣', rang: 'A' } },
      { speler: 'West', kaart: { kleur: '♣', rang: '7' } },
    ],
    winnaar: 'Noord',
    uitleg: 'De jas (troefboer) verslaat ook de nel: B staat boven 9.',
  },
  {
    troef: '♦',
    kaarten: [
      { speler: 'West', kaart: { kleur: '♣', rang: '10' } },
      { speler: 'Noord', kaart: { kleur: '♣', rang: 'A' } },
      { speler: 'Oost', kaart: { kleur: '♣', rang: '8' } },
      { speler: 'Zuid', kaart: { kleur: '♣', rang: 'H' } },
    ],
    winnaar: 'Noord',
    uitleg: 'Iedereen bekent klaveren; de aas wint. Let op: de 10 van West is 10 punten voor de winnaar.',
  },
  {
    troef: '♥',
    kaarten: [
      { speler: 'Zuid', kaart: { kleur: '♥', rang: 'H' } },
      { speler: 'West', kaart: { kleur: '♥', rang: '8' } },
      { speler: 'Noord', kaart: { kleur: '♥', rang: 'V' } },
      { speler: 'Oost', kaart: { kleur: '♥', rang: '9' } },
    ],
    winnaar: 'Oost',
    uitleg: 'Troef gevraagd: de nel (9) is na de jas de hoogste troef en wint hier.',
  },
  {
    troef: '♠',
    kaarten: [
      { speler: 'Oost', kaart: { kleur: '♦', rang: 'A' } },
      { speler: 'Zuid', kaart: { kleur: '♠', rang: '10' } },
      { speler: 'West', kaart: { kleur: '♠', rang: 'H' } },
      { speler: 'Noord', kaart: { kleur: '♦', rang: '7' } },
    ],
    winnaar: 'Zuid',
    uitleg: 'Twee troeven: de 10 staat in troef boven de heer (B, 9, A, 10, H, …).',
  },
]

// ── Mag ik / moet ik? (Amsterdamse regels) ──
export type RegelVraag = {
  situatie: string
  opties: string[]
  goed: number
  uitleg: string
}

export const REGEL_VRAGEN: RegelVraag[] = [
  {
    situatie: 'Een tegenstander staat aan slag. Jij kunt de gevraagde kleur niet bekennen, maar je hebt wel troef. Wat moet je doen?',
    opties: ['Verplicht introeven', 'Vrij een kaart bijgooien', 'Passen'],
    goed: 0,
    uitleg: 'Amsterdams: kun je niet bekennen terwijl een tegenstander aan slag is, dan moet je troeven (en overtroeven als dat kan).',
  },
  {
    situatie: 'Je maat staat aan slag met de hoogste kaart. Jij kunt niet bekennen. Moet je troeven?',
    opties: ['Nee — je mag vrij bijgooien (mag wél troeven)', 'Ja, altijd', 'Alleen met de jas'],
    goed: 0,
    uitleg: 'Dít is het verschil met Rotterdams: staat je maat aan slag, dan hoef je bij Amsterdams niet in te troeven.',
  },
  {
    situatie: 'Troef wordt gevraagd. Jij hebt een hogere én een lagere troef dan wat er ligt. Wat moet je spelen?',
    opties: ['De hogere troef (overtroeven is verplicht)', 'Maakt niet uit', 'De lagere troef'],
    goed: 0,
    uitleg: 'In de troefkleur moet je altijd overtroeven als je kunt.',
  },
  {
    situatie: 'Een tegenstander heeft ingetroefd. Jij kunt niet bekennen en hebt alleen een lágere troef plus andere kaarten. Wat mag je?',
    opties: ['Een andere kaart bijgooien (ondertroeven hoeft niet)', 'Verplicht ondertroeven', 'De slag overslaan'],
    goed: 0,
    uitleg: 'Ondertroeven is alleen verplicht als je niets anders meer hebt dan troef.',
  },
  {
    situatie: 'Je kunt de gevraagde kleur gewoon bekennen, maar wilt liever troeven. Mag dat?',
    opties: ['Nee — bekennen is altijd verplicht', 'Ja, troeven mag altijd', 'Alleen in de laatste slag'],
    goed: 0,
    uitleg: 'Kleur bekennen gaat vóór alles. Niet bekennen terwijl het kan heet verzaken — en dat kost de partij.',
  },
  {
    situatie: 'Wie bepaalt bij "Amsterdams verplicht" de troefkleur?',
    opties: ['De speler links van de deler — en die móét spelen (geen pas)', 'Wie de hoogste kaart heeft', 'De deler'],
    goed: 0,
    uitleg: 'Bij verplicht spelen is er geen pasronde: de speler na de deler kiest troef en zijn team is de spelende partij.',
  },
  {
    situatie: 'De spelende partij haalt minder punten (incl. roem) dan de tegenpartij. Hoe heet dat en wat gebeurt er?',
    opties: ['"Nat" — alle 162 punten plus alle roem gaan naar de tegenpartij', 'Verlies met eigen punten', 'Het spel telt niet'],
    goed: 0,
    uitleg: 'Nat gaan is duur: de tegenstanders krijgen álles.',
  },
  {
    situatie: 'Jouw team wint alle acht de slagen. Hoe heet dat en wat levert het op?',
    opties: ['"Pit" — 100 punten extra roem', 'Dubbele punten', 'Niets extra'],
    goed: 0,
    uitleg: 'Alle slagen = pit (mars): 100 roem bovenop je punten.',
  },
  {
    situatie: 'Hoeveel extra punten is de laatste slag waard?',
    opties: ['10', '20', '0'],
    goed: 0,
    uitleg: 'De laatste slag geeft 10 extra punten; zo komt het totaal op 162.',
  },
  {
    situatie: 'Hoeveel punten moet de spelende partij minimaal halen om niet nat te gaan (zonder roem)?',
    opties: ['82', '81', '100'],
    goed: 0,
    uitleg: 'Meer dan de helft van 162, dus minstens 82.',
  },
]

// ── Roem ──
export type RoemVraag = {
  omschrijving: string
  punten: number
  uitleg: string
}

export const ROEM_VRAGEN: RoemVraag[] = [
  { omschrijving: 'Heer en vrouw van troef in één slag ("stuk")', punten: 20, uitleg: 'Stuk = troefheer + troefvrouw = 20 roem.' },
  { omschrijving: 'Drie opeenvolgende kaarten van dezelfde kleur (bijv. ♥7 ♥8 ♥9)', punten: 20, uitleg: 'Driekaart = 20. De roemvolgorde is 7-8-9-10-B-V-H-A.' },
  { omschrijving: 'Vier opeenvolgende kaarten van dezelfde kleur', punten: 50, uitleg: 'Vierkaart = 50.' },
  { omschrijving: 'Troefboer, troefvrouw en troefheer in één slag (B-V-H van troef)', punten: 40, uitleg: 'Driekaart (20) + stuk (20) = 40. Let op: voor roem telt de gewone volgorde, dus B-V-H is een serie.' },
  { omschrijving: 'Vier heren in één slag', punten: 100, uitleg: 'Vier gelijke plaatjes (A, H, V of 10) = 100 roem.' },
  { omschrijving: 'Vier boeren in één slag', punten: 200, uitleg: 'Vier boeren zijn het meest waard: 200 roem.' },
  { omschrijving: '♦10 ♦B ♦V ♦H in één slag (geen troef)', punten: 50, uitleg: 'Vier opeenvolgende kaarten = vierkaart = 50.' },
  { omschrijving: '♣A ♣H ♣V in één slag, klaveren is géén troef', punten: 20, uitleg: 'Gewone driekaart = 20 (geen stuk, want geen troef).' },
  { omschrijving: '♠H ♠V in één slag, schoppen is troef — maar verder geen serie', punten: 20, uitleg: 'Stuk = 20, ook zonder verdere serie.' },
  { omschrijving: 'Een slag zonder series, stuk of gelijke plaatjes', punten: 0, uitleg: 'Geen combinatie = geen roem.' },
]
