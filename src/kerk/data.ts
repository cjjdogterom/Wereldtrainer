// Hiërarchie van de Rooms-Katholieke Kerk, op basis van
// nl.wikipedia.org/wiki/Hiërarchie_van_de_Rooms-Katholieke_Kerk
export type Positie = {
  id: string
  naam: string
  omschrijving: string
  // rang binnen de doorlopende gezagsladder (1 = hoogste); alleen voor de
  // posities die echt boven/onder elkaar staan
  rang?: number
}

export type Groep = {
  titel: string
  uitleg: string
  posities: Positie[]
}

// De doorlopende ladder van paus tot kapelaan/diaken (ambtelijke hiërarchie).
export const LADDER: Positie[] = [
  { id: 'paus', naam: 'Paus', rang: 1, omschrijving: 'Bisschop van Rome en hoofd van de wereldkerk: staat boven alle patriarchaten en kerkprovincies.' },
  { id: 'patriarch', naam: 'Patriarch', rang: 2, omschrijving: 'Hoofd van een patriarchaat, een groep kerkprovincies met een eigen traditie.' },
  { id: 'aartsbisschop', naam: 'Aartsbisschop (metropoliet)', rang: 3, omschrijving: 'Hoofd van een aartsbisdom en van de kerkprovincie (metropool) waar dat bisdom toe behoort. In Nederland: Utrecht.' },
  { id: 'bisschop', naam: 'Bisschop', rang: 4, omschrijving: 'Hoofd van een bisdom (suffragaan bisdom). Ontvangt de volledige wijding: diaken, priester én bisschop.' },
  { id: 'hulpbisschop', naam: 'Hulpbisschop', rang: 5, omschrijving: 'Assisteert de bisschop; heeft wel de bisschopswijding (wijdingsmacht) maar geen eigen bestuursmacht.' },
  { id: 'deken', naam: 'Deken', rang: 6, omschrijving: 'Priester die een decanaat leidt: een groep parochies binnen het bisdom.' },
  { id: 'pastoor', naam: 'Pastoor', rang: 7, omschrijving: 'Priester die een parochie leidt.' },
  { id: 'kapelaan', naam: 'Kapelaan', rang: 8, omschrijving: 'Priester die de pastoor in de parochie assisteert.' },
  { id: 'diaken', naam: 'Diaken', rang: 9, omschrijving: 'Eerste wijdingsgraad: mag dopen, huwelijken inzegenen en preken, maar geen eucharistie vieren. Transeunt (op weg naar het priesterschap) of permanent.' },
]

export const GROEPEN: Groep[] = [
  {
    titel: 'Wijdingen',
    uitleg: 'De sacramentele wijdingshiërarchie staat los van functies en benoemingen: er zijn maar drie wijdingsgraden.',
    posities: [
      { id: 'w-bisschop', naam: 'Bisschop (volle wijding)', omschrijving: 'Heeft alle drie de wijdingen ontvangen: diaken-, priester- en bisschopswijding.' },
      { id: 'w-priester', naam: 'Priester', omschrijving: 'Heeft twee wijdingen: diaken en priester. Mag de eucharistie vieren en de biecht afnemen.' },
      { id: 'w-diaken', naam: 'Diaken', omschrijving: 'Eerste wijding. Assisteert in liturgie en diaconie.' },
    ],
  },
  {
    titel: 'Kardinalen en assistenten',
    uitleg: 'Naast de gewone ladder bestaan functies die een hogere geestelijke vervangen of bijstaan.',
    posities: [
      { id: 'kardinaal', naam: 'Kardinaal', omschrijving: 'Door de paus benoemd; het College van Kardinalen kiest in het conclaaf de nieuwe paus. Intern verdeeld in kardinaal-bisschoppen, kardinaal-priesters en kardinaal-diakens.' },
      { id: 'nuntius', naam: 'Nuntius', omschrijving: 'Ambassadeur van de Heilige Stoel in een land; vrijwel altijd een (aarts)bisschop.' },
      { id: 'vicaris', naam: 'Vicaris', omschrijving: 'Vervanger van de bisschop. De vicaris-generaal is diens eerste plaatsvervanger in het bestuur van het bisdom.' },
      { id: 'kanunnik', naam: 'Kanunnik', omschrijving: 'Lid van het kapittel, het college dat de bisschop assisteert (onder leiding van een proost).' },
    ],
  },
  {
    titel: 'Eretitels',
    uitleg: 'De paus kan verdienstelijke priesters een eretitel geven; zij mogen zich dan monseigneur noemen.',
    posities: [
      { id: 'protonotaris', naam: 'Apostolisch protonotaris', omschrijving: 'Hoogste eretitel voor een priester.' },
      { id: 'ereprelaat', naam: 'Ereprelaat van Zijne Heiligheid', omschrijving: 'Tweede eretitel.' },
      { id: 'erekapelaan', naam: 'Kapelaan van Zijne Heiligheid', omschrijving: 'Derde eretitel.' },
      { id: 'monseigneur', naam: 'Monseigneur', omschrijving: 'Aanspreektitel voor bisschoppen én voor priesters met een pauselijke eretitel — geen ambt op zich.' },
    ],
  },
  {
    titel: 'Ordes en congregaties',
    uitleg: 'Kloosterordes hebben een eigen bestuurlijke rangorde naast de bisdomstructuur.',
    posities: [
      { id: 'generaal-overste', naam: 'Generaal-overste', omschrijving: 'Hoogste bestuurder van een orde wereldwijd.' },
      { id: 'provinciaal', naam: 'Provinciaal', omschrijving: 'Leidt een (lands)provincie van de orde.' },
      { id: 'abt', naam: 'Abt / abdis', omschrijving: 'Hoofd van een abdij. Een gemijterde abt staat in rang gelijk aan een bisschop van een suffragaan bisdom.' },
      { id: 'prior', naam: 'Prior', omschrijving: 'Hoofd van een priorij of plaatsvervanger van de abt.' },
      { id: 'novice', naam: 'Novice / postulant', omschrijving: 'Nieuw lid: postulant (nog geen geloften), novice (tijdelijke geloften), geprofeste (eeuwige geloften).' },
    ],
  },
]

export const ALLE_POSITIES: Positie[] = [...LADDER, ...GROEPEN.flatMap((g) => g.posities)]
