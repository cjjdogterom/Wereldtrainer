export type Onderwerp =
  | 'bevestigen'
  | 'wanden'
  | 'afwerken'
  | 'lakken'
  | 'elektra'
  | 'hout'
  | 'tegelen'
  | 'loodgieter'
  | 'isoleren'

export const ONDERWERPEN: { id: Onderwerp; titel: string; gereedschap: string; intro: string }[] = [
  { id: 'bevestigen', titel: 'Bevestigen & gereedschap', gereedschap: 'boormachine', intro: 'Pluggen, schroeven, ankers, boren en gereedschap: wat je waarin gebruikt, en waarom het andere niet houdt.' },
  { id: 'wanden', titel: 'Wanden & plafonds', gereedschap: 'waterpas', intro: 'Metal stud en houten regelwerk, gipsplaat plaatsen, naden afwerken, voorzetwanden en verlaagde plafonds.' },
  { id: 'afwerken', titel: 'Plamuren, stucen & sauzen', gereedschap: 'plamuurmes', intro: 'Van gat vullen tot een strakke muur: plamuren, gaas, voorstrijken, stucen en sauzen zonder strepen.' },
  { id: 'lakken', titel: 'Lakken tot spiegelglans', gereedschap: 'kwast', intro: 'Ondergrond, grondverf, voorlak, schuren en aflakken — met kwast, roller of spuit — tot een strak, spiegelend resultaat.' },
  { id: 'elektra', titel: 'Elektra aanleggen', gereedschap: 'kniptang', intro: 'Leidingen trekken, dozen plaatsen, aansluiten en controleren. De theorie staat in de module Elektronica.' },
  { id: 'hout', titel: 'Houtbewerking', gereedschap: 'zaag', intro: 'Houtsoorten en plaatmateriaal, zagen en frezen, verbindingen, deuren afhangen en hang- en sluitwerk.' },
  { id: 'tegelen', titel: 'Tegelen & kitten', gereedschap: 'lijmkam', intro: 'Ondergrond, waterdicht maken, lijmen, voegen en kitten zodat het jaren droog en strak blijft.' },
  { id: 'loodgieter', titel: 'Loodgieterswerk', gereedschap: 'pijptang', intro: 'Waterleiding en afvoer: knellen, persen, solderen, afschot, stankafsluiters en ontluchting.' },
  { id: 'isoleren', titel: 'Isoleren & vocht', gereedschap: 'kitpistool', intro: 'Warmte, damp en vocht: waar de dampremmer komt, ventilatie, koudebruggen en schimmel voorkomen.' },
]

// Stappenplan voor één klus.
export type Klus = {
  id: string
  onderwerp: Onderwerp
  titel: string
  niveau: 1 | 2 | 3 // 1 = eenvoudig, 3 = gevorderd
  wanneer: string // één of twee zinnen: wanneer en waarom deze aanpak
  materiaal: string[]
  gereedschap: string[]
  stappen: { titel: string; uitleg: string; tip?: string }[]
  valkuilen: string[]
}

// Keuzehulp: in situatie X gebruik je Y, en niet Z.
export type Keuze = {
  id: string
  onderwerp: Onderwerp
  vraag: string // de vraag waar de situatie bij hoort, bijv. 'Welke plug?' — groepeert de keuzes
  situatie: string // bijv. 'Een keukenkastje aan een enkele gipsplaatwand'
  keuze: string // het juiste product of de juiste methode
  waarom: string
  nietGebruiken?: string // wat je hier juist niet moet gebruiken, en waarom
  specs?: string[] // concrete maten: boordiameter, belasting, korrel, droogtijd …
}

// Wat ging er mis?
export type Probleem = {
  id: string
  onderwerp: Onderwerp
  symptoom: string
  oorzaken: { oorzaak: string; juist: boolean }[] // precies één juist, drie of vier opties
  uitleg: string // waarom dát de oorzaak is
  oplossing: string // hoe je het nu herstelt
  voorkomen: string // hoe je het de volgende keer voorkomt
}
