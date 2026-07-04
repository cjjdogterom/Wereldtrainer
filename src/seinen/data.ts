// Internationale seinvlaggen (A–Z): NAVO-spelalfabet, morsecode en de
// betekenis van elke vlag als enkelvoudig sein (Internationaal Seinboek).
export type Sein = {
  letter: string
  navo: string
  morse: string
  betekenis: string
}

export const SEINEN: Sein[] = [
  { letter: 'A', navo: 'Alfa', morse: '·−', betekenis: 'Ik heb een duiker beneden; houd goed vrij op langzame vaart.' },
  { letter: 'B', navo: 'Bravo', morse: '−···', betekenis: 'Ik laad, los of vervoer gevaarlijke stoffen.' },
  { letter: 'C', navo: 'Charlie', morse: '−·−·', betekenis: 'Ja (bevestigend).' },
  { letter: 'D', navo: 'Delta', morse: '−··', betekenis: 'Houd vrij van mij; ik manoeuvreer met moeite.' },
  { letter: 'E', navo: 'Echo', morse: '·', betekenis: 'Ik verander mijn koers naar stuurboord.' },
  { letter: 'F', navo: 'Foxtrot', morse: '··−·', betekenis: 'Ik ben onmanoeuvreerbaar; zoek verbinding met mij.' },
  { letter: 'G', navo: 'Golf', morse: '−−·', betekenis: 'Ik heb een loods nodig. (Vissers: ik haal mijn netten in.)' },
  { letter: 'H', navo: 'Hotel', morse: '····', betekenis: 'Ik heb een loods aan boord.' },
  { letter: 'I', navo: 'India', morse: '··', betekenis: 'Ik verander mijn koers naar bakboord.' },
  { letter: 'J', navo: 'Juliett', morse: '·−−−', betekenis: 'Houd goed vrij: ik heb brand aan boord en gevaarlijke lading.' },
  { letter: 'K', navo: 'Kilo', morse: '−·−', betekenis: 'Ik wens verbinding met u.' },
  { letter: 'L', navo: 'Lima', morse: '·−··', betekenis: 'Stop uw schip onmiddellijk.' },
  { letter: 'M', navo: 'Mike', morse: '−−', betekenis: 'Mijn schip ligt gestopt en maakt geen vaart.' },
  { letter: 'N', navo: 'November', morse: '−·', betekenis: 'Nee (ontkennend).' },
  { letter: 'O', navo: 'Oscar', morse: '−−−', betekenis: 'Man overboord.' },
  { letter: 'P', navo: 'Papa', morse: '·−−·', betekenis: 'In de haven (Blue Peter): iedereen aan boord, het schip vertrekt.' },
  { letter: 'Q', navo: 'Quebec', morse: '−−·−', betekenis: 'Mijn schip is gezond; ik verzoek vrije praktijk.' },
  { letter: 'R', navo: 'Romeo', morse: '·−·', betekenis: 'Geen eigen betekenis als los sein (procedure: "ontvangen").' },
  { letter: 'S', navo: 'Sierra', morse: '···', betekenis: 'Mijn machines slaan achteruit.' },
  { letter: 'T', navo: 'Tango', morse: '−', betekenis: 'Houd vrij van mij; ik ben bezig met spannetvissen.' },
  { letter: 'U', navo: 'Uniform', morse: '··−', betekenis: 'U koerst een gevaar tegemoet.' },
  { letter: 'V', navo: 'Victor', morse: '···−', betekenis: 'Ik heb hulp nodig.' },
  { letter: 'W', navo: 'Whiskey', morse: '·−−', betekenis: 'Ik heb medische hulp nodig.' },
  { letter: 'X', navo: 'X-ray', morse: '−··−', betekenis: 'Staak uw voornemen en let op mijn seinen.' },
  { letter: 'Y', navo: 'Yankee', morse: '−·−−', betekenis: 'Mijn anker krabt.' },
  { letter: 'Z', navo: 'Zulu', morse: '−−··', betekenis: 'Ik heb een sleepboot nodig. (Vissers: ik schiet mijn netten.)' },
]

export const CIJFER_MORSE: { cijfer: string; morse: string }[] = [
  { cijfer: '1', morse: '·−−−−' },
  { cijfer: '2', morse: '··−−−' },
  { cijfer: '3', morse: '···−−' },
  { cijfer: '4', morse: '····−' },
  { cijfer: '5', morse: '·····' },
  { cijfer: '6', morse: '−····' },
  { cijfer: '7', morse: '−−···' },
  { cijfer: '8', morse: '−−−··' },
  { cijfer: '9', morse: '−−−−·' },
  { cijfer: '0', morse: '−−−−−' },
]
