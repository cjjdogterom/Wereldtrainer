// Hiërarchie van de Rooms-Katholieke Kerk — structuur en afbeeldingen
// overgenomen (beknopt) van nl.wikipedia.org/wiki/Hiërarchie_van_de_
// Rooms-Katholieke_Kerk; wapens via Wikimedia Commons.
export type Positie = {
  id: string
  naam: string
  omschrijving: string
  wapen?: string
  wapenUitleg?: string
  // rang binnen de doorlopende gezagsladder (1 = hoogste); alleen voor de
  // posities die echt boven/onder elkaar staan
  rang?: number
}

export type Sectie = {
  titel: string
  uitleg: string
  posities: Positie[]
}

// De doorlopende ladder van paus tot diaken (voor de "wie staat hoger?"-quiz
// en het overzicht).
export const LADDER: Positie[] = [
  { id: 'paus', naam: 'Paus', rang: 1, wapen: 'wapen-paus.jpg', omschrijving: 'Bisschop van Rome en hoofd van de wereldkerk: staat boven alle patriarchaten en kerkprovincies.' },
  { id: 'patriarch', naam: 'Patriarch', rang: 2, wapen: 'wapen-patriarch.jpg', omschrijving: 'Hoofd van een patriarchaat, een groep kerkprovincies met een eigen traditie.' },
  { id: 'aartsbisschop', naam: 'Aartsbisschop (metropoliet)', rang: 3, wapen: 'wapen-aartsbisschop.jpg', omschrijving: 'Hoofd van een aartsbisdom en van de kerkprovincie (metropool). In Nederland: Utrecht.' },
  { id: 'bisschop', naam: 'Bisschop', rang: 4, wapen: 'wapen-bisschop.png', omschrijving: 'Hoofd van een (suffragaan) bisdom. Ontvangt de volledige wijding: diaken, priester én bisschop.' },
  { id: 'hulpbisschop', naam: 'Hulpbisschop', rang: 5, omschrijving: 'Assisteert de bisschop; heeft wel de bisschopswijding (wijdingsmacht) maar geen eigen bestuursmacht.' },
  { id: 'deken', naam: 'Deken', rang: 6, wapen: 'wapen-deken-vicaris.png', omschrijving: 'Priester die een decanaat leidt: een groep parochies binnen het bisdom.' },
  { id: 'pastoor', naam: 'Pastoor', rang: 7, wapen: 'wapen-priester.jpg', omschrijving: 'Priester die een parochie leidt.' },
  { id: 'kapelaan', naam: 'Kapelaan', rang: 8, omschrijving: 'Priester die de pastoor in de parochie assisteert.' },
  { id: 'diaken', naam: 'Diaken', rang: 9, wapen: 'wapen-diaken.png', omschrijving: 'Eerste wijdingsgraad: mag dopen, huwelijken inzegenen en preken, maar geen eucharistie vieren.' },
]

// Secties volgens de opbouw van de Wikipedia-pagina (beknopt).
export const SECTIES: Sectie[] = [
  {
    titel: 'Wijdingshiërarchie',
    uitleg: 'De sacramentele kern: er zijn maar drie wijdingsgraden, en elke volgende wijding omvat de vorige. Alle functies en titels hierna zijn ambten of benoemingen — géén extra wijdingen.',
    posities: [
      { id: 'w-bisschop', naam: 'Bisschop (volle wijding)', wapen: 'wapen-bisschop.png', wapenUitleg: 'Groene galero met 6 kwasten per zijde, kruis en staf', omschrijving: 'Drie wijdingen ontvangen: diaken, priester en bisschop. Alleen een bisschop kan zelf wijden en het vormsel toedienen.' },
      { id: 'w-priester', naam: 'Priester', wapen: 'wapen-priester.jpg', wapenUitleg: 'Zwarte galero met 1 kwast per zijde', omschrijving: 'Twee wijdingen: diaken en priester. Mag de eucharistie vieren en de biecht afnemen.' },
      { id: 'w-diaken', naam: 'Diaken', wapen: 'wapen-diaken.png', wapenUitleg: 'Zwarte galero zonder kwastenkrans, met gekruiste stola', omschrijving: 'Eén wijding. Assisteert in liturgie en diaconie; transeunt (op weg naar het priesterschap) of permanent.' },
    ],
  },
  {
    titel: 'Ambtelijke hiërarchie — bisschoppelijke ambten',
    uitleg: 'Van hoog naar laag: wie bestuurt welk gebied.',
    posities: [
      { id: 'a-paus', naam: 'Paus', wapen: 'wapen-paus.jpg', wapenUitleg: 'Gekruiste sleutels van Petrus met tiara', omschrijving: 'Bisschop van Rome, opvolger van Petrus en hoofd van de wereldkerk.' },
      { id: 'a-patriarch', naam: 'Patriarch', wapen: 'wapen-patriarch.jpg', wapenUitleg: 'Groene galero met 15 kwasten per zijde en dubbelkruis', omschrijving: 'Hoofd van een patriarchaat (vooral in de oosterse katholieke kerken).' },
      { id: 'a-aartsbisschop', naam: 'Aartsbisschop / metropoliet', wapen: 'wapen-aartsbisschop.jpg', wapenUitleg: 'Groene galero met 10 kwasten per zijde en dubbelkruis; metropolieten dragen het pallium', omschrijving: 'Hoofd van een aartsbisdom en voorzitter van de kerkprovincie.' },
      { id: 'a-bisschop', naam: '(Suffragaan)bisschop', wapen: 'wapen-bisschop.png', wapenUitleg: 'Groene galero met 6 kwasten per zijde', omschrijving: 'Hoofd van een bisdom binnen de kerkprovincie.' },
      { id: 'a-hulpbisschop', naam: 'Hulpbisschop', omschrijving: 'Gewijd bisschop zonder eigen bisdom; assisteert de (aarts)bisschop.' },
    ],
  },
  {
    titel: 'Ambtelijke hiërarchie — priesterlijke ambten',
    uitleg: 'Binnen het bisdom leiden priesters decanaten en parochies.',
    posities: [
      { id: 'p-deken', naam: 'Deken', wapen: 'wapen-deken-vicaris.png', wapenUitleg: 'Zwarte galero met 2 kwasten per zijde', omschrijving: 'Leidt een decanaat: een groep parochies.' },
      { id: 'p-pastoor', naam: 'Pastoor', wapen: 'wapen-priester.jpg', omschrijving: 'Leidt een parochie.' },
      { id: 'p-kapelaan', naam: 'Kapelaan', omschrijving: 'Assisteert de pastoor in de parochie.' },
    ],
  },
  {
    titel: 'Vervangings- en hulpstructuren',
    uitleg: 'Functies die een hogere geestelijke vervangen of bijstaan.',
    posities: [
      { id: 'v-kardinaal', naam: 'Kardinaal', wapen: 'wapen-kardinaal.jpg', wapenUitleg: 'Rode galero met 15 kwasten per zijde', omschrijving: 'Door de paus benoemd; het College van Kardinalen kiest in het conclaaf de nieuwe paus. Intern verdeeld in kardinaal-bisschoppen, -priesters en -diakens.' },
      { id: 'v-vicaris', naam: 'Vicaris (vicaris-generaal)', wapen: 'wapen-vicaris-generaal.png', wapenUitleg: 'Zwarte galero met 2 kwasten per zijde boven een gevierendeeld schild', omschrijving: 'Plaatsvervanger van de bisschop; de vicaris-generaal is diens eerste man in het bestuur van het bisdom.' },
      { id: 'v-kanunnik', naam: 'Kanunnik', wapen: 'wapen-kanunnik.jpg', wapenUitleg: 'Zwarte galero met 1 kwast per zijde', omschrijving: 'Lid van het kapittel, het college dat de bisschop assisteert; onder leiding van een proost.' },
      { id: 'v-proost', naam: 'Proost / deken van het kapittel', wapen: 'wapen-proost-deken.jpg', wapenUitleg: 'Zwarte galero met 3 kwasten per zijde', omschrijving: 'Voorzitter van het kapittel.' },
      { id: 'v-nuntius', naam: 'Nuntius', omschrijving: 'Ambassadeur van de Heilige Stoel in een land; vrijwel altijd een (aarts)bisschop.' },
    ],
  },
  {
    titel: 'Eretitels (monseigneur)',
    uitleg: 'De paus kan verdienstelijke priesters een eretitel verlenen; dragers mogen zich monseigneur noemen en afwijkende kleding dragen.',
    posities: [
      { id: 'e-protonotaris', naam: 'Apostolisch protonotaris', wapen: 'wapen-protonotaris.png', wapenUitleg: 'Paarse galero met rode kwasten (6 per zijde)', omschrijving: 'Hoogste eretitel voor een priester.' },
      { id: 'e-ereprelaat', naam: 'Ereprelaat van Zijne Heiligheid', wapen: 'wapen-ereprelaat.png', wapenUitleg: 'Paarse galero met paarse kwasten (6 per zijde)', omschrijving: 'Tweede eretitel.' },
      { id: 'e-erekapelaan', naam: 'Kapelaan van Zijne Heiligheid', wapen: 'wapen-erekapelaan.png', wapenUitleg: 'Zwarte galero met paarse voering (6 kwasten per zijde)', omschrijving: 'Derde eretitel.' },
    ],
  },
  {
    titel: 'Ordes en congregaties',
    uitleg: 'Kloosterordes hebben een eigen rangorde naast de bisdomstructuur: generaal-overste → provinciaal → overste/abt → prior → leden (geprofeste, novice, postulant).',
    posities: [
      { id: 'o-gemijterde-abt', naam: 'Gemijterde abt', wapen: 'wapen-gemijterde-abt.jpg', wapenUitleg: 'Mijter boven het schild, met staf en zwarte galero', omschrijving: 'Abt met bisschoppelijke waardigheid; in rang gelijk aan een suffragaanbisschop.' },
      { id: 'o-abt', naam: 'Abt', wapen: 'wapen-abt.jpg', wapenUitleg: 'Zwarte galero met 6 kwasten per zijde en gesluierde staf', omschrijving: 'Hoofd van een abdij.' },
      { id: 'o-abdis', naam: 'Abdis', wapen: 'wapen-abdis.jpg', wapenUitleg: 'Ruitvormig schild met staf en rozenkrans', omschrijving: 'Vrouwelijk hoofd van een abdij.' },
      { id: 'o-generaal', naam: 'Generaal-overste', omschrijving: 'Hoogste bestuurder van een orde wereldwijd; daaronder de provinciaal (per land/gebied) en de prior.' },
    ],
  },
]

export const ALLE_POSITIES: Positie[] = [
  ...LADDER,
  ...SECTIES.flatMap((s) => s.posities).filter((p) => !LADDER.some((l) => l.naam.split(' ')[0].toLowerCase() === p.naam.split(' ')[0].toLowerCase())),
]
