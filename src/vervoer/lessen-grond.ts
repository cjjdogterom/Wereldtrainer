import type { Les } from './types'

// Lessen voor de grond- en watervoertuigen en helikopters (luchtvaart staat in een apart bestand).
export const LESSEN_GROND: Les[] = [
  // ───────────────────────────── AUTO ─────────────────────────────
  {
    id: 'viertakt-kleptiming',
    categorie: 'auto',
    titel: 'Viertakt in detail: kleptiming en compressie',
    kern: 'Kleppen openen eerder en sluiten later dan het dode punt, omdat gas massa heeft en traagheid benut kan worden.',
    uitleg: [
      "Op papier opent de inlaatklep in het bovenste dode punt (BDP) en sluit hij in het onderste dode punt (ODP). In werkelijkheid opent de inlaat al zo'n 10–30° krukas vóór BDP en sluit hij pas 30–70° ná ODP. De reden is traagheid: de luchtkolom in het inlaatspruitstuk komt op snelheid en blijft doorstromen terwijl de zuiger alweer omhoog gaat. Zo vul je de cilinder beter dan het puur geometrische slagvolume.",
      "De uitlaat opent juist ruim vóór ODP (zo'n 40–60°), tijdens de arbeidsslag. Je offert een beetje expansie op, maar de restdruk blaast het meeste uitlaatgas er al uit, zodat de zuiger in de uitlaatslag minder pompverlies heeft. Rond BDP staan inlaat- en uitlaatklep even allebei open: de klepoverlap. De wegstromende uitlaatgassen zuigen dan verse lading mee naar binnen (spoeling).",
      "Veel overlap is goed bij hoge toerentallen (de gasstromen zijn snel en traagheid domineert), maar bij stationair stroomt uitlaatgas terug de inlaat in: onrustig stationair en slechte emissie. Daarom hebben moderne motoren variabele nokkenastiming (VVT, VANOS, VTEC-achtige systemen) die de nokkenas ten opzichte van de krukas verdraait en de timing per toerental optimaliseert.",
      "De compressieverhouding is (slagvolume + compressievolume) / compressievolume. Hoger betekent meer thermisch rendement, maar bij benzine is klop (ongecontroleerde zelfontbranding) de grens, daarom zo'n 10:1 tot 13:1. Een diesel comprimeert alleen lucht, 15:1 tot 18:1, waardoor die lucht zó heet wordt (ruim 600 °C) dat ingespoten diesel vanzelf ontbrandt. Een bougie is dus overbodig; gloeibougies helpen alleen bij een koude start."
    ],
    feiten: [
      'Eén volledige viertaktcyclus kost 720° krukas: twee omwentelingen voor één arbeidsslag per cilinder.',
      'De nokkenas draait daarom half zo snel als de krukas (overbrenging 2:1 via riem of ketting).',
      'Benzinemotoren: compressie ca. 10:1–13:1; enkele motoren met directe injectie halen 14:1.',
      'Dieselmotoren: ca. 15:1–18:1 (oudere wervelkamerdiesels zelfs boven 20:1).',
      'Compressie-einddruk in een diesel: orde 30–50 bar, nog vóór de verbranding.'
    ],
    formules: [
      { formule: 'ε = (Vs + Vc) / Vc', betekenis: 'Compressieverhouding: Vs = slagvolume van één cilinder, Vc = compressieruimte boven de zuiger in BDP.' },
      { formule: 'n_nokkenas = n_krukas / 2', betekenis: 'Bij een viertakt opent elke klep één keer per twee krukasomwentelingen.' }
    ],
    beeld: 'viertakt',
    letOp: 'Een gebroken distributieriem bij een zogenaamde interferentiemotor laat zuigers tegen openstaande kleppen slaan: forse schade. Houd je aan het vervangingsinterval.',
    vragen: [
      {
        vraag: 'Waarom sluit de inlaatklep pas een flink stuk ná het onderste dode punt?',
        opties: [
          'Om de compressie te verlagen en klop te voorkomen',
          'Omdat de bewegende luchtkolom door zijn traagheid nog doorstroomt en de vulling verbetert',
          'Omdat de nokkenas te traag draait om eerder te sluiten',
          'Om uitlaatgas terug te laten stromen voor EGR'
        ],
        goed: 1,
        uitleg: 'Lucht heeft massa; de stroming in het spruitstuk blijft even doorgaan terwijl de zuiger al stijgt. Zo komt er meer lading in de cilinder.'
      },
      {
        vraag: 'Wat is klepoverlap?',
        opties: [
          'De periode rond BDP waarin inlaat- en uitlaatklep allebei open staan',
          'De speling tussen nok en klepstoter',
          'Het moment dat beide kleppen dicht zijn tijdens de arbeidsslag',
          'Het verschil in lichthoogte tussen inlaat- en uitlaatklep'
        ],
        goed: 0,
        uitleg: 'Rond het bovenste dode punt overlappen het einde van de uitlaat en het begin van de inlaat; de uitstromende gassen helpen de cilinder te spoelen.'
      },
      {
        vraag: 'Een motor heeft een slagvolume van 450 cc per cilinder en een compressieruimte van 50 cc. Wat is de compressieverhouding?',
        opties: ['9:1', '11:1', '8:1', '10:1'],
        goed: 3,
        uitleg: '(450 + 50) / 50 = 10, dus 10:1.'
      },
      {
        vraag: 'Waarom heeft een dieselmotor geen bougie nodig?',
        opties: [
          'Diesel brandt door een vonk van de verstuiver',
          'De gloeibougie ontsteekt elke cyclus het mengsel',
          'Door de hoge compressie wordt de lucht zo heet dat ingespoten diesel vanzelf ontbrandt',
          'Diesel ontbrandt door contact met de hete uitlaatklep'
        ],
        goed: 2,
        uitleg: 'Een diesel is een compressieontstekingsmotor: de gecomprimeerde lucht is ruim boven de zelfontbrandingstemperatuur van diesel. Gloeibougies helpen alleen bij koude start.'
      }
    ]
  },
  {
    id: 'benzine-vs-diesel',
    categorie: 'auto',
    titel: 'Benzine versus diesel: verbranding en emissies',
    kern: 'Benzine verbrandt een voorgemengd mengsel met vaste verhouding; diesel verbrandt met luchtoverschot, wat koppel én roet en NOx oplevert.',
    uitleg: [
      'Een benzinemotor regelt zijn vermogen met de gasklep: minder lucht én evenredig minder brandstof, zodat de lucht-brandstofverhouding rond stoichiometrisch blijft (λ = 1, ca. 14,7 kg lucht per kg benzine). Dat smoren kost pompverliezen bij deellast. Een diesel heeft (in principe) geen gasklep: hij zuigt altijd volle lucht aan en regelt vermogen alleen met de hoeveelheid ingespoten brandstof. Bij deellast loopt hij dus zeer arm (λ ver boven 1).',
      'Diesels leveren veel koppel bij lage toeren door de hoge compressie, een lange slag, en vrijwel altijd een turbo. Het hogere rendement komt uit de hogere compressieverhouding en het ontbreken van smoorverlies. Diesel bevat bovendien ca. 10–15% meer energie per liter dan benzine.',
      'Het nadeel: de verbranding is heterogeen. Rond elke brandstofdruppel zijn er plekken met te weinig zuurstof (roet) en hete plekken met veel zuurstof (stikstofoxiden, NOx). Een gewone driewegkatalysator werkt alleen bij λ = 1 en kan NOx in een arm uitlaatgas niet reduceren. Daarom heeft een moderne diesel een oxidatiekatalysator, een roetfilter (DPF) en een SCR-katalysator.',
      'Het roetfilter vangt deeltjes in een keramische honingraat waarvan de kanaaltjes om en om dicht zijn; het moet periodiek regenereren (roet verbranden bij ca. 600 °C), wat lange ritten vraagt. SCR spuit AdBlue (32,5% ureum in water) in; dat wordt ammoniak, die NOx omzet in stikstof en water.'
    ],
    feiten: [
      'Stoichiometrische verhouding benzine: ca. 14,7:1 (massa); diesel ca. 14,5:1.',
      'AdBlue = 32,5% ureum in gedemineraliseerd water; het bevriest rond −11 °C.',
      'AdBlue-verbruik is orde 3–6% van het dieselverbruik.',
      'Een DPF regenereert actief door extra brandstof na te spuiten zodat de uitlaattemperatuur rond 600 °C komt.',
      'Diesel: ca. 36 MJ/l; benzine: ca. 32 MJ/l.'
    ],
    letOp: 'Veel korte ritten met een diesel laten het roetfilter dichtslibben omdat regeneraties steeds worden afgebroken.',
    vragen: [
      {
        vraag: 'Hoe regelt een klassieke diesel zijn vermogen?',
        opties: [
          'Met een gasklep die de luchttoevoer smoort',
          'Met het ontstekingstijdstip',
          'Met de turbodruk alleen',
          'Met de hoeveelheid ingespoten brandstof; de luchttoevoer wordt niet gesmoord'
        ],
        goed: 3,
        uitleg: 'Een diesel ademt altijd vrij en doseert alleen brandstof; bij deellast loopt hij daardoor met groot luchtoverschot.'
      },
      {
        vraag: 'Waarom kan een gewone driewegkatalysator de NOx van een diesel niet verwerken?',
        opties: [
          'Omdat het uitlaatgas te koud is',
          'Omdat dieseluitlaatgas veel zuurstof bevat, terwijl NOx-reductie in een driewegkat λ ≈ 1 vereist',
          'Omdat roet de katalysator direct verstopt',
          'Omdat diesel geen stikstof bevat'
        ],
        goed: 1,
        uitleg: 'In een zuurstofrijk uitlaatgas worden reductiereacties onderdrukt. Daarvoor is SCR met ammoniak (uit AdBlue) nodig.'
      },
      {
        vraag: 'Wat doet AdBlue in het SCR-systeem?',
        opties: [
          'Het levert ammoniak die NOx omzet in stikstof en water',
          'Het verbrandt roet in het roetfilter',
          'Het verhoogt het cetaangetal van de diesel',
          'Het koelt de turbo'
        ],
        goed: 0,
        uitleg: 'Ureum valt in het hete uitlaatgas uiteen tot ammoniak; op de SCR-katalysator reageert die met NOx tot N₂ en H₂O.'
      }
    ]
  },
  {
    id: 'brandstofinjectie',
    categorie: 'auto',
    titel: 'Brandstofinjectie: van spruitstuk tot common rail',
    kern: 'Hoe hoger de injectiedruk, hoe fijner de verneveling: van enkele bar bij spruitstukinjectie tot ruim 2000 bar bij common rail.',
    uitleg: [
      'Bij spruitstukinjectie (MPI) spuit een injector bij elke cilinder benzine op de achterkant van de inlaatklep, met een druk van slechts 3–5 bar. Er is tijd genoeg om te verdampen en te mengen. Bij directe injectie (GDI, TSI, enz.) spuit de injector rechtstreeks in de cilinder, met orde 100–350 bar. Voordeel: de verdampende brandstof koelt de lading, waardoor een hogere compressie of meer turbodruk mogelijk is zonder klop. Nadeel: inlaatkleppen worden niet meer schoongespoeld en kunnen verkoolen, en er ontstaan meer fijne deeltjes (vandaar benzineroetfilters).',
      'Een diesel heeft per definitie directe injectie nodig, en omdat de brandstof in milliseconden moet verdampen en mengen met hete lucht, moet de druk extreem hoog zijn. Bij common rail houdt een hogedrukpomp een gemeenschappelijke buis (de rail) permanent op druk, tot zo’n 2000–2700 bar. Elektronisch aangestuurde injectoren (magneetventiel of piëzo) openen los van het krukastoerental.',
      'Dat losse timen is de grote winst: per arbeidsslag kunnen meerdere inspuitingen plaatsvinden. Een kleine voorinspuiting laat de druk geleidelijker oplopen (minder dieseltik), de hoofdinspuiting levert vermogen en een na-inspuiting helpt het roetfilter te regenereren. Vroeger bepaalde een mechanische verdeelpomp alles in één keer.'
    ],
    feiten: [
      'Spruitstukinjectie benzine: ca. 3–5 bar.',
      'Directe injectie benzine: orde 100–350 bar.',
      'Common rail diesel: tot ca. 2000–2700 bar.',
      'Piëzo-injectoren schakelen in de orde van een tiende milliseconde, wat 5 of meer inspuitingen per cyclus mogelijk maakt.',
      'Sommige motoren combineren MPI en directe injectie om koolafzetting op de kleppen te beperken.'
    ],
    letOp: 'Werken aan een common-rail-systeem terwijl het onder druk staat is levensgevaarlijk: een straal diesel van 2000 bar dringt door de huid.',
    vragen: [
      {
        vraag: 'Wat is het belangrijkste voordeel van common rail ten opzichte van een mechanische verdeelpomp?',
        opties: [
          'Lagere injectiedruk, dus minder slijtage',
          'Geen hogedrukpomp meer nodig',
          'De druk staat los van het toerental en inspuitmoment en -hoeveelheid zijn vrij te kiezen, ook meerdere keren per cyclus',
          'De motor heeft geen gloeibougies meer nodig'
        ],
        goed: 2,
        uitleg: 'De rail staat permanent op druk; de ECU bepaalt per injectie wanneer en hoeveel, inclusief voor-, hoofd- en na-inspuiting.'
      },
      {
        vraag: 'Welk nadeel heeft directe benzine-injectie ten opzichte van spruitstukinjectie?',
        opties: [
          'Lagere compressie mogelijk',
          'Hoger brandstofverbruik bij deellast',
          'Inspuitdruk is te laag voor goede verneveling',
          'Inlaatkleppen verkoolen omdat ze niet meer door brandstof worden schoongespoeld'
        ],
        goed: 3,
        uitleg: 'Olienevel uit de carterventilatie bakt aan op de kleppen; bij MPI spoelde de benzine dat weg.'
      },
      {
        vraag: 'In welke orde van grootte ligt de injectiedruk van een moderne common-rail-diesel?',
        opties: ['20 bar', '2000 bar', '200 bar', '20.000 bar'],
        goed: 1,
        uitleg: 'Common rail werkt met ca. 1600–2700 bar; benzine-DI zit een orde lager, spruitstukinjectie twee ordes lager.'
      }
    ]
  },
  {
    id: 'turbo-intercooler',
    categorie: 'auto',
    titel: 'Turbo en intercooler',
    kern: 'Een turbo gebruikt energie uit het uitlaatgas om de inlaatlucht te comprimeren; de intercooler koelt die lucht zodat er meer massa in de cilinder past.',
    uitleg: [
      'Een turbocompressor bestaat uit een turbinewiel in de uitlaatstroom en een compressorwiel in de inlaat, op één as. Het uitlaatgas heeft nog veel druk en warmte die anders verloren gaat. De as draait tot ruim 200.000 tpm. De turbo blaast typisch 0,5–1,5 bar overdruk (boost) bij personenauto’s, wat neerkomt op 50–150% meer luchtmassa en dus evenveel meer brandstof en vermogen.',
      'Comprimeren verwarmt lucht (adiabatisch, net als een fietspomp), soms tot meer dan 100 °C. Warme lucht is minder dicht en verhoogt de kans op klop. De intercooler (ladeluchtkoeler) is een radiator tussen turbo en inlaat die de lucht weer terugkoelt, waardoor de dichtheid stijgt.',
      'Turbogat ontstaat doordat de turbo eerst uitlaatgasstroom nodig heeft om op toeren te komen: bij lage toeren en plots gas geven duurt het even voordat de druk er is. Een wastegate is een klep die uitlaatgas langs de turbine laat stromen om de maximale druk te begrenzen. Een turbo met variabele geometrie (VGT/VNT) heeft verstelbare schoepen rond de turbine: bij lage stroming staan ze nauw (hoge gassnelheid, snelle opbouw), bij hoge stroming open. Bij diesels is VGT standaard; bij benzine zeldzaam omdat het uitlaatgas veel heter is.',
      'Downsizing — een kleine motor met turbo in plaats van een grote zuigmotor — werkt omdat de kleine motor bij rustig rijden minder wrijving en smoorverlies heeft, terwijl de turbo bij vraag het vermogen levert.'
    ],
    feiten: [
      'Turbotoerentallen: orde 150.000–250.000 tpm.',
      'Uitlaatgastemperatuur voor de turbine: diesel tot ca. 800 °C, benzine tot ca. 950–1000 °C.',
      'Een compressor (supercharger) wordt mechanisch door de krukas aangedreven en heeft geen turbogat, maar kost vermogen.',
      'Elektrische compressoren (48 V) worden soms gebruikt om het turbogat te overbruggen.'
    ],
    formules: [
      { formule: 'p_abs = p_atm + p_boost', betekenis: 'Absolute inlaatdruk: 1 bar boost geeft ca. 2 bar absoluut, dus ruwweg twee keer zoveel luchtmassa bij dezelfde temperatuur.' }
    ],
    letOp: 'Na hard rijden kort stationair laten draaien gunt de turbo-lagers oliestroom om af te koelen; olie die verkookt in een gloeiend lagerhuis vormt koolafzetting.',
    vragen: [
      {
        vraag: 'Waarom zit er een intercooler tussen turbo en inlaat?',
        opties: [
          'Om het turbogat te verminderen',
          'Om de turbine te koelen',
          'Om de door compressie opgewarmde lucht te koelen, zodat de dichtheid stijgt en klop minder snel optreedt',
          'Om water uit de inlaatlucht te halen'
        ],
        goed: 2,
        uitleg: 'Comprimeren verwarmt de lucht; koude lucht is dichter, dus meer zuurstof per slag en minder kloprisico.'
      },
      {
        vraag: 'Wat doet de wastegate?',
        opties: [
          'Uitlaatgas langs de turbine leiden om de maximale turbodruk te begrenzen',
          'Overdruk in de inlaat afblazen bij het loslaten van het gaspedaal',
          'De turbo smeren bij koude start',
          'De intercooler omzeilen bij lage temperatuur'
        ],
        goed: 0,
        uitleg: 'Door een deel van het uitlaatgas om de turbine heen te sturen, draait de turbo niet harder dan nodig. (Het afblazen aan de inlaatzijde doet de blow-off/dump valve.)'
      },
      {
        vraag: 'Hoe verkleint een VGT-turbo het turbogat?',
        opties: [
          'Door een elektromotor op de as',
          'Door bij lage gasstroom de schoepen nauw te zetten, zodat het gas sneller op de turbine stroomt',
          'Door een groter compressorwiel',
          'Door minder olie naar de lagers te sturen'
        ],
        goed: 1,
        uitleg: 'Verstelbare leischoepen maken de doorlaat klein bij weinig gas (hoge snelheid, snelle spool-up) en groot bij veel gas (geen smoring).'
      }
    ]
  },
  {
    id: 'ontsteking-motormanagement',
    categorie: 'auto',
    titel: 'Ontsteking en motormanagement',
    kern: 'De ECU berekent elke cyclus brandstofhoeveelheid en ontstekingstijdstip uit sensoren, met de lambdasonde en klopsensor als terugkoppeling.',
    uitleg: [
      'De motorregeleenheid (ECU) leest onder andere krukaspositie en -toerental, nokkenaspositie, luchtmassa (luchtmassameter) of inlaatdruk (MAP-sensor), inlaatluchttemperatuur, koelvloeistoftemperatuur en gaspedaalstand. Uit tabellen (maps) en modellen berekent hij hoeveel brandstof er moet worden ingespoten en wanneer de bougie moet vonken.',
      'Ontsteken gebeurt vóór het bovenste dode punt (voorontsteking), omdat de verbranding tijd kost: de piekdruk moet net ná BDP vallen, ongeveer 10–20° krukas erna. Bij hoge toeren is er minder tijd, dus de ontsteking moet vroeger. Te vroeg ontsteken geeft klop: het onverbrande restmengsel ontbrandt vanzelf door de druk- en temperatuurstijging, met drukgolven die zuigers en lagers kunnen beschadigen.',
      'De klopsensor is een piëzo-element op het motorblok dat de karakteristieke trillingsfrequentie van klop herkent. De ECU verlaat dan per cilinder het ontstekingstijdstip een paar graden en schuift het daarna voorzichtig weer terug. Zo kan de motor vlak tegen de klopgrens lopen, ook op brandstof met een lager octaangetal.',
      'De lambdasonde vóór de katalysator meet het restzuurstofgehalte in het uitlaatgas. De ECU stuurt de brandstofhoeveelheid zo dat het mengsel steeds net rond λ = 1 schommelt; precies daar werkt de driewegkatalysator optimaal (CO en HC oxideren, NOx reduceert). Een tweede sonde achter de kat bewaakt of de katalysator nog zuurstof opslaat (OBD-diagnose).'
    ],
    feiten: [
      'λ = werkelijke luchthoeveelheid / stoichiometrische luchthoeveelheid; λ < 1 is rijk, λ > 1 is arm.',
      'Een driewegkatalysator converteert alleen in een smal venster rond λ = 1 alle drie de componenten tegelijk.',
      'Octaangetal is een maat voor klopvastheid, niet voor energie-inhoud: Euro 95 en 98 bevatten vrijwel even veel energie.',
      'Een breedband-lambdasonde kan ook λ ver van 1 meten en is standaard op diesels en moderne benzinemotoren.'
    ],
    formules: [
      { formule: 'λ = m_lucht / (14,7 × m_benzine)', betekenis: 'Luchtfactor voor benzine: 1 is stoichiometrisch.' }
    ],
    vragen: [
      {
        vraag: 'Waarom ontsteekt de bougie vóór het bovenste dode punt?',
        opties: [
          'Omdat de verbranding tijd kost en de piekdruk net na BDP moet vallen',
          'Om klop te voorkomen',
          'Om de uitlaatklep te ontlasten',
          'Omdat de bougie anders niet genoeg spanning heeft'
        ],
        goed: 0,
        uitleg: 'Het vlamfront heeft een paar milliseconden nodig; door vroeg te ontsteken komt de maximale druk op het gunstigste moment, net na BDP.'
      },
      {
        vraag: 'Wat doet de ECU als de klopsensor klop detecteert?',
        opties: [
          'De turbodruk verhogen',
          'Het mengsel armer maken',
          'De ontsteking voor die cilinder later zetten (terugregelen)',
          'De lambdasonde uitschakelen'
        ],
        goed: 2,
        uitleg: 'Later ontsteken verlaagt piekdruk en -temperatuur, waardoor de zelfontbranding van het restmengsel stopt.'
      },
      {
        vraag: 'De lambdasonde meet λ = 0,9. Wat betekent dat?',
        opties: [
          'Het mengsel is 10% te arm',
          'De katalysator is 90% effectief',
          'Er zit 90% zuurstof in het uitlaatgas',
          'Het mengsel is rijk: er is ca. 10% te weinig lucht voor volledige verbranding'
        ],
        goed: 3,
        uitleg: 'λ < 1 betekent luchttekort (rijk mengsel). De ECU zal de inspuithoeveelheid verlagen.'
      }
    ]
  },
  {
    id: 'smering-koeling',
    categorie: 'auto',
    titel: 'Smering en koeling',
    kern: 'Olie houdt metalen delen gescheiden door een drukfilm; het koelsysteem houdt de motor op een vaste, vrij hoge bedrijfstemperatuur.',
    uitleg: [
      'In de glijlagers van krukas en drijfstangen raakt metaal metaal nooit, zolang er een hydrodynamische oliefilm is: de draaiende as sleept olie mee in een wigvormige spleet en bouwt zo zelf druk op. De oliepomp levert alleen de aanvoer, met een druk van orde 1–5 bar. Valt de druk weg (oliedruklampje), dan breekt de film en lopen lagers binnen seconden tot minuten vast. Stop dan direct.',
      'Een viscositeitsklasse als 5W-30 beschrijft twee dingen. Het getal vóór de W (Winter) zegt hoe goed de olie bij kou nog stroomt: 0W is dunner bij kou dan 10W. Het tweede getal is de viscositeit bij 100 °C: 30 is dunner dan 40. Een multigrade olie gedraagt zich koud als een dunne en warm als een dikkere olie dankzij viscositeitsverbeteraars. De meeste slijtage ontstaat bij de koude start, vandaar het belang van het eerste getal.',
      'Het koelsysteem staat onder druk (orde 1–1,5 bar overdruk via de dop van het expansievat), waardoor het kookpunt van koelvloeistof stijgt tot ruim boven 120 °C. De waterpomp (vaak via de distributieriem) circuleert de vloeistof. De thermostaat blijft dicht tot zo’n 85–95 °C: zo warmt de motor snel op via een kleine kring en gaat pas daarna de radiator meedoen.',
      'Waarom niet kouder? Een koude motor heeft hogere oliewrijving, slechtere verneveling, meer slijtage en meer emissie. Veel moderne motoren hebben daarom een elektronisch geregelde thermostaat die bij deellast zelfs warmer draait (rond 105 °C) en bij vollast koeler.'
    ],
    feiten: [
      '5W-30: koudgedrag klasse 5W, viscositeit bij 100 °C klasse 30.',
      'Koelvloeistof is een mengsel van water en glycol (vaak 50/50), wat bevriezing tot ongeveer −35 °C voorkomt.',
      'Het expansievat nooit openen bij een hete motor: de vloeistof kan door de drukval ineens koken.',
      'Glijlagers zijn hydrodynamisch: bij stilstand is de film er niet, vandaar slijtage bij de start.'
    ],
    letOp: 'Een brandend oliedruklampje is iets anders dan een laag oliepeil-waarschuwing: geen druk betekent direct de motor afzetten.',
    vragen: [
      {
        vraag: 'Wat betekent het getal 30 in 5W-30?',
        opties: [
          'De viscositeitsklasse bij 100 °C',
          'De minimale buitentemperatuur in °C',
          'Het verversingsinterval in duizenden kilometers',
          'De viscositeit bij 30 °C'
        ],
        goed: 0,
        uitleg: 'Het tweede getal is de viscositeitsklasse bij bedrijfstemperatuur (100 °C); hoger is dikker.'
      },
      {
        vraag: 'Waarom staat het koelsysteem onder overdruk?',
        opties: [
          'Om de waterpomp minder te belasten',
          'Om de stroomsnelheid te verhogen',
          'Om luchtbellen naar de radiator te drukken',
          'Om het kookpunt van de koelvloeistof te verhogen'
        ],
        goed: 3,
        uitleg: 'Hogere druk verhoogt het kookpunt; bij ca. 1 bar overdruk kookt een water-glycolmengsel pas ruim boven 120 °C.'
      },
      {
        vraag: 'Wat gebeurt er als de thermostaat in open stand vastzit?',
        opties: [
          'De motor raakt oververhit',
          'De motor wordt langzaam of niet goed warm, met meer slijtage en verbruik',
          'De oliedruk stijgt gevaarlijk',
          'De koelvloeistof kookt in het expansievat'
        ],
        goed: 1,
        uitleg: 'Bij een open thermostaat koelt de radiator al vanaf de koude start. Een vastzittende gesloten thermostaat geeft juist oververhitting.'
      }
    ]
  },
  {
    id: 'koppeling-versnellingsbak',
    categorie: 'auto',
    titel: 'Koppeling en versnellingsbak',
    kern: 'Een versnellingsbak ruilt toerental tegen koppel; koppeling, DSG, CVT of koppelomvormer regelen de overgang zonder dat de motor afslaat.',
    uitleg: [
      'Een verbrandingsmotor levert bruikbaar koppel in een beperkt toerengebied en kan niet vanuit stilstand trekken. De versnellingsbak vermenigvuldigt het koppel: in de eerste versnelling (verhouding orde 3,5:1) draait de uitgaande as ruim drie keer langzamer maar met ruim drie keer zoveel koppel. Samen met de eindoverbrenging in het differentieel (orde 3–4:1) bepaalt dat hoe snel de wielen draaien per motortoerental.',
      'In een handbak zijn alle tandwielparen permanent in aangrijping; de gekozen versnelling wordt vastgezet met een schakelmof. Synchroniseerringen (conusvormige wrijvingsringen) brengen eerst het tandwiel op de snelheid van de as, zodat de mof soepel invalt. De droge plaatkoppeling wordt door een drukgroep (diafragmaveer) tegen het vliegwiel geklemd; intrappen haalt die klemkracht weg.',
      'Een DSG of dubbele koppeling heeft twee koppelingen en twee ingaande assen: één voor de oneven, één voor de even versnellingen. Terwijl je in 3 rijdt, staat 4 al ingeschakeld op de andere as; schakelen is het overzetten van de ene koppeling naar de andere, in honderdsten van seconden en zonder onderbreking van de trekkracht.',
      'Een CVT werkt met een duwband of ketting tussen twee poelies waarvan de flanken verschuiven, waardoor de effectieve diameter traploos verandert. De motor kan zo constant op zijn gunstigste toerental draaien. De klassieke automaat gebruikt een koppelomvormer: een pompwiel (aan de motor) slingert olie naar een turbinewiel (aan de bak); een stator daartussen buigt de terugstromende olie om, wat bij grote slip het koppel vermenigvuldigt (orde ×2). Een overbruggingskoppeling (lock-up) zet het geheel bij kruissnelheid vast om slipverlies te vermijden.'
    ],
    feiten: [
      'Typische eerste versnelling: ca. 3,3–3,8:1; hoogste versnelling vaak onder 1:1 (overdrive).',
      'De CVT met duwband (Van Doorne, DAF Variomatic-opvolger) is een Nederlandse uitvinding, geproduceerd in Tilburg.',
      'Een koppelomvormer vermenigvuldigt bij stilstand van de turbine (stall) het koppel ca. 1,8–2,5 keer.',
      'Het koppel op de wielen is motorkoppel × versnellingsverhouding × eindoverbrenging × rendement.'
    ],
    formules: [
      { formule: 'i = n_in / n_uit = M_uit / M_in', betekenis: 'Overbrengingsverhouding (verliezen verwaarloosd): wat je aan toerental verliest, win je aan koppel.' },
      { formule: 'P = 2π × n × M', betekenis: 'Vermogen (W) = 2π × toerental (omw/s) × koppel (Nm). Een overbrenging verandert n en M, maar niet P.' }
    ],
    vragen: [
      {
        vraag: 'Een motor levert 200 Nm; de eerste versnelling heeft verhouding 3,5:1 en de eindoverbrenging 4:1. Hoeveel koppel komt er (zonder verliezen) op de aandrijfas?',
        opties: ['800 Nm', '1400 Nm', '2800 Nm', '700 Nm'],
        goed: 2,
        uitleg: '200 × 3,5 × 4 = 2800 Nm, verdeeld over de twee aangedreven wielen.'
      },
      {
        vraag: 'Waarom schakelt een DSG zonder onderbreking van de trekkracht?',
        opties: [
          'De volgende versnelling staat al ingeschakeld op de tweede as; alleen de koppelingen wisselen',
          'Het gebruikt een koppelomvormer die slip opvangt',
          'Het heeft geen tandwielen maar een duwband',
          'De elektromotor vult het gat in'
        ],
        goed: 0,
        uitleg: 'Oneven en even versnellingen zitten op aparte assen met elk een eigen koppeling; schakelen is één koppeling openen terwijl de andere sluit.'
      },
      {
        vraag: 'Wat is de functie van de synchroniseerring in een handbak?',
        opties: [
          'Het koppel vermenigvuldigen bij het wegrijden',
          'De koppelingsplaat koelen',
          'Voorkomen dat twee versnellingen tegelijk worden ingeschakeld',
          'Het tandwiel en de as op gelijke snelheid brengen voordat de schakelmof invalt'
        ],
        goed: 3,
        uitleg: 'Door wrijving op een conus worden de snelheden gelijkgetrokken; zonder synchromesh moet je dubbel ontkoppelen en tussengas geven.'
      },
      {
        vraag: 'Welk onderdeel in een koppelomvormer maakt koppelvermenigvuldiging mogelijk?',
        opties: ['Het pompwiel', 'De stator met vrijloop', 'De overbruggingskoppeling', 'Het turbinewiel'],
        goed: 1,
        uitleg: 'De stator buigt de olie die van de turbine terugkomt om, zodat die het pompwiel helpt. Dat werkt alleen bij groot snelheidsverschil.'
      }
    ]
  },
  {
    id: 'differentieel-aandrijving',
    categorie: 'auto',
    titel: 'Differentieel en aandrijving',
    kern: 'In een bocht legt het buitenwiel meer afstand af; het differentieel laat de wielen verschillend draaien maar verdeelt het koppel gelijk.',
    uitleg: [
      'Zonder differentieel zouden twee wielen op een starre as in elke bocht moeten slippen, omdat het buitenwiel een grotere boog aflegt. Het open differentieel lost dat op met een kroonwiel dat het huis ronddraait, met daarin satelliet- en planeetwielen. Rechtuit draaien de satellieten niet om hun eigen as; in een bocht draaien ze rond en laten het ene wiel sneller, het andere langzamer gaan.',
      'De keerzijde: een open differentieel verdeelt het koppel altijd gelijk over beide wielen. Staat één wiel op ijs en kan het maar 50 Nm overbrengen voordat het slipt, dan krijgt het andere wiel óók maar 50 Nm. Het slippende wiel draait dol, de auto staat stil.',
      'Een sperdifferentieel beperkt dat snelheidsverschil. Een lamellensper (platen onder voorspanning), een Torsen (wormwielen die bij koppelverschil vastlopen) of een volledig te blokkeren sper (terreinwagens) sturen koppel naar het wiel met grip. Moderne auto’s simuleren dit vaak elektronisch door het doldraaiende wiel licht af te remmen.',
      'Voorwielaandrijving is compact en goedkoop, maar de voorwielen moeten sturen én trekken, en bij accelereren verplaatst gewicht naar achteren. Achterwielaandrijving scheidt sturen en trekken en profiteert van gewichtsverplaatsing bij optrekken. Vierwielaandrijving heeft tussen de assen ook een verschil in afgelegde weg; een permanente 4×4 heeft daarom een middendifferentieel of een lamellenkoppeling (Haldex-achtig) die de achteras alleen bijschakelt.'
    ],
    feiten: [
      'In een open differentieel geldt: (n_links + n_rechts) / 2 = n_kroonwiel.',
      'Als één wiel stilstaat (bijv. opgekrikt), draait het andere twee keer zo snel als het kroonwiel.',
      'Een 4×4 met starre koppeling tussen de assen (part-time) mag niet op droog asfalt in 4WD rijden: de aandrijflijn verspant.',
      'Elektronische sper (EDL/XDS) remt het slippende wiel zodat het differentieel koppel naar het andere wiel kan sturen.'
    ],
    vragen: [
      {
        vraag: 'Eén aangedreven wiel staat op ijs en kan 40 Nm overbrengen. Hoeveel koppel krijgt het wiel op asfalt bij een open differentieel?',
        opties: ['Ongeveer 40 Nm', 'Het volledige motorkoppel', 'Nul', 'Het dubbele, 80 Nm'],
        goed: 0,
        uitleg: 'Een open differentieel verdeelt het koppel gelijk; het zwakste wiel bepaalt dus wat het andere krijgt.'
      },
      {
        vraag: 'Waarom heeft een permanente vierwielaandrijving een middendifferentieel of slippende koppeling nodig?',
        opties: [
          'Om het gewicht te verdelen',
          'Om het motorkoppel te verdubbelen',
          'Omdat voor- en achteras in bochten een verschillende afstand afleggen',
          'Om ABS mogelijk te maken'
        ],
        goed: 2,
        uitleg: 'De vooras volgt een grotere boog dan de achteras; star koppelen geeft spanning in de aandrijflijn en bandenslip.'
      },
      {
        vraag: 'Je krikt één aangedreven wiel op en draait het met de hand rond (versnelling in neutraal, ander wiel op de grond). Wat doet het open differentieel?',
        opties: [
          'Beide wielen draaien dezelfde kant op',
          'Het opgekrikte wiel zit vast',
          'Het kroonwiel draait twee keer zo snel als het wiel',
          'Het andere wiel blijft staan en het kroonwiel draait half zo snel als het opgekrikte wiel'
        ],
        goed: 3,
        uitleg: 'Het gemiddelde van beide wielsnelheden is gelijk aan die van het kroonwiel: (n + 0)/2.'
      }
    ]
  },
  {
    id: 'remmen-abs',
    categorie: 'auto',
    titel: 'Remmen: hydrauliek, schijven en ABS',
    kern: 'Pedaaldruk wordt hydraulisch versterkt naar de remklauwen; ABS houdt de wielslip in het gebied waar band en weg de meeste kracht leveren.',
    uitleg: [
      'Het rempedaal werkt via een hefboom en een rembekrachtiger (vacuüm of elektrisch) op de hoofdremcilinder. Volgens de wet van Pascal is de druk overal in de leiding gelijk; een remzuiger met een veel groter oppervlak dan de hoofdcilinderzuiger levert dus een veel grotere kracht. Het systeem is gedeeld in twee kringen (vaak diagonaal), zodat bij een lek nog de helft remt.',
      'Remmen is energie omzetten in warmte. Een schijfrem koelt goed omdat de schijf aan de lucht ligt (vaak geventileerd met interne kanalen) en water snel wegslingert. Een trommelrem is goedkoper, heeft een zelfbekrachtigend effect en is goed als handrem, maar raakt sneller oververhit (fading). Daarom zitten schijven altijd voor, waar door gewichtsverplaatsing het grootste deel van de remkracht wordt geleverd.',
      'Remvloeistof (glycolbasis, DOT 3/4/5.1) is hygroscopisch: ze neemt via slangen en het reservoir vocht op. Daardoor daalt het kookpunt. Kookt de vloeistof bij een lange afdaling, dan ontstaan dampbellen die samendrukbaar zijn: het pedaal zakt door. Vandaar het advies om de vloeistof ongeveer elke twee jaar te vervangen.',
      'Een band levert de meeste remkracht bij een slip van ca. 10–20%, niet bij een geblokkeerd wiel. ABS meet met wielsnelheidssensoren of een wiel sneller vertraagt dan de auto kan, en laat dan via kleppen druk af, houdt hem vast of bouwt hem weer op, vele keren per seconde. Belangrijker nog dan de kortere remweg: een rollend wiel kan zijwaartse kracht leveren, dus je kunt blijven sturen.'
    ],
    feiten: [
      'DOT 4: droog kookpunt minimaal 230 °C, nat (na vochtopname) minimaal 155 °C.',
      'Ongeveer 60–70% van de remkracht van een personenauto komt van de vooras.',
      'ABS regelt orde 10–15 keer per seconde per wiel.',
      'Op los zand of grind kan een remweg met ABS langer zijn, omdat een geblokkeerd wiel daar een wig opbouwt.'
    ],
    formules: [
      { formule: 'F_rem = p × A_remzuiger', betekenis: 'De kracht per remzuiger is de leidingdruk maal het zuigeroppervlak.' },
      { formule: 's = v² / (2a)', betekenis: 'Remweg zonder reactietijd; dubbele snelheid geeft vier keer zo lange remweg.' }
    ],
    letOp: 'Bij een noodstop met ABS: pedaal vol intrappen en vasthouden, ook als het pulseert en ratelt. Niet pompen.',
    vragen: [
      {
        vraag: 'Waarom moet remvloeistof periodiek worden vervangen?',
        opties: [
          'Ze verdampt langzaam',
          'Ze neemt vocht op waardoor het kookpunt daalt en er dampbellen kunnen ontstaan',
          'Ze wordt dikker door de warmte',
          'Ze tast de remschijven aan'
        ],
        goed: 1,
        uitleg: 'Glycolvloeistof is hygroscopisch. Waterdamp is samendrukbaar; het pedaal zakt dan door bij hete remmen.'
      },
      {
        vraag: 'Wat is het belangrijkste veiligheidsvoordeel van ABS?',
        opties: [
          'Altijd een kortere remweg, ook op grind',
          'Minder slijtage van de remblokken',
          'Het rempedaal hoeft minder hard te worden ingetrapt',
          'Je kunt tijdens een noodstop blijven sturen'
        ],
        goed: 3,
        uitleg: 'Een rollend wiel kan nog zijdelingse kracht overbrengen; een geblokkeerd wiel niet.'
      },
      {
        vraag: 'Je remt van 100 km/h in 40 m. Hoe lang wordt de remweg (zonder reactietijd) vanaf 140 km/h bij dezelfde vertraging?',
        opties: ['Ca. 56 m', 'Ca. 78 m', 'Ca. 66 m', 'Ca. 100 m'],
        goed: 1,
        uitleg: 'Remweg schaalt met v²: (140/100)² = 1,96, dus ca. 78 m.'
      }
    ]
  },
  {
    id: 'wielophanging-sturing',
    categorie: 'auto',
    titel: 'Wielophanging, sturing en uitlijning',
    kern: 'De veer draagt het gewicht, de schokdemper remt de beweging; uitlijnhoeken bepalen hoe het wiel de weg raakt.',
    uitleg: [
      'Een veer slaat energie op en geeft die weer terug: zonder demping zou de auto na een drempel blijven deinen. De schokdemper zet die beweging om in warmte door olie door kleine klepjes te persen. De kracht hangt af van de snelheid van in- of uitveren, niet van de uitslag. Een versleten demper merk je aan nadeinen, een onrustige auto op golvende weg en langere remwegen, omdat het wiel loskomt van de weg.',
      'De McPherson-veerpoot is de meest gebruikte voorwielophanging: veer en demper vormen samen één staande poot die ook het wiel geleidt, met onderaan één draagarm. Goedkoop en compact, maar de camber verandert bij inveren ongunstig. Een dubbele draagarm (double wishbone) of multilink geeft de ontwerper meer vrijheid om de wielstand tijdens inveren te sturen.',
      'Toespoor: de voorkanten van de wielen staan iets naar elkaar toe (toe-in) of uit elkaar (toe-out), meestal in de orde van enkele tienden van een graad. Het stabiliseert rechtuit rijden; verkeerd toespoor geeft snelle slijtage aan de rand van de band. Camber is de kanteling van het wiel gezien van voren: negatief (bovenkant naar binnen) geeft in bochten een beter contactvlak. Caster is de naloop van de fusee-as: daardoor keert het stuur na een bocht vanzelf terug, net als bij een winkelwagenwieltje.',
      'Moderne stuurinrichtingen zijn tandheugelsturing met elektrische stuurbekrachtiging (EPS): een elektromotor op de stuurkolom of heugel. Omdat die alleen stroom verbruikt bij sturen, scheelt dat ten opzichte van een hydraulische pomp enkele procenten brandstof, en het maakt rijstrookassistentie mogelijk.'
    ],
    feiten: [
      'Onafgeveerde massa (wiel, rem, deel van de draagarm) zo laag mogelijk houden verbetert grip en comfort.',
      'Typische negatieve camber van een personenauto: orde −0,5° tot −1,5°.',
      'Een stabilisatorstang verbindt links en rechts en vermindert overhellen in bochten zonder de veren stijver te maken.',
      'Na het vervangen van stuurkogels of veerpoten hoort de auto opnieuw te worden uitgelijnd.'
    ],
    vragen: [
      {
        vraag: 'Waar hangt de kracht van een hydraulische schokdemper vooral van af?',
        opties: [
          'Van hoe ver de veer is ingedrukt',
          'Van het gewicht van de auto',
          'Van de snelheid waarmee de demper in- of uitgaat',
          'Van de bandenspanning'
        ],
        goed: 2,
        uitleg: 'Een demper werkt viscositeitsgebonden: hoe sneller de olie door de kleppen moet, hoe groter de kracht.'
      },
      {
        vraag: 'Welke uitlijnhoek zorgt dat het stuur na een bocht vanzelf terugkeert naar rechtuit?',
        opties: ['Caster (naloop)', 'Camber', 'Toespoor', 'Spoorbreedte'],
        goed: 0,
        uitleg: 'Door de naloop ligt het contactpunt van de band achter het snijpunt van de fusee-as met de weg; de band trekt zichzelf recht.'
      },
      {
        vraag: 'Een band slijt snel aan één rand, met een zaagtandpatroon. Welke afwijking is de meest waarschijnlijke oorzaak?',
        opties: ['Te lage veerstijfheid', 'Te veel caster', 'Te hoge bandenspanning', 'Verkeerd toespoor'],
        goed: 3,
        uitleg: 'Fout toespoor laat de band continu een beetje schuin over de weg schuren, wat een zaagtand aan de rand geeft.'
      }
    ]
  },
  {
    id: 'hybride-aandrijving',
    categorie: 'auto',
    titel: 'Hybride aandrijving: mild, vol en plug-in',
    kern: 'Een hybride combineert verbrandingsmotor en elektromotor; hoeveel de elektromotor kan, bepaalt of het mild, vol of plug-in is.',
    uitleg: [
      'Een mild hybride heeft meestal een 48-voltsysteem met een riemgedreven startergenerator. Die kan bij remmen energie terugwinnen, de motor helpen bij optrekken (boost) en de start-stop soepel maken, maar de auto niet zelfstandig elektrisch laten rijden. De winst is beperkt, orde enkele procenten tot tien procent.',
      'Een volle hybride (bijv. het Toyota-systeem) kan korte stukken volledig elektrisch rijden. In het bekende Toyota-ontwerp verbindt een planetair tandwielstelsel de motor, een generator en een elektromotor; door het toerental van de generator te regelen ontstaat een traploze overbrenging (e-CVT) zonder koppeling of versnellingen. De motor kan zo vaak in zijn gunstigste werkpunt draaien en werkt volgens de Atkinson-cyclus (inlaat sluit laat), met hoger rendement maar minder koppel, dat de elektromotor aanvult.',
      'Een plug-in hybride heeft een veel grotere accu (orde 10–25 kWh) die je aan het net laadt, goed voor typisch 40–80 km elektrisch. Het voordeel staat of valt met laden: wie nooit oplaadt, rijdt rond met een paar honderd kilo extra accu. Een serie-hybride of range extender heeft de verbrandingsmotor alleen als generator; de wielen worden altijd elektrisch aangedreven.'
    ],
    feiten: [
      'Mild hybride: meestal 48 V, elektrisch vermogen orde 10–20 kW.',
      'Volle hybride: accu meestal ca. 1–2 kWh; plug-in: ca. 10–25 kWh.',
      'De officiële WLTP-verbruikscijfers van plug-ins gaan uit van regelmatig laden en zijn in de praktijk vaak veel hoger.',
      'Atkinson-cyclus: de expansieslag is effectief langer dan de compressieslag, wat het rendement verhoogt.'
    ],
    vragen: [
      {
        vraag: 'Wat kan een mild hybride (48 V) doorgaans níét?',
        opties: [
          'Energie terugwinnen bij het remmen',
          'Zelfstandig elektrisch rijden',
          'De verbrandingsmotor ondersteunen bij optrekken',
          'De motor soepel herstarten na start-stop'
        ],
        goed: 1,
        uitleg: 'De startergenerator is te klein en de accu te klein om de auto zelfstandig voort te bewegen.'
      },
      {
        vraag: 'Hoe maakt een volle hybride in Toyota-stijl een traploze overbrenging zonder versnellingen?',
        opties: [
          'Met een duwband tussen twee poelies',
          'Met een dubbele koppeling',
          'Met een koppelomvormer',
          'Met een planetair tandwielstelsel waarvan de generator het toerental regelt'
        ],
        goed: 3,
        uitleg: 'Motor, generator en uitgaande as zitten elk op een deel van het planeetstelsel; door de generator te remmen of te laten draaien varieert de verhouding.'
      },
      {
        vraag: 'Wanneer levert een plug-in hybride het grootste milieuvoordeel?',
        opties: [
          'Als hij dagelijks wordt opgeladen en korte ritten elektrisch rijdt',
          'Als hij vooral lange snelwegritten maakt',
          'Als de accu zo vol mogelijk wordt gehouden door de motor',
          'Als hij nooit wordt opgeladen'
        ],
        goed: 0,
        uitleg: 'Zonder laden sleept een PHEV vooral extra gewicht mee; het voordeel zit in elektrische kilometers uit het net.'
      }
    ]
  },
  // ───────────────────────────── MOTORFIETS ─────────────────────────────
  {
    id: 'tweetakt-vs-viertakt',
    categorie: 'motorfiets',
    titel: 'Tweetakt versus viertakt',
    kern: 'Een tweetakt heeft elke omwenteling een arbeidsslag, maar spoelt via poorten en verliest daarbij onverbrand mengsel: krachtig, licht en vuil.',
    uitleg: [
      'Een tweetakt heeft geen kleppen. De zuiger zelf opent en sluit poorten in de cilinderwand. Terwijl hij omhoog gaat, comprimeert hij boven het mengsel en zuigt hij onder (in het carter) vers mengsel aan. Bij het naar beneden gaan wordt dat mengsel in het carter licht samengeperst; zodra de zuiger de uitlaatpoort en daarna de spoelpoorten vrijgeeft, stroomt vers mengsel de cilinder in en duwt het uitlaatgas naar buiten.',
      'Omdat het carter deel is van het gaspad, kan er geen oliebad in. De smering gebeurt daarom met olie die met de benzine wordt meegevoerd (mengsmering, bijv. 1:50, of een aparte oliepomp die doseert). Die olie verbrandt mee: blauwe rook.',
      'Het probleem van de spoeling: uitlaat- en spoelpoorten staan tegelijk open, dus een deel van het verse mengsel verdwijnt rechtstreeks de uitlaat in. Dat betekent hoge koolwaterstofemissies en een slecht verbruik. Een expansiepijp (de buikige uitlaat) gebruikt drukgolven om een deel terug te duwen, maar alleen in een smal toerengebied: vandaar het felle “powerband”-karakter.',
      'Voordelen blijven: dubbel zoveel arbeidsslagen per omwenteling, weinig onderdelen, laag gewicht. Maar de Euro-emissienormen zijn met een eenvoudige tweetakt nauwelijks haalbaar, waardoor hij op de weg vrijwel is verdwenen. In crossmotoren, kettingzagen en (met directe injectie) enkele moderne enduro’s bestaat hij nog.'
    ],
    feiten: [
      'Tweetakt: één arbeidsslag per krukasomwenteling (360°); viertakt: één per twee omwentelingen (720°).',
      'Mengsmering wordt vaak in verhoudingen van 1:25 tot 1:50 opgegeven; volg altijd de fabrikant.',
      'De grote MotoGP- en 500cc-tweetakten werden in 2002 vervangen door viertakten.',
      'Sommige moderne tweetakten spuiten de brandstof pas in nadat de uitlaatpoort bijna dicht is (transfer port injection), wat het spoelverlies sterk verkleint.'
    ],
    vragen: [
      {
        vraag: 'Waarom heeft een klassieke tweetakt mengsmering nodig?',
        opties: [
          'Omdat het carter het mengsel aanzuigt en dus geen oliebad kan bevatten',
          'Omdat tweetakten heter worden',
          'Omdat er geen oliepomp in past',
          'Omdat benzine zelf geen smerende werking heeft bij hoge toeren'
        ],
        goed: 0,
        uitleg: 'Het carter is een pompkamer voor het verse mengsel; een oliebad zou meteen mee de cilinder in gaan.'
      },
      {
        vraag: 'Wat is de hoofdreden dat tweetakten van de weg zijn verdwenen?',
        opties: [
          'Ze leveren te weinig vermogen',
          'Ze zijn duurder om te bouwen',
          'Spoelverliezen en meeverbrande olie maken het halen van emissienormen zeer moeilijk',
          'Ze zijn niet geschikt voor elektronische injectie'
        ],
        goed: 2,
        uitleg: 'Vers mengsel ontsnapt deels onverbrand via de uitlaat en olie verbrandt mee: veel HC en roet.'
      },
      {
        vraag: 'Wat doet de expansiepijp van een tweetakt?',
        opties: [
          'Hij dempt alleen het geluid',
          'Hij koelt het uitlaatgas zodat de zuiger niet smelt',
          'Hij vervangt de katalysator',
          'Hij gebruikt drukgolven om ontsnapt vers mengsel terug de cilinder in te duwen'
        ],
        goed: 3,
        uitleg: 'Een gereflecteerde drukgolf komt precies terug als de uitlaatpoort nog open is — maar alleen in een bepaald toerengebied.'
      }
    ]
  },
  {
    id: 'cilinderconfiguraties-motor',
    categorie: 'motorfiets',
    titel: 'Cilinderconfiguraties: van eencilinder tot boxer',
    kern: 'De opstelling van cilinders en krukas bepaalt balans, trillingen, breedte en het karakter van de motor.',
    uitleg: [
      'Elke zuiger die op en neer gaat veroorzaakt traagheidskrachten. Primaire krachten wisselen één keer per omwenteling; secundaire twee keer (omdat de drijfstang schuin staat, beweegt de zuiger rond BDP sneller dan rond ODP). Een eencilinder heeft beide onbalansen; tegengewichten en vaak een balansas temperen het. Karakter: veel koppel laag in de toeren, licht, smal, maar trillerig.',
      'Een paralleltwin met 360° krukas loopt als een grote eencilinder; met 180° heffen de primaire krachten elkaar op maar ontstaat een schommelkoppel. De populaire 270°-krukas bootst het ontstekingsritme en de tractie van een 90°-V-twin na. Een 90°-V-twin heeft (met één gedeelde krukpen) perfecte primaire balans: de ene cilinder vult de andere aan. Dat geeft een soepel maar karaktervol, onregelmatig vuurritme.',
      'De viercilinder-in-lijn (met 180°-krukas) is primair in balans maar heeft secundaire trillingen; hij is breed maar draait hoog in de toeren en levert veel topvermogen. De boxer (twee liggende tegenover elkaar bewegende cilinders, zoals bij BMW) heeft goede balans en een laag zwaartepunt; door de licht verschoven cilinders blijft een klein schommelkoppel, en bij gas geven zie je de motor iets opzij “wiebelen” door de reactie van de lengte-krukas.',
      'De driecilinder (120°-krukas) is een tussenvorm: smaller dan een vier, met een eigen schommelkoppel dat met een balansas wordt opgevangen, en met veel koppel en een karakteristiek geluid.'
    ],
    feiten: [
      'Een 90°-V-twin met gedeelde krukpen heeft perfecte primaire balans.',
      'Een 270°-paralleltwin heeft dezelfde ontstekingsintervallen als een 90°-V-twin (270° en 450°).',
      'Bij de BMW-boxer ligt de krukas in de lengterichting; koppelreactie bij gas geven laat de motor iets naar opzij hellen.',
      'Secundaire onbalans groeit met het kwadraat van het toerental.'
    ],
    vragen: [
      {
        vraag: 'Waarom heeft een 90°-V-twin een goede primaire balans?',
        opties: [
          'De twee zuigers bewegen altijd in tegengestelde richting',
          'De primaire krachten van de twee cilinders vullen elkaar zo aan dat een tegengewicht op de krukas ze volledig kan compenseren',
          'Er is geen drijfstang nodig',
          'De cilinders vuren tegelijk'
        ],
        goed: 1,
        uitleg: 'Met de cilinders 90° uit elkaar is de resulterende primaire kracht een roterende vector van constante grootte, die een krukastegengewicht exact kan opheffen.'
      },
      {
        vraag: 'Waarom kiezen fabrikanten vaak een 270°-krukas voor paralleltwins?',
        opties: [
          'Om de motor smaller te maken',
          'Omdat hij goedkoper is',
          'Om het vuurritme en tractiekarakter van een 90°-V-twin na te bootsen met betere balans dan een 360°-twin',
          'Omdat er dan geen balansas nodig is in enige configuratie'
        ],
        goed: 2,
        uitleg: 'De 270°-krukas geeft ongelijke ontstekingsintervallen zoals een V-twin, wat tractie en karakter oplevert.'
      },
      {
        vraag: 'Welk karakter hoort typisch bij een viercilinder-in-lijn?',
        opties: [
          'Hoog toerental en veel topvermogen, maar relatief breed',
          'Zeer smal en licht met veel laag koppel',
          'Laag zwaartepunt door liggende cilinders',
          'Perfecte balans zonder secundaire trillingen'
        ],
        goed: 0,
        uitleg: 'Kleine, lichte zuigers maken hoge toeren mogelijk; secundaire trillingen blijven wel aanwezig.'
      }
    ]
  },
  {
    id: 'eindaandrijving-motor',
    categorie: 'motorfiets',
    titel: 'Eindaandrijving: ketting, riem of cardan',
    kern: 'Ketting is licht en efficiënt maar vraagt onderhoud; riem is schoon en stil; cardan is onderhoudsarm maar zwaar.',
    uitleg: [
      'De ketting is het meest gebruikt: licht, efficiënt (orde 97–98% bij goed onderhoud) en de overbrenging is eenvoudig te wijzigen met een ander tandwiel. Moderne kettingen hebben O-, X- of Z-ringen die het vet in de pennen opsluiten; de buitenkant moet wel regelmatig worden gereinigd en gesmeerd, orde elke 500–1000 km en na regen.',
      'Kettingspanning is belangrijk omdat de afstand tussen voortandwiel en achteras verandert bij in- en uitveren van de achterbrug. De ketting moet daarom in onbelaste toestand speling hebben (vaak in de orde van 25–35 mm, kijk in het handboek). Te strak: bij inveren wordt de ketting kapotgetrokken en slijten lagers. Te slap: de ketting kan overslaan of eraf lopen.',
      'Een getande riem (bijv. Harley-Davidson) rekt nauwelijks, hoeft niet gesmeerd te worden en is stil, maar is breder en gevoelig voor steentjes. Een cardan (BMW, Moto Guzzi, veel tourers) is gesloten en vrijwel onderhoudsvrij, maar zwaar, iets minder efficiënt en geeft reactiekrachten: bij gas geven wil de achterkant omhoog komen. Systemen als BMW Paralever compenseren dat met een extra scharnierpunt.'
    ],
    feiten: [
      'Kettingslijtage meet je aan rek: als de ketting achter op het tandwiel ver van de tanden te trekken is, zijn ketting en tandwielen op.',
      'Vervang ketting, voor- en achtertandwiel altijd als set: versleten tandwielen slopen een nieuwe ketting snel.',
      'Een kleiner voortandwiel (één tand minder) geeft snellere acceleratie en hogere toeren op de snelweg.',
      'Een cardan heeft in de achterbrug een haaks tandwielpaar met olie dat periodiek ververst moet worden.'
    ],
    letOp: 'Kettingspanning meten op de middenbok of zijstandaard volgens handboek; de beste meting is op het strakste punt van de ketting (draai het wiel rond).',
    vragen: [
      {
        vraag: 'Waarom moet een motorketting speling hebben?',
        opties: [
          'Om geluid te verminderen',
          'Omdat de afstand tussen voortandwiel en achteras verandert bij het in- en uitveren',
          'Omdat de ketting anders te snel droogvalt',
          'Om warmte-uitzetting van het frame op te vangen'
        ],
        goed: 1,
        uitleg: 'Het scharnierpunt van de achterbrug ligt niet op de as van het voortandwiel; bij inveren wordt de afstand groter.'
      },
      {
        vraag: 'Welk nadeel heeft een cardanaandrijving?',
        opties: [
          'Hij moet om de 500 km gesmeerd worden',
          'Hij is gevoelig voor steentjes',
          'Hij is zwaarder en geeft reactiekrachten op de vering bij gas geven',
          'Hij rekt snel uit'
        ],
        goed: 2,
        uitleg: 'Het koppel op de haakse overbrenging wil de achterbrug laten draaien; zonder compensatie komt de achterkant omhoog bij gas.'
      },
      {
        vraag: 'Je ketting is versleten. Wat vervang je?',
        opties: [
          'Alleen de ketting',
          'Alleen het achtertandwiel',
          'De ketting en het voortandwiel',
          'Ketting, voortandwiel en achtertandwiel samen'
        ],
        goed: 3,
        uitleg: 'Ketting en tandwielen slijten samen in; een nieuwe ketting op oude tandwielen slijt veel sneller.'
      }
    ]
  },
  {
    id: 'koppeling-motorfiets',
    categorie: 'motorfiets',
    titel: 'Natte platenkoppeling en slipper clutch',
    kern: 'De meeste motorfietsen hebben een meervoudige platenkoppeling in olie; een slipper clutch voorkomt dat het achterwiel blokkeert bij terugschakelen.',
    uitleg: [
      'Een motorfiets heeft weinig ruimte, dus in plaats van één grote plaat (zoals in een auto) zitten er een stapel kleine frictie- en staalplaten afwisselend in een koppelingsmand. Veel kleine wrijvingsvlakken samen kunnen evenveel koppel overbrengen als één grote plaat. De koppeling draait meestal in de motorolie (nat): dat koelt goed, maakt slippen bij langzaam rijden mogelijk zonder te verbranden, en de koppeling gaat lang mee.',
      'Dat heeft gevolgen voor de olie: autoolie met wrijvingsverlagende toevoegingen (friction modifiers) kan de koppeling laten slippen. Motorolie voor motorfietsen met natte koppeling heeft daarom een JASO MA- of MA2-specificatie.',
      'Bij hard terugschakelen wil de motor het achterwiel via de koppeling afremmen tot het motortoerental (motorrem). Bij een sportmotor met hoge compressie kan dat het achterwiel laten stuiteren of blokkeren (rear wheel hop). Een slipper clutch heeft tussen naaf en mand schuine nokken (ramps): als het koppel van achteren komt, drukken de nokken de platen deels uit elkaar zodat de koppeling slipt. Bij gas geven werken dezelfde nokken vaak juist andersom en klemmen ze extra (assist), waardoor lichtere veren en een lichtere hendel mogelijk zijn.'
    ],
    feiten: [
      'Natte koppeling: platen draaien in motorolie; droge koppeling (o.a. oudere Ducati’s) heeft het bekende ratelende geluid.',
      'JASO MA/MA2 is de oliespecificatie voor motorfietsen met natte koppeling.',
      'Een slipper clutch laat slippen bij negatief koppel (motorrem), niet bij aandrijven.',
      'De versnellingsbak van een motorfiets is sequentieel: je kunt alleen één versnelling op of neer.'
    ],
    vragen: [
      {
        vraag: 'Waarom gebruikt een motorfiets meerdere kleine koppelingsplaten in plaats van één grote?',
        opties: [
          'Omdat er weinig ruimte is en veel wrijvingsvlakken samen voldoende koppel overbrengen',
          'Omdat dat goedkoper is',
          'Omdat één plaat in olie niet werkt',
          'Om terugschakelen zonder koppeling mogelijk te maken'
        ],
        goed: 0,
        uitleg: 'Het over te brengen koppel is evenredig met het aantal wrijvingsvlakken; zo blijft de diameter klein.'
      },
      {
        vraag: 'Wat voorkomt een slipper clutch?',
        opties: [
          'Doorslippen van de koppeling bij vol gas',
          'Oververhitting bij langzaam rijden in de file',
          'Valse neutraal tussen twee versnellingen',
          'Stuiteren of blokkeren van het achterwiel bij hard terugschakelen'
        ],
        goed: 3,
        uitleg: 'Bij negatief koppel lichten schuine nokken de drukplaat, zodat de koppeling slipt in plaats van het achterwiel.'
      },
      {
        vraag: 'Waarom kun je niet zomaar autoolie gebruiken in een motorfiets met natte koppeling?',
        opties: [
          'Autoolie is te dik',
          'Autoolie bevat vaak wrijvingsverlagende additieven die de koppeling laten slippen',
          'Autoolie verdraagt geen hoge toerentallen',
          'Autoolie tast de koppelingsplaten chemisch aan'
        ],
        goed: 1,
        uitleg: 'Friction modifiers verlagen de wrijving tussen de platen; JASO MA-olie is daar specifiek op afgestemd.'
      }
    ]
  },
  {
    id: 'remmen-motorfiets',
    categorie: 'motorfiets',
    titel: 'Remmen op een motorfiets',
    kern: 'Bij hard remmen verschuift zoveel gewicht naar voren dat de voorrem het overgrote deel van de remkracht levert.',
    uitleg: [
      'Een motorfiets is kort en heeft een hoog zwaartepunt ten opzichte van de wielbasis. Bij remmen werkt de vertragingskracht op het zwaartepunt, terwijl de remkracht op de weg werkt: dat koppel drukt het voorwiel zwaarder en ontlast het achterwiel. Bij een noodstop op droog asfalt levert de voorrem daardoor ruwweg 70–90% van de remkracht, en het achterwiel kan bijna loskomen (stoppie).',
      'Daarom hebben motoren voor meestal twee grote schijven met radiaal gemonteerde vierzuigerklauwen, en achter één kleinere schijf. De remhendel bedient alleen voor; het pedaal achter. Goed remmen betekent de voorrem progressief opbouwen: eerst de vering laten inzakken en het gewicht laten verplaatsen, dan pas volle druk. Een plotse ruk blokkeert het voorwiel voordat het belast is.',
      'Een geblokkeerd voorwiel betekent op een motorfiets vrijwel zeker een val: zonder draaiend wiel verdwijnt het stabiliserende gyroscopisch effect en de stuurwerking. ABS is daarom sinds 2016 in de EU verplicht voor nieuwe motoren boven 125 cc. Bocht-ABS (met een traagheidssensor, IMU) houdt rekening met de hellingshoek. Combiremsystemen koppelen voor en achter, zodat ook bij alleen het pedaal beide wielen remmen.'
    ],
    feiten: [
      'Bij een noodstop: voorrem orde 70–90% van de totale remkracht.',
      'ABS is in de EU sinds 2016 verplicht op nieuwe motorfietsen boven 125 cc; daaronder ABS of combirem.',
      'Bocht-ABS gebruikt een IMU die hellingshoek en giersnelheid meet.',
      'Op een gladde of losse ondergrond verschuift minder gewicht naar voren, dus is het achterrem-aandeel relatief groter.'
    ],
    letOp: 'Remmen in een bocht vermindert de beschikbare zijgrip; rem zo veel mogelijk vóór de bocht, rechtop.',
    vragen: [
      {
        vraag: 'Waarom levert de voorrem op een motorfiets het grootste deel van de remkracht?',
        opties: [
          'De voorschijf is altijd groter',
          'Het achterwiel is aangedreven en kan daardoor minder remmen',
          'Door de gewichtsverplaatsing naar voren heeft het voorwiel veel meer grip',
          'Omdat de hendel hydraulisch is en het pedaal mechanisch'
        ],
        goed: 2,
        uitleg: 'Grip is evenredig met de wiellast. Hoog zwaartepunt en korte wielbasis zetten bijna al het gewicht op het voorwiel.'
      },
      {
        vraag: 'Hoe rem je maximaal met de voorrem zonder ABS?',
        opties: [
          'In één keer volle kracht',
          'Druk progressief opbouwen zodat de vering eerst inzakt en het voorwiel belast wordt',
          'Pompend remmen',
          'Eerst de achterrem blokkeren, dan voor'
        ],
        goed: 1,
        uitleg: 'Een direct vol geknepen hendel blokkeert het voorwiel voordat de gewichtsverplaatsing er is.'
      },
      {
        vraag: 'Wat voegt bocht-ABS toe aan gewone ABS?',
        opties: [
          'Het houdt via een traagheidssensor rekening met de hellingshoek',
          'Het remt automatisch voor bochten',
          'Het verdeelt de remkracht 50/50',
          'Het voorkomt wheelies bij accelereren'
        ],
        goed: 0,
        uitleg: 'Onder een hellingshoek is minder grip over voor remmen; bocht-ABS begrenst de remdruk daarop en voorkomt dat de motor opricht.'
      }
    ]
  },
  {
    id: 'tegensturen-geometrie',
    categorie: 'motorfiets',
    titel: 'Sturen in een bocht: tegensturen, rake en trail',
    kern: 'Boven wandeltempo stuur je een motor eerst kort de andere kant op om hem te laten hellen: duwen links is links.',
    uitleg: [
      'Een motorfiets maakt een bocht door te hellen: de zwaartekracht over het contactpunt moet in evenwicht zijn met de middelpuntzoekende kracht. Maar om te gaan hellen moeten de wielen eerst onder het zwaartepunt vandaan worden gestuurd. Duw je het linker stuurhandvat naar voren, dan draait het voorwiel kort naar rechts, de wielen schuiven naar rechts onder de motor uit, en de motor valt naar links: hij gaat linksaf. Dit heet tegensturen en iedereen doet het boven zo’n 15–20 km/h, meestal onbewust.',
      'Het gyroscopisch effect van de draaiende wielen helpt: een kantelend voorwiel krijgt een stuurmoment (precessie), en een draaiend wiel verzet zich tegen snelle veranderingen. Toch is de belangrijkste stabiliteitsbron de geometrie: de balhoofdhoek (rake) en de naloop (trail).',
      'Rake is de hoek van de balhoofdbuis ten opzichte van de verticaal, bij sportmotoren rond 23–25°, bij choppers 30° of meer. Trail is de afstand op de grond tussen het contactpunt van de band en het punt waar het verlengde van de stuuras de weg raakt; het contactpunt ligt erachter, net als bij een winkelwagenwieltje. Meer trail geeft meer rechtuitstabiliteit maar trager sturen; minder trail maakt de motor wendbaar maar nerveus.',
      'Een stuurdemper (een kleine schokdemper tussen frame en kroonplaat) dempt snelle stuurtrillingen zoals tankslappers, die bij snelle sportmotoren met weinig trail kunnen optreden als het voorwiel even licht wordt.'
    ],
    feiten: [
      'Benodigde hellingshoek: tan θ = v² / (g × r) — onafhankelijk van het gewicht.',
      'Bij 1 g zijdelingse versnelling hoort ca. 45° helling; racers halen met speciale banden boven de 60°.',
      'Typische trail van een sportmotor: orde 90–105 mm.',
      'Bij zeer lage snelheid (stapvoets) stuur je wél direct de kant op waar je heen wilt.'
    ],
    formules: [
      { formule: 'tan θ = v² / (g × r)', betekenis: 'Hellingshoek θ voor een bocht met straal r bij snelheid v (g = 9,81 m/s²).' }
    ],
    vragen: [
      {
        vraag: 'Je rijdt 80 km/h en wilt naar rechts. Wat doe je met het stuur?',
        opties: [
          'Het rechter handvat naar je toe trekken',
          'Het linker handvat naar voren duwen',
          'Het rechter handvat naar voren duwen',
          'Niets: alleen met je lichaam naar rechts leunen'
        ],
        goed: 2,
        uitleg: 'Duwen rechts = rechts: het voorwiel stuurt kort naar links, de motor valt naar rechts en volgt de bocht.'
      },
      {
        vraag: 'Wat is trail (naloop)?',
        opties: [
          'De hoek van de voorvork ten opzichte van de verticaal',
          'De afstand tussen voor- en achteras',
          'De doorbuiging van de voorvork bij remmen',
          'De afstand op de grond tussen het contactpunt van de band en het snijpunt van de stuuras met de weg'
        ],
        goed: 3,
        uitleg: 'Het contactpunt ligt achter het stuurasspunt; daardoor trekt het voorwiel zich recht, net als een zwenkwiel.'
      },
      {
        vraag: 'Wat is het effect van meer trail?',
        opties: [
          'Meer rechtuitstabiliteit, maar trager insturen',
          'Snellere reactie op stuurinput',
          'Kortere remweg',
          'Minder gyroscopisch effect'
        ],
        goed: 0,
        uitleg: 'Het zelfrichtende moment neemt toe met trail: stabiel, maar je moet meer kracht zetten om van richting te veranderen.'
      },
      {
        vraag: 'Waarvan hangt de benodigde hellingshoek in een bocht níét af?',
        opties: ['De snelheid', 'De bochtstraal', 'Het gewicht van motor en rijder', 'De valversnelling'],
        goed: 2,
        uitleg: 'tan θ = v²/(g·r): massa valt weg, want zowel zwaartekracht als middelpuntzoekende kracht zijn evenredig met de massa.'
      }
    ]
  },
  {
    id: 'vering-motorfiets',
    categorie: 'motorfiets',
    titel: 'Vering: voorvork, upside-down en monoshock',
    kern: 'Een voorvork is veer, demper en geleiding tegelijk; de achterkant hangt meestal aan één schokdemper via een link.',
    uitleg: [
      'Een telescoopvork bestaat uit twee pootbuizen die in de vorkbenen schuiven. In elke poot zit een veer en (in minstens één poot) een oliedempingssysteem. Bij een conventionele vork zitten de dunne binnenpoten bovenaan in de kroonplaten. Bij een upside-down (USD) vork is het omgekeerd: de dikke buitenbuizen zitten in de kroonplaten. Dat is stijver op de plek waar het buigmoment het grootst is, en de onafgeveerde massa (wat met het wiel meebeweegt) wordt lager.',
      'De achterbrug scharniert aan het frame; vroeger met twee schokdempers, nu meestal één centrale monoshock, vaak via een progressief linksysteem: hoe verder de achterbrug inveert, hoe meer de link de demper samendrukt per millimeter wielweg. Zo is de vering soepel bij kleine hobbels en stijf bij grote klappen.',
      'Afstellen gebeurt met drie knoppen: voorspanning (beïnvloedt de rijhoogte en de doorzakking, sag, onder het rijdersgewicht, niet de veerstijfheid), indempen (compression) en uitdempen (rebound). Een vuistregel voor sag op de weg is orde 25–35% van de veerweg. Te weinig uitdemping laat de motor na een hobbel “pogoën”; te veel laat de vering bij opeenvolgende hobbels steeds verder inzakken (pakken).'
    ],
    feiten: [
      'Voorspanning verandert de veerstijfheid niet, alleen het startpunt op de veerkarakteristiek.',
      'Typische veerweg: sport ca. 120 mm voor, adventure/enduro 200 mm of meer.',
      'Bij remmen duikt de voorvork in; dat verkort de trail en de wielbasis en maakt de motor scherper insturen.',
      'Elektronisch verstelbare (semi-actieve) vering past de demping in milliseconden aan op basis van sensoren.'
    ],
    vragen: [
      {
        vraag: 'Waarom is een upside-down voorvork stijver dan een conventionele?',
        opties: [
          'De binnenbuizen zijn van titanium',
          'De dikke buitenbuizen zitten in de kroonplaten, waar het buigmoment het grootst is',
          'Er zit meer olie in',
          'Hij heeft twee keer zoveel veren'
        ],
        goed: 1,
        uitleg: 'Bij remmen buigt de vork het meest bij de kroonplaten; daar zit bij USD het dikste deel.'
      },
      {
        vraag: 'Wat doet het verhogen van de veervoorspanning?',
        opties: [
          'De veer wordt stijver',
          'De demping neemt toe',
          'De veerweg wordt langer',
          'De motor zakt minder in onder gewicht, maar de veerstijfheid blijft gelijk'
        ],
        goed: 3,
        uitleg: 'Voorspanning verschuift het werkpunt (sag); voor echt stijvere vering heb je een andere veer nodig.'
      },
      {
        vraag: 'Na een drempel blijft de achterkant van je motor op en neer deinen. Wat moet je meestal aanpassen?',
        opties: ['Meer uitdemping (rebound)', 'Minder voorspanning', 'Lagere bandenspanning', 'Minder indemping (compression)'],
        goed: 0,
        uitleg: 'Uitdemping remt het terugveren; te weinig daarvan geeft nadeinen.'
      }
    ]
  },
  {
    id: 'rijhulp-motorfiets',
    categorie: 'motorfiets',
    titel: 'Elektronica: tractiecontrole, IMU en quickshifter',
    kern: 'Moderne motoren meten met een IMU hun hellingshoek en regelen daarop vermogen, remdruk en wheelie-controle.',
    uitleg: [
      'Tractiecontrole vergelijkt de snelheid van voor- en achterwiel. Draait het achterwiel duidelijk sneller dan het voorwiel, dan slipt het, en de ECU knijpt het vermogen terug door de ontsteking te verlaten, injectie over te slaan of de elektronische gasklep (ride-by-wire) te sluiten. Een band kan in een bocht minder trekkracht leveren, omdat een deel van de grip al nodig is voor de zijkracht (de grip-cirkel of Kamm-cirkel).',
      'Daarom is een IMU (inertial measurement unit) zo belangrijk: een sensorblok met versnellingsmeters en gyroscopen in drie assen, dat hellingshoek, stampen en gieren meet. Met die hellingshoek kunnen tractiecontrole en ABS hun ingrijpgrenzen aanpassen: onder 45° helling mag er veel minder slip zijn dan rechtop. Wheelie-controle gebruikt de stampbeweging om het vermogen te beperken als het voorwiel opkomt.',
      'Een quickshifter laat je opschakelen zonder koppeling en zonder gas los te laten. Een sensor op de schakelstang detecteert de beweging, de ECU onderbreekt een fractie van een seconde (orde 50–100 ms) de ontsteking of injectie, waardoor het koppel op de tandwielen even wegvalt en de schakelklauwen vrijkomen. Een “autoblipper” doet bij terugschakelen het omgekeerde: een korte gasstoot om het toerental aan te passen.'
    ],
    feiten: [
      'Ride-by-wire: het gashendel stuurt een sensor aan; een elektromotor bedient de gasklep.',
      'Een IMU meet versnellingen en draaisnelheden rond drie assen (6 vrijheidsgraden).',
      'Rijmodi (regen, sport, enz.) veranderen meestal de gasrespons, tractiecontrole-instelling en ABS-strategie.',
      'De beschikbare grip wordt verdeeld tussen langs- en dwarskracht: hoe schuiner, hoe minder over voor gas of rem.'
    ],
    vragen: [
      {
        vraag: 'Hoe detecteert een eenvoudige tractiecontrole slip?',
        opties: [
          'Met een camera op het achterwiel',
          'Door de bandenspanning te meten',
          'Door de snelheid van voor- en achterwiel te vergelijken',
          'Door het geluid van de band te analyseren'
        ],
        goed: 2,
        uitleg: 'Als het aangedreven achterwiel duidelijk sneller draait dan het voorwiel, is er slip.'
      },
      {
        vraag: 'Waarom heeft tractiecontrole een IMU nodig om goed te werken in bochten?',
        opties: [
          'Om de route te navigeren',
          'Omdat onder helling minder grip beschikbaar is voor trekkracht, dus de toelaatbare slip lager is',
          'Omdat wielsensoren in bochten niet werken',
          'Om de vering hard te zetten'
        ],
        goed: 1,
        uitleg: 'De grip moet verdeeld worden over zijkracht en trekkracht; de IMU vertelt hoeveel helling er is.'
      },
      {
        vraag: 'Wat doet een quickshifter bij opschakelen?',
        opties: [
          'Kort de ontsteking of injectie onderbreken zodat de schakelklauwen onbelast vrijkomen',
          'De koppeling automatisch bedienen',
          'Een gasstoot geven',
          'De achterrem kort aanzetten'
        ],
        goed: 0,
        uitleg: 'Zonder koppel op de tandwielen kun je zonder koppeling schakelen; de onderbreking duurt maar tientallen milliseconden.'
      }
    ]
  },
  // ───────────────────────────── ELEKTRISCH ─────────────────────────────
  {
    id: 'lithium-ion-accu',
    categorie: 'elektrisch',
    titel: 'De lithium-ion-accu: cel, module, pack',
    kern: 'Een EV-accu is een pakket van honderden tot duizenden cellen; kWh is de energie (bereik), kW het vermogen (hoe snel).',
    uitleg: [
      'Een lithium-ion-cel bestaat uit een anode (meestal grafiet), een kathode (een metaaloxide zoals NMC: nikkel-mangaan-kobalt, of LFP: lithium-ijzerfosfaat), een separator en een vloeibaar elektrolyt. Bij ontladen bewegen lithiumionen door het elektrolyt van de anode naar de kathode, terwijl de elektronen via het externe circuit — de motor — gaan. Laden duwt ze terug.',
      'Een cel levert maar enkele volts: NMC nominaal ca. 3,6–3,7 V, LFP ca. 3,2 V. Om op 400 V te komen schakel je er zo’n 96–108 in serie; voor capaciteit zet je groepjes parallel. Cellen zijn er in cilindrische vorm (zoals 2170 en 4680), als prismatische blokken of als zakjes (pouch). Ze worden gebundeld in modules en die in een pack met koeling, stroomrails en een batterijmanagementsysteem (BMS) dat elke celspanning en temperatuur bewaakt.',
      'Het verschil tussen kWh en kW is essentieel. kWh is energie: een accu van 60 kWh kan een uur lang 60 kW leveren, of zes uur 10 kW. kW is vermogen: hoe snel energie stroomt, voor de motor of bij het laden. Een grotere accu geeft meer bereik, maar ook meer laadvermogen bij dezelfde C-rate.',
      'De energiedichtheid van cellen ligt rond 150–300 Wh/kg, afhankelijk van chemie. Benzine bevat ca. 12.000 Wh/kg; maar een elektromotor zet zijn energie drie tot vier keer efficiënter om, en de accu wordt niet leeg-lichter. Daarom wegen EV-accu’s honderden kilo’s. LFP is minder energiedicht dan NMC, maar goedkoper, kobaltvrij, gaat meer laadcycli mee en mag vaker tot 100% geladen worden.'
    ],
    feiten: [
      'NMC-cel: ca. 3,6–3,7 V nominaal; LFP: ca. 3,2 V.',
      '400 V-architectuur: ca. 96 cellen in serie (NMC); 800 V: ca. 192.',
      'Celniveau: orde 160–300 Wh/kg; packniveau lager door behuizing, koeling en elektronica.',
      'Bruikbare capaciteit is kleiner dan bruto capaciteit: het BMS houdt een buffer aan de boven- en onderkant.'
    ],
    formules: [
      { formule: 'E = U × Q', betekenis: 'Energie (Wh) = spanning (V) × lading (Ah). 400 V × 150 Ah = 60 kWh.' },
      { formule: 'E = P × t', betekenis: 'Energie (kWh) = vermogen (kW) × tijd (h).' }
    ],
    vragen: [
      {
        vraag: 'Wat zegt het getal 77 kWh bij een EV?',
        opties: [
          'Het maximale laadvermogen',
          'Het motorvermogen',
          'De hoeveelheid energie die de accu kan opslaan',
          'Het verbruik per 100 km'
        ],
        goed: 2,
        uitleg: 'kWh is energie (capaciteit, dus bereik); kW is vermogen.'
      },
      {
        vraag: 'Waarom worden cellen in serie geschakeld?',
        opties: [
          'Om de spanning op te tellen tot honderden volts',
          'Om de capaciteit in Ah te verhogen',
          'Om de cellen koeler te houden',
          'Om bij een defecte cel door te kunnen rijden'
        ],
        goed: 0,
        uitleg: 'Serie telt spanningen op; parallel telt capaciteit (Ah) op.'
      },
      {
        vraag: 'Welke eigenschap past bij LFP ten opzichte van NMC?',
        opties: [
          'Hogere energiedichtheid',
          'Hogere celspanning',
          'Bevat meer kobalt',
          'Meer laadcycli en beter bestand tegen vaak 100% laden'
        ],
        goed: 3,
        uitleg: 'LFP is robuuster en goedkoper, maar minder energiedicht en heeft een lagere celspanning (ca. 3,2 V).'
      }
    ]
  },
  {
    id: 'laadcurve-c-rate',
    categorie: 'elektrisch',
    titel: 'Laadsnelheid en laadcurve',
    kern: 'Snelladen is snel tot ongeveer 80%; daarna moet de stroom omlaag omdat de celspanning zijn maximum nadert.',
    uitleg: [
      'Een lithium-ion-cel wordt geladen volgens een CC-CV-profiel: eerst constante stroom (CC), waarbij de spanning geleidelijk stijgt, en zodra de maximale celspanning bereikt wordt (orde 4,2 V bij NMC) constante spanning (CV), waarbij de stroom steeds verder afneemt. In de laadcurve van een auto zie je dat als een hoog plateau dat na ca. 50–80% steeds verder daalt.',
      'Waarom niet altijd vol vermogen? Bij hoge stroom moeten lithiumionen snel de grafietanode in. Als dat niet lukt (vol, koud of te snel), slaat lithium als metaal neer op het oppervlak: lithium plating. Dat kost capaciteit en kan uitgroeien tot dendrieten die de separator doorprikken. Vandaar dat een koude accu veel langzamer laadt; moderne EV’s verwarmen de accu voor (preconditioning) als je naar een snellader navigeert.',
      'De C-rate drukt laadstroom uit ten opzichte van de capaciteit: 1C laadt de accu theoretisch in één uur, 2C in een half uur. Een 75 kWh-accu die met 150 kW laadt, laadt dus met 2C. Warmte is de begrenzing: de verliezen in de cel groeien met het kwadraat van de stroom (I²R). Een 800 V-architectuur halveert bij hetzelfde vermogen de stroom en dus vierendeelt de weerstandsverliezen in kabels en contacten.',
      'Praktisch gevolg: op een roadtrip is twee keer kort laden van 10 naar 60% vaak sneller dan één keer van 10 naar 100%. Het laatste stuk, 80–100%, kan bijna even lang duren als 10–80%.'
    ],
    feiten: [
      '1C = de accu in één uur vol (theoretisch); 75 kWh laden met 150 kW = 2C.',
      'Weerstandsverliezen: P_verlies = I² × R; halve stroom = kwart verlies.',
      'Onder ca. 0–10 °C laadt een accu vaak flink langzamer om lithium plating te voorkomen.',
      'Fabrikanten geven snellaadtijden meestal op voor 10–80%.'
    ],
    formules: [
      { formule: 'C-rate = P_laad / E_accu', betekenis: 'Laadvermogen (kW) gedeeld door accucapaciteit (kWh) geeft de C-rate in 1/h.' },
      { formule: 'P_verlies = I² × R', betekenis: 'Warmteontwikkeling in cellen, kabels en contacten.' }
    ],
    letOp: 'Dagelijks laden tot ca. 80% (NMC) is beter voor de levensduur; 100% alleen vlak voor een lange rit. Voor LFP adviseren fabrikanten vaak juist periodiek tot 100% voor correcte kalibratie van het BMS.',
    vragen: [
      {
        vraag: 'Waarom zakt het laadvermogen boven ca. 80%?',
        opties: [
          'De laadpaal wordt te heet',
          'De celspanning nadert het maximum; het laadsysteem moet overgaan op constante spanning met dalende stroom',
          'De accu is dan te koud',
          'Omdat de laadkabel een hoger vermogen niet aankan'
        ],
        goed: 1,
        uitleg: 'In de CV-fase mag de spanning niet verder stijgen, dus neemt de stroom geleidelijk af.'
      },
      {
        vraag: 'Een auto met 60 kWh accu laadt met 120 kW. Wat is de C-rate?',
        opties: ['0,5C', '1C', '4C', '2C'],
        goed: 3,
        uitleg: '120 / 60 = 2C.'
      },
      {
        vraag: 'Wat is lithium plating?',
        opties: [
          'Neerslag van metallisch lithium op de anode bij te snel of te koud laden',
          'Een beschermende coating op de accubehuizing',
          'Het volledig ontladen van een cel',
          'Het balanceren van celspanningen door het BMS'
        ],
        goed: 0,
        uitleg: 'Als ionen niet snel genoeg in het grafiet kunnen, slaat lithium als metaal neer: capaciteitsverlies en kortsluitrisico.'
      },
      {
        vraag: 'Wat is het voordeel van een 800 V-architectuur bij snelladen?',
        opties: [
          'De accu kan meer energie opslaan',
          'De auto heeft geen inverter meer nodig',
          'Bij hetzelfde vermogen is de stroom de helft, dus minder warmte in kabels en contacten',
          'De motor heeft meer koppel'
        ],
        goed: 2,
        uitleg: 'P = U × I; dubbele spanning, halve stroom, en weerstandsverlies (I²R) wordt een kwart.'
      }
    ]
  },
  {
    id: 'ac-dc-laden',
    categorie: 'elektrisch',
    titel: 'AC laden versus DC snelladen',
    kern: 'Een accu laadt altijd met gelijkstroom; de vraag is of de omzetting van wisselstroom in de auto gebeurt of in de laadpaal.',
    uitleg: [
      'Bij AC-laden (thuis, aan een publieke paal) levert de paal wisselstroom en zet de boordlader (on-board charger, OBC) in de auto die om naar gelijkstroom. Omdat die lader in elke auto mee moet, is hij beperkt in vermogen: meestal 7,4 of 11 kW, soms 22 kW. Het vermogen hangt af van het aantal fasen en de stroom: 1-fase 230 V × 16 A ≈ 3,7 kW; 3-fase 400 V × 16 A ≈ 11 kW; 3-fase 32 A ≈ 22 kW. In Europa is de stekker Type 2 (Mennekes).',
      'Een auto met een 1-fase-boordlader laadt aan een 11 kW-paal toch maar met 3,7 of 7,4 kW. Het laagste van paal, kabel en boordlader bepaalt de snelheid. Voor dagelijks gebruik is AC prima: een nacht 11 kW is genoeg voor honderden kilometers.',
      'Bij DC-snelladen staat de grote gelijkrichter in de paal (vandaar de kast ter grootte van een koelkast) en gaat gelijkstroom direct naar de accu, langs de boordlader. Het BMS van de auto communiceert continu met de paal welke spanning en stroom het wil. In Europa is CCS2 de standaard (Type 2 met twee dikke DC-pinnen eronder). Vermogens lopen van 50 kW tot 350 kW of meer; de laadkabels van de snelste palen zijn vloeistofgekoeld.',
      'In Nederland staat het voor laden relevante elektriciteitsnet op 230/400 V. Een typische woning heeft een 3×25 A-aansluiting; een 11 kW-lader (3×16 A) past daar meestal op, liefst met slim laden (load balancing) zodat de hoofdzekering niet aanspreekt.'
    ],
    feiten: [
      '1-fase 16 A: ca. 3,7 kW; 3-fase 16 A: ca. 11 kW; 3-fase 32 A: ca. 22 kW.',
      'Europese standaard: Type 2 voor AC, CCS2 voor DC.',
      'Snelladers: orde 50–350 kW, enkele hoger.',
      'Het laadvermogen wordt begrensd door de zwakste schakel: paal, kabel, boordlader of accu.'
    ],
    formules: [
      { formule: 'P = √3 × U × I (3-fase, U = 400 V)', betekenis: '√3 × 400 V × 16 A ≈ 11 kW.' },
      { formule: 'P = U × I (1-fase, U = 230 V)', betekenis: '230 V × 16 A ≈ 3,7 kW.' }
    ],
    vragen: [
      {
        vraag: 'Waar zit de AC/DC-omzetter bij snelladen (DC)?',
        opties: ['In de laadkabel', 'In de laadpaal', 'In de boordlader van de auto', 'In de elektromotor'],
        goed: 1,
        uitleg: 'Bij DC-laden staat de omzetter in de paal; de boordlader wordt overgeslagen.'
      },
      {
        vraag: 'Een auto met een 1-fase 7,4 kW-boordlader staat aan een 3-fase 22 kW-paal. Met welk vermogen laadt hij ongeveer?',
        opties: ['22 kW', '11 kW', '3,7 kW', '7,4 kW'],
        goed: 3,
        uitleg: 'De boordlader is de beperkende factor: één fase van 32 A × 230 V ≈ 7,4 kW.'
      },
      {
        vraag: 'Welke stekker is de Europese standaard voor DC-snelladen?',
        opties: ['CCS2', 'Type 1', 'Schuko', 'Type 2 zonder extra pinnen'],
        goed: 0,
        uitleg: 'CCS2 combineert de Type 2-stekker met twee DC-pinnen eronder.'
      }
    ]
  },
  {
    id: 'elektromotor-ev',
    categorie: 'elektrisch',
    titel: 'De elektromotor: synchroon en asynchroon',
    kern: 'Een elektromotor levert vol koppel vanaf stilstand over een breed toerengebied, daarom heeft een EV meestal maar één versnelling.',
    uitleg: [
      'In elke draaistroommotor maken drie spoelen in de stator samen een draaiend magneetveld. De vraag is hoe de rotor meegenomen wordt. Bij een permanente-magneet-synchroonmotor (PMSM) zitten er sterke neodymiummagneten in de rotor, die het veld exact synchroon volgen. Dit type is compact en heeft het hoogste rendement, vooral in deellast, en wordt in de meeste EV’s gebruikt.',
      'Bij een asynchrone motor (inductiemotor) is de rotor een kooi van koper- of aluminiumstaven. Het draaiveld induceert stroom in die staven, wat een eigen magneetveld oplevert. Daarvoor moet de rotor iets achterblijven bij het veld: slip, orde enkele procenten. Voordelen: geen zeldzame aardmetalen, robuust, en zonder stroom draait hij vrij mee zonder sleepverlies. Daarom gebruiken sommige vierwielaangedreven EV’s een inductiemotor op de as die vaak meeloopt. Een derde variant, de bekrachtigde synchroonmotor (EESM), wekt het rotorveld op met een spoel in plaats van magneten.',
      'Een elektromotor levert maximaal koppel vanaf 0 tpm tot een basistoerental, begrensd door de maximale stroom. Daarboven neemt het koppel af omdat de tegen-EMK (de spanning die de draaiende motor zelf opwekt) de accuspanning nadert: het vermogen blijft dan ongeveer constant. Omdat de motor tot 15.000–20.000 tpm kan draaien, volstaat één vaste reductie (orde 8–10:1) voor het hele snelheidsbereik.'
    ],
    feiten: [
      'Rendement van een EV-motor: orde 90–97% in het beste werkgebied.',
      'Inductiemotor: rotor draait een paar procent langzamer dan het veld (slip).',
      'Typische vaste reductie EV: ca. 8:1 tot 10:1.',
      'Sommige performance-EV’s hebben op de achteras toch een tweeversnellingsbak voor extra acceleratie en topsnelheid.'
    ],
    formules: [
      { formule: 'n_sync = 60 × f / p', betekenis: 'Synchroon toerental (tpm) bij frequentie f (Hz) en p poolparen.' },
      { formule: 'P = 2π × n × M', betekenis: 'Constant koppel tot het basistoerental; daarboven constant vermogen en dalend koppel.' }
    ],
    vragen: [
      {
        vraag: 'Waarom heeft een EV meestal geen versnellingsbak met meerdere versnellingen?',
        opties: [
          'Elektromotoren kunnen niet schakelen',
          'Het zou de accu overbelasten',
          'De motor levert koppel vanaf stilstand en draait tot zeer hoge toeren, dus één vaste reductie volstaat',
          'Het is wettelijk zo voorgeschreven'
        ],
        goed: 2,
        uitleg: 'Het brede toerengebied met vol koppel van onderaf maakt meerdere versnellingen grotendeels overbodig.'
      },
      {
        vraag: 'Wat is “slip” bij een asynchrone motor?',
        opties: [
          'Het doordraaien van de wielen',
          'Het verschil in toerental tussen draaiveld en rotor, nodig om stroom in de rotor te induceren',
          'Verlies door wrijving in de lagers',
          'Het verschil tussen accuspanning en motorspanning'
        ],
        goed: 1,
        uitleg: 'Zonder relatieve beweging tussen veld en rotorstaven wordt er geen stroom geïnduceerd en dus geen koppel geleverd.'
      },
      {
        vraag: 'Waarom kiezen fabrikanten soms een inductiemotor voor de tweede as van een 4×4-EV?',
        opties: [
          'Hij levert meer koppel dan een PMSM',
          'Hij heeft geen inverter nodig',
          'Hij werkt op wisselstroom uit het net',
          'Zonder bekrachtiging draait hij vrijwel zonder sleepverlies mee'
        ],
        goed: 3,
        uitleg: 'Een PMSM wekt door zijn magneten altijd tegen-EMK en ijzerverliezen op als hij meedraait; een inductiemotor niet.'
      }
    ]
  },
  {
    id: 'inverter-ev',
    categorie: 'elektrisch',
    titel: 'De inverter: van gelijkstroom naar draaiveld',
    kern: 'De inverter hakt de gelijkspanning van de accu in pulsen tot een driefasige wisselspanning met variabele frequentie en amplitude.',
    uitleg: [
      'De accu levert gelijkspanning, de motor wil driefasige wisselspanning. De inverter heeft daarvoor zes vermogensschakelaars (twee per fase), vroeger IGBT’s, steeds vaker siliciumcarbide-MOSFET’s (SiC). Ze schakelen met een frequentie van orde 10 kHz of meer de accuspanning aan en uit. Door de verhouding aan/uit (pulsbreedtemodulatie, PWM) continu te variëren ontstaat in de spoelen een stroom die een sinus benadert.',
      'De frequentie van die sinus bepaalt het toerental van het draaiveld, en dus van de motor. De amplitude (en fasehoek) bepaalt de stroom en dus het koppel. De inverter regelt dat met een snel regelalgoritme (veldgeoriënteerde regeling), op basis van een rotorpositiesensor en stroommeting, duizenden keren per seconde.',
      'SiC-schakelaars hebben lagere schakel- en geleidingsverliezen dan silicium-IGBT’s, vooral bij hoge spanning (800 V) en deellast. Dat scheelt enkele procenten verbruik. Bij regeneratief remmen werkt dezelfde inverter omgekeerd: hij richt de door de motor opgewekte wisselspanning gelijk en voedt de accu.'
    ],
    feiten: [
      'Een driefasige inverter heeft zes vermogensschakelaars (een “B6-brug”).',
      'Schakelfrequentie: orde 10–20 kHz; het hoge piepen van sommige EV’s bij wegrijden komt hiervan.',
      'Motorfrequentie bij 15.000 tpm en 4 poolparen: 1000 Hz.',
      'De inverter is ook de regenerator: dezelfde hardware, omgekeerde vermogensstroom.'
    ],
    formules: [
      { formule: 'f = n × p / 60', betekenis: 'Elektrische frequentie (Hz) bij toerental n (tpm) en p poolparen.' }
    ],
    vragen: [
      {
        vraag: 'Wat bepaalt in een EV het toerental van een synchrone motor?',
        opties: [
          'De accuspanning',
          'De frequentie van de wisselspanning die de inverter maakt',
          'De stroomsterkte',
          'De temperatuur van de motor'
        ],
        goed: 1,
        uitleg: 'Een synchrone motor draait precies mee met het draaiveld, waarvan de snelheid evenredig is met de frequentie.'
      },
      {
        vraag: 'Hoe maakt een inverter van gelijkspanning een sinusvormige stroom?',
        opties: [
          'Met een draaiende commutator',
          'Met een transformator',
          'Door met hoge frequentie aan/uit te schakelen met variërende pulsbreedte (PWM)',
          'Met een grote condensator die oplaadt en ontlaadt'
        ],
        goed: 2,
        uitleg: 'De inductantie van de motorwikkelingen vlakt de pulsen af tot een stroom die een sinus benadert.'
      },
      {
        vraag: 'Een PMSM met 4 poolparen draait 12.000 tpm. Welke elektrische frequentie levert de inverter?',
        opties: ['800 Hz', '200 Hz', '3000 Hz', '50 Hz'],
        goed: 0,
        uitleg: 'f = 12.000 × 4 / 60 = 800 Hz.'
      }
    ]
  },
  {
    id: 'regeneratief-remmen',
    categorie: 'elektrisch',
    titel: 'Regeneratief remmen en one-pedal driving',
    kern: 'Bij remmen werkt de elektromotor als generator: bewegingsenergie gaat terug de accu in in plaats van als warmte de remschijf in.',
    uitleg: [
      'Een draaiende elektromotor wekt altijd een spanning op (tegen-EMK). Laat de inverter stroom van de motor naar de accu lopen, dan werkt de motor als generator en ontstaat een remkoppel. Hoeveel er wordt teruggewonnen hangt af van de remkracht en hoeveel de accu kan opnemen: in de praktijk orde 0,1–0,3 g vertraging regeneratief, de rest is voor de wrijvingsremmen.',
      'Bij one-pedal driving remt de auto al stevig zodra je het gaspedaal loslaat, soms tot stilstand. In de stad gebruik je het rempedaal daardoor nauwelijks. Bij een blended systeem drukt het rempedaal eerst de regeneratieve rem in en schakelt het pas bij hardere vertraging de hydraulische remmen bij, zonder dat je de overgang voelt.',
      'Beperkingen: een volle accu (100%) of een koude accu kan weinig laadstroom opnemen, zodat de regeneratie dan zwakker is. En omdat de remschijven weinig worden gebruikt, kunnen ze gaan roesten; veel EV’s laten periodiek bewust de schijfremmen meewerken. De energieomzetting kost natuurlijk verliezen: van bewegingsenergie naar accu en weer terug naar beweging gaat grofweg 60–70% rond.'
    ],
    feiten: [
      'Kinetische energie: E = ½ m v². Een auto van 2000 kg bij 100 km/h heeft ca. 0,21 kWh aan bewegingsenergie.',
      'Bij een bijna volle accu regenereert de auto minder.',
      'Remlichten gaan ook aan bij flinke regeneratieve vertraging (wettelijk vereist boven een bepaalde vertraging).',
      'In de stad kan regeneratie een flink deel van de remenergie terugwinnen; op de snelweg is het effect klein.'
    ],
    formules: [
      { formule: 'E = ½ × m × v²', betekenis: '2000 kg bij 27,8 m/s (100 km/h): ca. 770 kJ ≈ 0,21 kWh.' }
    ],
    vragen: [
      {
        vraag: 'Waarom remt een EV met een 100% volle accu minder op de motor?',
        opties: [
          'De motor is dan te warm',
          'De inverter schakelt uit bij volle accu',
          'De remschijven nemen het automatisch over vanwege slijtage',
          'De accu kan geen laadstroom meer opnemen'
        ],
        goed: 3,
        uitleg: 'Regeneratief remmen is laden; een volle accu mag niet verder geladen worden.'
      },
      {
        vraag: 'Hoeveel bewegingsenergie heeft een auto van 2000 kg bij 100 km/h ongeveer?',
        opties: ['Ca. 0,2 kWh', 'Ca. 2 kWh', 'Ca. 20 kWh', 'Ca. 0,02 kWh'],
        goed: 0,
        uitleg: '½ × 2000 × 27,8² ≈ 770 kJ ≈ 0,21 kWh — weinig vergeleken met de accu, maar in de stad remt en trekt een auto heel vaak op.'
      },
      {
        vraag: 'Waarom laten sommige EV’s periodiek bewust de wrijvingsremmen meewerken?',
        opties: [
          'Om energie te besparen',
          'Om roest op de remschijven tegen te gaan, die weinig gebruikt worden',
          'Om de accu te koelen',
          'Om de banden op te warmen'
        ],
        goed: 1,
        uitleg: 'Bij veel regeneratie blijven de schijven onbelast en kunnen ze corroderen; even remmen houdt ze schoon.'
      }
    ]
  },
  {
    id: 'thermisch-management-ev',
    categorie: 'elektrisch',
    titel: 'Thermisch management en warmtepomp',
    kern: 'Een accu presteert het best rond kamertemperatuur; een warmtepomp verwarmt het interieur met een fractie van de energie van een weerstandsverwarming.',
    uitleg: [
      'Een verbrandingsmotor heeft warmte over: zo’n twee derde van de brandstofenergie verdwijnt als warmte, dus verwarming is gratis. Een EV heeft die luxe niet. Een gewone weerstandsverwarming (PTC) zet 1 kWh stroom om in 1 kWh warmte; in de winter kan dat op korte ritten het verbruik met tientallen procenten verhogen.',
      'Een warmtepomp werkt als een omgekeerde koelkast: een koelmiddel verdampt en neemt daarbij warmte op uit de buitenlucht (ook bij 0 °C zit daar warmte in), een compressor perst het samen waardoor het heet wordt, en in de condensor geeft het die warmte af aan het interieur. Je verplaatst warmte in plaats van haar te maken. De COP (coefficient of performance) is orde 2–3: per kWh stroom 2–3 kWh warmte. Veel systemen halen ook restwarmte uit de accu, inverter en motor.',
      'De accu zelf heeft een vloeistofcircuit. Te koud: hogere inwendige weerstand, weinig vermogen, langzaam laden en kans op lithium plating. Te warm (boven ca. 40–45 °C): snellere veroudering. Daarom koelt de auto de accu actief bij snelladen en hard rijden, en verwarmt hij hem voor (preconditioning) als je naar een snellader rijdt of een vertrektijd instelt terwijl de auto aan de stekker hangt.'
    ],
    feiten: [
      'COP van een auto-warmtepomp: orde 2–3, lager bij strenge vorst.',
      'Optimale accutemperatuur: grofweg 20–40 °C.',
      'Voorverwarmen aan de stekker spaart de accu: de energie komt dan uit het net.',
      'Winterbereik van een EV is typisch orde 15–30% lager dan in de zomer.'
    ],
    formules: [
      { formule: 'COP = Q_warmte / W_elektrisch', betekenis: 'Hoeveel warmte (kWh) je krijgt per kWh elektriciteit.' }
    ],
    vragen: [
      {
        vraag: 'Waarom is een warmtepomp efficiënter dan een weerstandsverwarming?',
        opties: [
          'Hij verplaatst warmte uit de buitenlucht naar binnen in plaats van haar uit stroom te maken',
          'Hij gebruikt brandstof',
          'Hij werkt alleen als de accu warm is',
          'Hij heeft een hoger vermogen'
        ],
        goed: 0,
        uitleg: 'De compressor kost energie, maar verplaatst 2–3 keer zoveel warmte.'
      },
      {
        vraag: 'Waarom laadt een EV na een koude nacht langzaam aan een snellader?',
        opties: [
          'De laadpaal levert minder in de kou',
          'De kabel is stijf',
          'Een koude accu kan lithiumionen niet snel genoeg opnemen; het BMS begrenst de stroom',
          'De warmtepomp gebruikt al het vermogen'
        ],
        goed: 2,
        uitleg: 'Bij lage temperatuur stijgt de inwendige weerstand en dreigt lithium plating; voorverwarmen lost dit grotendeels op.'
      },
      {
        vraag: 'Een warmtepomp met COP 2,5 levert 5 kW warmte. Hoeveel elektrisch vermogen gebruikt hij?',
        opties: ['12,5 kW', '5 kW', '2,5 kW', '2 kW'],
        goed: 3,
        uitleg: '5 / 2,5 = 2 kW elektrisch.'
      }
    ]
  },
  {
    id: 'accu-degradatie',
    categorie: 'elektrisch',
    titel: 'Accudegradatie en levensduur',
    kern: 'Een accu verliest capaciteit door tijd (kalenderveroudering) en gebruik (cycli); warmte, hoge laadtoestand en snelladen versnellen dat.',
    uitleg: [
      'Kalenderveroudering gebeurt ook als de auto stilstaat. Op de anode groeit langzaam een laagje (de SEI, solid electrolyte interphase) dat lithium vastlegt dat dan niet meer meedoet. Dat gaat sneller bij hoge temperatuur en bij een hoge laadtoestand (hoge celspanning). Een auto die maanden op 100% in de zon staat, veroudert dus sneller dan een die op 50% in een koele garage staat.',
      'Cyclische veroudering komt door het laden en ontladen zelf: de elektrodematerialen zetten uit en krimpen, er ontstaan microscheurtjes en de SEI groeit bij. Diepe cycli (0–100%) belasten meer dan ondiepe (30–70%). Veel snelladen bij hoge stroom en warmte versnelt het ook, al is het effect bij moderne auto’s met goed thermisch management kleiner dan vaak gedacht.',
      'In de praktijk zie je vaak in de eerste jaren een snellere daling van een paar procent, en daarna een langzame, vrijwel lineaire daling. Veel EV’s hebben na 200.000 km nog orde 85–90% van hun oorspronkelijke capaciteit. Fabrikanten geven meestal 8 jaar of 160.000 km garantie op minimaal ca. 70% capaciteit. Een accu met 70–80% is voor de auto “op”, maar kan nog jaren mee als stationaire opslag (second life).'
    ],
    feiten: [
      'Gangbare garantie: 8 jaar / 160.000 km op ca. 70% capaciteit (verschilt per merk).',
      'SoH (state of health) = huidige capaciteit / nieuwe capaciteit.',
      'Verouderingssnelheid ruwweg verdubbelt per ca. 10 °C temperatuurstijging (vuistregel uit de chemie).',
      'Een accu wordt na zijn autoleven vaak hergebruikt of gerecycled; lithium, nikkel en kobalt zijn grotendeels terug te winnen.'
    ],
    vragen: [
      {
        vraag: 'Welke omstandigheid versnelt kalenderveroudering het meest?',
        opties: [
          'Lang stilstaan op 50% in een koele garage',
          'Lang stilstaan op 100% in de hitte',
          'Dagelijks 30 km rijden',
          'Regeneratief remmen'
        ],
        goed: 1,
        uitleg: 'Hoge temperatuur en hoge celspanning versnellen de nevenreacties zoals SEI-groei.'
      },
      {
        vraag: 'Wat is de SEI?',
        opties: [
          'Het batterijmanagementsysteem',
          'Een veiligheidsrelais in het accupack',
          'Een laagje op de anode dat lithium vastlegt en langzaam groeit',
          'De koelplaat onder de cellen'
        ],
        goed: 2,
        uitleg: 'De solid electrolyte interphase is noodzakelijk voor stabiliteit, maar groeit met de tijd en kost capaciteit.'
      },
      {
        vraag: 'Wat is een realistische capaciteit na 200.000 km voor een moderne EV met goed thermisch management?',
        opties: ['Ca. 40%', 'Ca. 60%', 'Precies 100%', 'Ca. 85–90%'],
        goed: 3,
        uitleg: 'Praktijkdata laten meestal een beperkte degradatie zien; grote uitschieters zijn uitzonderingen.'
      }
    ]
  },
  {
    id: 'waterstof-brandstofcel',
    categorie: 'elektrisch',
    titel: 'Waterstof en de brandstofcel',
    kern: 'Een brandstofcelauto is een elektrische auto die zijn stroom zelf maakt uit waterstof; de hele keten kost echter veel meer energie dan een accu.',
    uitleg: [
      'In een PEM-brandstofcel wordt waterstof aan de anode gesplitst in protonen en elektronen. De protonen gaan door een membraan, de elektronen via het externe circuit (de motor) naar de kathode, waar ze met zuurstof uit de lucht en de protonen water vormen. Uit de uitlaat komt dus alleen waterdamp. Een buffer-accu vangt pieken en regeneratieve remenergie op.',
      'Waterstof is per kilo zeer energierijk (ca. 33 kWh/kg), maar per liter heel ijl. Daarom wordt het in koolstofvezeltanks onder 700 bar opgeslagen. Een auto als de Toyota Mirai heeft ruim 5 kg aan boord en verbruikt orde 1 kg per 100 km. Tanken duurt een paar minuten, wat het grote voordeel is.',
      'Het nadeel zit in de keten. Groene waterstof maken met elektrolyse kost ca. 30% van de stroom; comprimeren tot 700 bar en transporteren nog eens 10–15%; de brandstofcel zet maar orde 50–60% om in elektriciteit. Van de oorspronkelijke stroom komt zo grofweg 25–35% bij de wielen. Een batterij-EV haalt zo’n 70–80% (laadverliezen, accu, motor). Voor dezelfde afstand is met waterstof dus ruwweg 2 à 3 keer zoveel duurzame stroom nodig.',
      'Waar waterstof wél kansrijk is: toepassingen waar accu’s te zwaar worden of laden te lang duurt, zoals zware industrie, mogelijk scheepvaart (eventueel als ammoniak of methanol) en sommige vrachttoepassingen. Bovendien wordt het meeste waterstof nu nog uit aardgas gemaakt (grijze waterstof), met CO₂-uitstoot.'
    ],
    feiten: [
      'Tankdruk personenauto: 700 bar; bussen en vrachtwagens vaak 350 bar.',
      'Verbruik personenauto: orde 1 kg H₂ per 100 km.',
      'Well-to-wheel: waterstof-EV ca. 25–35%, batterij-EV ca. 70–80%.',
      'Energie-inhoud waterstof: ca. 33 kWh/kg (onderste verbrandingswaarde).'
    ],
    vragen: [
      {
        vraag: 'Wat komt er uit de uitlaat van een brandstofcelauto?',
        opties: ['CO₂ en water', 'Waterstof', 'Waterdamp', 'Stikstofoxiden'],
        goed: 2,
        uitleg: 'Waterstof en zuurstof reageren tot water; er is geen verbranding, dus ook geen NOx.'
      },
      {
        vraag: 'Waarom wordt waterstof in een auto onder 700 bar opgeslagen?',
        opties: [
          'Omdat de brandstofcel die druk nodig heeft',
          'Omdat waterstof per volume zeer ijl is; hoge druk is nodig om genoeg mee te nemen',
          'Om het veiliger te maken',
          'Om het vloeibaar te maken'
        ],
        goed: 1,
        uitleg: 'Per kilo is waterstof energierijk, per liter niet. Vloeibaar maken vraagt −253 °C; 700 bar gas is het gangbare compromis.'
      },
      {
        vraag: 'Hoeveel duurzame stroom kost een waterstofauto grofweg vergeleken met een batterij-EV voor dezelfde afstand?',
        opties: ['Ongeveer evenveel', 'De helft', 'Tien keer zoveel', 'Twee à drie keer zoveel'],
        goed: 3,
        uitleg: 'Elektrolyse, compressie en de brandstofcel stapelen verliezen op: ca. 30% versus ca. 75% ketenrendement.'
      }
    ]
  },
  {
    id: 'verbruik-rendement-ev',
    categorie: 'elektrisch',
    titel: 'Verbruik en rendement: kWh/100 km',
    kern: 'Een EV verbruikt typisch 15–20 kWh/100 km; een benzineauto met 6 l/100 km verbruikt omgerekend ruim 50 kWh.',
    uitleg: [
      'Een verbrandingsmotor zet in de praktijk maar zo’n 20–30% van de brandstofenergie om in beweging (de piek ligt hoger, maar je rijdt zelden in het optimale werkpunt). De rest is warmte. Een EV zet van accu tot wiel orde 85–90% om. Daarom heeft een EV veel minder energie nodig, ook al moet hij dezelfde rol- en luchtweerstand overwinnen.',
      'Een liter benzine bevat ca. 9 kWh. 6 l/100 km is dus ca. 54 kWh/100 km; een EV doet het met 15–20 kWh/100 km, ruwweg drie keer minder. Inclusief laadverliezen (orde 10%) blijft dat verschil groot.',
      'Op de snelweg stijgt het EV-verbruik flink, omdat luchtweerstand met het kwadraat van de snelheid groeit (en het benodigde vermogen met de derde macht). Van 100 naar 130 km/h kan het verbruik met zo’n 30–40% stijgen. In de stad is een EV juist zuinig: geen stationair verbruik en terugwinning bij remmen. Bij een verbrandingsmotor is dat precies omgekeerd: de stad is het minst efficiënt.'
    ],
    feiten: [
      '1 liter benzine ≈ 8,9 kWh; 1 liter diesel ≈ 9,9 kWh.',
      'Luchtweerstandskracht: F = ½ × ρ × c_w × A × v².',
      'Benodigd vermogen voor luchtweerstand groeit met v³.',
      'Typische EV-cw-waarden: 0,20–0,30; frontaal oppervlak orde 2,2–2,6 m².'
    ],
    formules: [
      { formule: 'F_lucht = ½ × ρ × c_w × A × v²', betekenis: 'ρ ≈ 1,2 kg/m³ (lucht), c_w = luchtweerstandscoëfficiënt, A = frontaal oppervlak.' },
      { formule: 'P_lucht = F_lucht × v ∝ v³', betekenis: 'Twee keer zo snel kost acht keer zoveel vermogen voor de luchtweerstand.' }
    ],
    vragen: [
      {
        vraag: 'Een benzineauto verbruikt 6 l/100 km. Hoeveel kWh/100 km is dat ongeveer?',
        opties: ['Ca. 54 kWh', 'Ca. 6 kWh', 'Ca. 18 kWh', 'Ca. 120 kWh'],
        goed: 0,
        uitleg: '6 × ca. 9 kWh = ca. 54 kWh/100 km, ongeveer drie keer zoveel als een EV.'
      },
      {
        vraag: 'Waarom is een EV in de stad relatief zuiniger dan op de snelweg?',
        opties: [
          'De accu werkt beter bij lage snelheid',
          'In de stad is de luchtweerstand klein en wint de auto remenergie terug',
          'Omdat de inverter in de stad uit staat',
          'Omdat de banden dan minder rolweerstand hebben'
        ],
        goed: 1,
        uitleg: 'Luchtweerstand groeit kwadratisch met snelheid; in de stad domineert juist remmen en optrekken, wat een EV deels terugwint.'
      },
      {
        vraag: 'Je rijdt 2 keer zo snel. Hoeveel meer vermogen is nodig voor alleen de luchtweerstand?',
        opties: ['2 keer', '4 keer', '6 keer', '8 keer'],
        goed: 3,
        uitleg: 'P = F × v en F ∝ v², dus P ∝ v³: 2³ = 8.'
      }
    ]
  },
  // ───────────────────────────── TREIN ─────────────────────────────
  {
    id: 'tractie-stroomvoorziening-nl',
    categorie: 'trein',
    titel: 'Stroomvoorziening: 1500 V en 25 kV',
    kern: 'Het Nederlandse hoofdnet rijdt op 1500 V gelijkspanning; HSL-Zuid en Betuweroute op 25 kV wisselspanning.',
    uitleg: [
      'Vrijwel het hele Nederlandse spoornet is geëlektrificeerd met 1500 V gelijkspanning (DC), een keuze uit de jaren twintig en dertig. De trein neemt stroom af van de bovenleiding met een stroomafnemer (pantograaf) en de stroom keert terug via de wielen en de spoorstaven. Onderstations langs de lijn zetten de wisselspanning van het hoogspanningsnet om in 1500 V DC.',
      'Het nadeel van een lage spanning: voor hetzelfde vermogen is de stroom hoog. Een intercity die enkele megawatts trekt, haalt duizenden ampères uit de draad. Dat vraagt dikke koperen rijdraden, onderstations om de paar kilometer, en het geeft spanningsval bij veel treinen tegelijk. Daarom kunnen niet onbeperkt meer of snellere treinen op het bestaande net worden ingezet zonder de energievoorziening te versterken. Een omschakeling naar een hogere spanning is onderzocht, maar zeer ingrijpend.',
      'De HSL-Zuid (Amsterdam/Schiphol–Rotterdam–Belgische grens) en de Betuweroute (goederenlijn Rotterdam–Duitse grens) rijden op 25 kV 50 Hz wisselspanning, de Europese standaard voor nieuwe lijnen. Bij 25 kV is de stroom vele malen lager, dus lichtere bovenleiding en onderstations op tientallen kilometers. Treinen die op beide netten rijden moeten meerspanningsmaterieel zijn, en bij de overgang zit een spanningssluis: een stuk ongevoede draad waar de trein met neergelaten of stroomloze pantograaf overheen rolt.'
    ],
    feiten: [
      'NL hoofdnet: 1500 V DC. HSL-Zuid en Betuweroute: 25 kV 50 Hz AC.',
      'België gebruikt op het klassieke net 3 kV DC; Duitsland 15 kV 16,7 Hz AC.',
      'Een trein van 4 MW bij 1500 V trekt orde 2700 A; bij 25 kV slechts ca. 160 A.',
      'De retourstroom gaat via de spoorstaven; die zijn ook onderdeel van de detectie (spoorstroomkringen).'
    ],
    formules: [
      { formule: 'I = P / U', betekenis: 'Stroom = vermogen / spanning. Lagere spanning betekent veel hogere stroom en meer verliezen (I²R).' }
    ],
    letOp: 'Bovenleiding staat altijd onder spanning, ook als er geen trein rijdt. Bij 25 kV kan een vlamboog al ontstaan zonder aanraking.',
    vragen: [
      {
        vraag: 'Welke spanning heeft het Nederlandse hoofdspoornet?',
        opties: ['25 kV wisselspanning', '15 kV 16,7 Hz', '3000 V gelijkspanning', '1500 V gelijkspanning'],
        goed: 3,
        uitleg: 'Het klassieke NL-net rijdt op 1500 V DC; alleen nieuwere lijnen als de HSL-Zuid en de Betuweroute op 25 kV AC.'
      },
      {
        vraag: 'Waarom zijn er bij 1500 V veel meer onderstations nodig dan bij 25 kV?',
        opties: [
          'Bij lage spanning is de stroom hoog, waardoor spanningsval en verliezen over afstand groot zijn',
          'Omdat gelijkspanning niet over koperdraad kan',
          'Omdat 1500 V gevaarlijker is',
          'Omdat de pantograaf het anders niet aankan'
        ],
        goed: 0,
        uitleg: 'Hoge stroom door een draad met weerstand geeft veel spanningsval; dus moet je vaak bijvoeden.'
      },
      {
        vraag: 'Welke Nederlandse lijnen rijden op 25 kV?',
        opties: [
          'Amsterdam–Utrecht en Utrecht–Arnhem',
          'Alle intercitylijnen',
          'De HSL-Zuid en de Betuweroute',
          'Alleen de lijnen in Noord-Nederland'
        ],
        goed: 2,
        uitleg: 'Deze nieuwe lijnen volgden de Europese standaard voor nieuwbouw.'
      }
    ]
  },
  {
    id: 'remweg-adhesie-trein',
    categorie: 'trein',
    titel: 'Waarom een trein zo lang remt',
    kern: 'Staal op staal heeft weinig grip; een trein met honderden tonnen massa heeft daardoor honderden meters tot meer dan een kilometer remweg.',
    uitleg: [
      'De maximale rem- of trekkracht van een wiel is de wrijvingscoëfficiënt (adhesie) maal het gewicht op dat wiel. Een autoband op droog asfalt haalt orde 0,8–1,0. Staal op staal haalt onder goede omstandigheden maar orde 0,2–0,3, en bij nat spoor met vervuiling veel minder. Dat is precies het voordeel van spoor (zeer lage rolweerstand) én het nadeel (lage grip).',
      'Daarom is de remvertraging van een reizigerstrein bij een normale bedrijfsremming slechts orde 0,7–1 m/s², een noodremming iets meer. Een auto haalt 8–10 m/s². Een intercity met 140 km/h heeft zo een remweg van grofweg een kilometer; een zware goederentrein nog veel meer. Zien en stoppen is dus uitgesloten: de machinist moet al ver van tevoren weten dat er gestopt moet worden. Dat is de hele reden voor seinen en treinbeïnvloeding.',
      'In de herfst vormen geplette bladeren een glibberige laag op de spoorstaaf, die de adhesie extreem verlaagt. Treinen strooien dan zand vóór de wielen, en ProRail zet railreinigingstreinen en spoorstaafconditionering in. Bovendien rijden machinisten defensiever. Wielen die blokkeren krijgen een platte plek (vlakke plek) met het bekende kloppende geluid; moderne treinen hebben daarom antislipregeling, vergelijkbaar met ABS. Elektrische treinen remmen bovendien elektrisch (de motor als generator) en kunnen energie terugleveren aan de bovenleiding.'
    ],
    feiten: [
      'Adhesie staal-staal: orde 0,1–0,3; rubber-asfalt droog: orde 0,8–1,0.',
      'Remweg intercity vanaf 140 km/h: orde 800–1200 m.',
      'Zware goederentrein: remweg kan ruim boven 1 km liggen.',
      'Een trein heeft naast wielremmen soms een magneetrailrem die direct op de spoorstaaf werkt (noodremming).'
    ],
    formules: [
      { formule: 'F_max = μ × m × g', betekenis: 'Maximale remkracht via de wielen; μ is de adhesiecoëfficiënt.' },
      { formule: 's = v² / (2a)', betekenis: 'Bij 140 km/h (38,9 m/s) en a = 0,7 m/s²: ca. 1080 m.' }
    ],
    vragen: [
      {
        vraag: 'Wat is de belangrijkste reden dat een trein zo lang remt?',
        opties: [
          'De remmen zijn bewust zwak afgesteld voor comfort',
          'Treinen hebben geen schijfremmen',
          'De lage wrijving tussen stalen wiel en stalen rail beperkt de remkracht',
          'Treinen rijden altijd sneller dan auto’s'
        ],
        goed: 2,
        uitleg: 'Ongeacht hoe sterk de remmen zijn: meer dan μ × gewicht kan het wiel niet op de rail overbrengen zonder te slippen.'
      },
      {
        vraag: 'Waarom strooien treinen in de herfst zand?',
        opties: [
          'Om de adhesie op een door bladeren glibberige spoorstaaf te verhogen',
          'Om de wielen te koelen',
          'Om ijs te smelten',
          'Om de bovenleiding te ontlasten'
        ],
        goed: 0,
        uitleg: 'Zand tussen wiel en rail verhoogt de wrijving bij optrekken en remmen.'
      },
      {
        vraag: 'Een trein remt met 0,8 m/s² vanaf 144 km/h (40 m/s). Wat is ongeveer de remweg?',
        opties: ['Ca. 200 m', 'Ca. 500 m', 'Ca. 2000 m', 'Ca. 1000 m'],
        goed: 3,
        uitleg: 's = 40² / (2 × 0,8) = 1600 / 1,6 = 1000 m.'
      }
    ]
  },
  {
    id: 'conische-wielen',
    categorie: 'trein',
    titel: 'Conische wielen en het wiel-railcontact',
    kern: 'Treinwielen zijn licht kegelvormig; in een bocht rolt het buitenwiel op een grotere diameter en stuurt het wielstel zichzelf.',
    uitleg: [
      'Twee treinwielen zitten star op één as: ze draaien altijd even snel. Er is geen differentieel. In een bocht moet het buitenwiel echter een langere weg afleggen. De oplossing is de vorm van het loopvlak: het wiel is licht conisch, aan de binnenkant (bij de flens) dikker dan aan de buitenkant. In een bocht schuift het wielstel door de middelpuntvliedende kracht een paar millimeter naar buiten. Het buitenwiel loopt dan op een grotere diameter, het binnenwiel op een kleinere, en het verschil in afgelegde weg is opgelost.',
      'Hetzelfde principe zorgt voor zelfcentrering op recht spoor: schuift het wielstel opzij, dan loopt één wiel op een grotere diameter, gaat het voor, en stuurt het wielstel terug. Het gevolg is een golvende beweging, de sinusloop. Bij te hoge snelheid of versleten wielprofielen kan die instabiel worden (slingeren); draaistellen met de juiste stijfheid en dempers houden dat onder controle.',
      'De flens is dus níét wat de trein normaal stuurt; hij is een vangnet. Alleen in krappe bogen en wissels loopt de flens tegen de spoorstaaf aan, met het bekende piepen. Daarnaast liggen spoorstaven in bogen met verkanting: de buitenste rail ligt hoger, zodat reizigers minder zijwaartse kracht voelen. De Nederlandse (en meeste Europese) spoorwijdte is 1435 mm, normaalspoor.'
    ],
    feiten: [
      'Spoorwijdte NL: 1435 mm (normaalspoor).',
      'Typische conusvorm van het loopvlak: orde 1:20 tot 1:40.',
      'Het contactvlak tussen wiel en rail is ongeveer zo groot als een muntstuk van 1 euro of kleiner.',
      'Ook spoorstaven staan iets naar binnen gekanteld (orde 1:40) om bij de wielconus te passen.'
    ],
    vragen: [
      {
        vraag: 'Hoe neemt een treinwielstel zonder differentieel een bocht?',
        opties: [
          'Het buitenwiel slipt altijd een beetje',
          'De flens duwt de wielen door de bocht',
          'Door de conische wielen rolt het buitenwiel op een grotere diameter dan het binnenwiel',
          'De wielen zitten los op de as'
        ],
        goed: 2,
        uitleg: 'Een kleine zijwaartse verschuiving geeft een verschil in rolstraal; zo leggen beide wielen een verschillende afstand af bij hetzelfde toerental.'
      },
      {
        vraag: 'Wat is de rol van de wielflens?',
        opties: [
          'Een vangnet tegen ontsporen in krappe bogen en wissels; bij normaal rijden raakt hij de rail meestal niet',
          'De trein in elke bocht sturen',
          'Remkracht overbrengen',
          'Stroom geleiden naar de rail'
        ],
        goed: 0,
        uitleg: 'Het conische loopvlak doet het stuurwerk; de flens is een veiligheidsgrens.'
      },
      {
        vraag: 'Wat is de spoorwijdte in Nederland?',
        opties: ['1000 mm', '1520 mm', '1668 mm', '1435 mm'],
        goed: 3,
        uitleg: 'Nederland gebruikt normaalspoor van 1435 mm, net als de meeste Europese landen.'
      }
    ]
  },
  {
    id: 'blokstelsel-seinen',
    categorie: 'trein',
    titel: 'Blokstelsel en seinen',
    kern: 'Het spoor is verdeeld in blokken waarin maar één trein mag zijn; seinen tonen of het volgende blok vrij is.',
    uitleg: [
      'Omdat een trein niet op zicht kan stoppen, wordt het spoor verdeeld in blokken, stukken van honderden meters tot enkele kilometers. In één blok mag maar één trein zijn. Detectie gebeurt met spoorstroomkringen (een spanning tussen beide spoorstaven die door de wielassen wordt kortgesloten) of met assentellers. Is een blok bezet, dan toont het sein ervoor rood.',
      'Het sein ervóór toont dan geel: een waarschuwing dat het volgende sein rood kan zijn, zodat de machinist tijdig kan afremmen. Bij groen mag de trein met de toegestane baanvaksnelheid door. Omdat een remweg langer kan zijn dan één blok, kijkt het systeem twee of meer blokken vooruit. De lengte van de blokken en de snelheid bepalen samen de capaciteit: kortere blokken betekenen dat treinen dichter op elkaar kunnen rijden.',
      'Nederlandse seinen tonen ook snelheidsbeperkingen, bijvoorbeeld voor een wissel dat in de afbuigende stand ligt. Dat gebeurt met knipperende seinbeelden en met cijferbakken: een verlicht cijfer maal 10 geeft de snelheid in km/h. Een geel cijfer kondigt de beperking aan die bij het volgende sein ingaat; de precieze betekenis van elke combinatie staat in de seinenregelgeving en vergt een eigen studie.'
    ],
    feiten: [
      'Rood: stop vóór het sein. Geel: snelheid verminderen; het volgende sein toont mogelijk stop. Groen: doorrijden met de toegestane snelheid.',
      'Cijfer op een snelheidsaanwijzer × 10 = snelheid in km/h.',
      'Detectie via spoorstroomkringen of assentellers.',
      'Een stoptonend sein passeren zonder toestemming heet een STS-passage (roodsein-passage).'
    ],
    vragen: [
      {
        vraag: 'Wat is het basisprincipe van het blokstelsel?',
        opties: [
          'Treinen rijden op zicht en houden afstand',
          'In elk blok mag maar één trein tegelijk zijn',
          'Elke trein krijgt een vast tijdslot per station',
          'Treinen communiceren onderling hun positie'
        ],
        goed: 1,
        uitleg: 'Een bezet blok wordt beschermd door een rood sein ervoor; zo kan een volgende trein nooit in hetzelfde blok rijden.'
      },
      {
        vraag: 'Een machinist ziet een geel sein. Wat betekent dat in hoofdlijnen?',
        opties: [
          'Afremmen: het volgende sein toont mogelijk stop',
          'Stoppen voor dit sein',
          'Doorrijden met maximale snelheid',
          'Het sein is defect'
        ],
        goed: 0,
        uitleg: 'Geel is een voorwaarschuwing zodat de trein bij het volgende sein, als dat rood toont, tijdig stilstaat.'
      },
      {
        vraag: 'Hoe detecteert een spoorstroomkring dat er een trein in een blok staat?',
        opties: [
          'Met een camera',
          'Door het gewicht op de rails te meten',
          'Via radiosignalen van de trein',
          'De wielassen sluiten de spanning tussen beide spoorstaven kort'
        ],
        goed: 3,
        uitleg: 'Een stalen wielas geleidt tussen de twee rails; het relais van de kring valt af en het blok is bezet.'
      },
      {
        vraag: 'Een snelheidsaanwijzer toont het cijfer 6. Om welke snelheid gaat het?',
        opties: ['6 km/h', '36 km/h', '60 km/h', '160 km/h'],
        goed: 2,
        uitleg: 'Het getoonde cijfer maal 10 geeft de snelheid in km/h.'
      }
    ]
  },
  {
    id: 'atb-ertms',
    categorie: 'trein',
    titel: 'ATB en ERTMS/ETCS',
    kern: 'Treinbeïnvloeding grijpt in als de machinist te hard rijdt of een rood sein dreigt te passeren; ERTMS brengt het sein de cabine in.',
    uitleg: [
      'ATB (automatische treinbeïnvloeding) bestaat in Nederland sinds de jaren vijftig/zestig. Bij ATB-EG (eerste generatie) zendt het spoor via de spoorstroomkringen codes uit die overeenkomen met een toegestane snelheid. De trein vangt die met antennes vóór de eerste as op, toont ze in de cabine en remt automatisch als de machinist niet tijdig reageert. Belangrijke beperking: ATB-EG grijpt pas in boven 40 km/h, en kon dus een roodsein-passage bij lage snelheid niet voorkomen.',
      'Na een aantal ernstige roodsein-passages is ATB-Vv (verbeterde versie) ingevoerd: bij risicovolle seinen ligt een extra lus die ook bij lage snelheid de trein laat stoppen als die het rode sein dreigt te passeren. ATB-NG (nieuwe generatie) werkt met bakens en is op een beperkt deel van het net toegepast.',
      'ERTMS is het Europese systeem; het treinbeveiligingsdeel heet ETCS. Bij Level 1 geven balises (bakens tussen de rails) informatie door die bij seinen hoort. Bij Level 2 communiceert de trein via GSM-R-radio continu met een centrale (RBC), die een rijtoestemming (movement authority) geeft: tot waar de trein mag rijden en hoe hard. De machinist ziet dat op een scherm in de cabine (cabinesignalering); seinen langs de baan zijn in principe niet meer nodig. Balises dienen dan vooral als vaste positiereferentie.',
      'Voordelen van ERTMS: één standaard in Europa (geen aparte systemen per land), continue bewaking van remcurves, en uiteindelijk meer capaciteit. In Nederland rijden onder meer de HSL-Zuid, de Betuweroute en de Hanzelijn al met ERTMS; ProRail rolt het in de komende jaren gefaseerd uit over het hele net.'
    ],
    feiten: [
      'ATB-EG grijpt in boven 40 km/h; ATB-Vv voegt bescherming bij lage snelheid toe op risicovolle seinen.',
      'ETCS Level 2: radio (GSM-R) + Radio Block Centre; cabinesignalering.',
      'Een balise is een passief baken tussen de rails dat bij overrijden door de trein van energie wordt voorzien en een telegram terugstuurt.',
      'ERTMS = ERTMS/ETCS (beveiliging) + GSM-R (communicatie), en in toekomst FRMCS als opvolger van GSM-R.'
    ],
    vragen: [
      {
        vraag: 'Wat is een bekende beperking van ATB-EG?',
        opties: [
          'Het werkt alleen op 25 kV-lijnen',
          'Het grijpt pas in boven 40 km/h en voorkomt dus niet elke roodsein-passage bij lage snelheid',
          'Het werkt alleen bij daglicht',
          'Het kan de trein niet laten remmen, alleen waarschuwen'
        ],
        goed: 1,
        uitleg: 'Daarvoor is ATB-Vv toegevoegd, dat bij gevaarlijke seinen ook bij lage snelheid ingrijpt.'
      },
      {
        vraag: 'Wat is kenmerkend voor ETCS Level 2?',
        opties: [
          'De machinist rijdt op zicht',
          'Alle informatie komt alleen van seinen langs het spoor',
          'Treinen communiceren rechtstreeks met elkaar',
          'De trein krijgt via radio een rijtoestemming en de machinist ziet die in de cabine'
        ],
        goed: 3,
        uitleg: 'Een Radio Block Centre verstrekt via GSM-R movement authorities; seinen langs de baan zijn niet meer nodig.'
      },
      {
        vraag: 'Wat is een balise?',
        opties: [
          'Een baken tussen de rails dat informatie doorgeeft aan de passerende trein',
          'Een sein met cijferbak',
          'De stroomafnemer op het dak',
          'Een antenne voor GSM-R'
        ],
        goed: 0,
        uitleg: 'Balises zijn passief; de trein voedt ze draadloos bij het overrijden en ontvangt een telegram met o.a. positie-informatie.'
      }
    ]
  },
  {
    id: 'wissels-overwegen',
    categorie: 'trein',
    titel: 'Wissels en overwegen',
    kern: 'Een wissel leidt treinen met bewegende tongen naar een ander spoor; een overweg beveiligt de kruising met de weg, automatisch gekoppeld aan de detectie.',
    uitleg: [
      'Een wissel bestaat uit twee beweegbare tongen, een vast puntstuk (het hart) waar twee spoorstaven elkaar kruisen, en geleidingsrails tegenover het hart die het wielstel daar in het juiste spoor houden. Een elektrische wisselaandrijving verplaatst de tongen en vergrendelt ze; de beveiliging staat pas een groen sein toe als het wissel bevestigd in de juiste stand ligt. Een wissel in afbuigende stand heeft een snelheidsbeperking, vaak 40 km/h of hoger bij lange, slanke wissels.',
      'Wissels zijn storingsgevoelig: sneeuw of ijs tussen tong en spoorstaaf verhindert dat het wissel goed sluit, en dan kan het niet worden vergrendeld. Daarom hebben veel wissels elektrische wisselverwarming. Een wissel dat niet in een eindstand komt, geeft een wisselstoring: het sein blijft rood.',
      'Een overweg is een gelijkvloerse kruising van spoor en weg. In Nederland is de AHOB (automatische halve overwegbomen) het meest voorkomende beveiligde type: knipperlichten en bellen, en halve bomen die alleen de rijbaan aan de inrijzijde afsluiten, zodat niemand ingesloten raakt. De overweg wordt automatisch ingeschakeld als een trein een inschakelpunt op ruime afstand passeert, zodat er voor de snelste trein voldoende tijd is voordat hij de overweg bereikt. Daarnaast bestaan onder meer AKI’s (knipperlichten zonder bomen) en onbeveiligde overwegen.'
    ],
    feiten: [
      'Onderdelen van een wissel: tongen, puntstuk (hart), geleidingsrails, wisselaandrijving.',
      'Een sein toont pas een rijweg als alle wissels gecontroleerd in de goede stand liggen en vergrendeld zijn (rijwegvergrendeling).',
      'AHOB = automatische halve overwegbomen.',
      'Bij een bezette overweg (auto op het spoor): verlaat het voertuig en bel het noodnummer op het overwegkastje of 112.'
    ],
    letOp: 'Als de bellen gaan, nooit meer de overweg op; de trein kan niet uitwijken en heeft een remweg van honderden meters.',
    vragen: [
      {
        vraag: 'Wat zijn de tongen van een wissel?',
        opties: [
          'De vaste kruising van twee spoorstaven',
          'De beweegbare spoorstaafdelen die bepalen welke kant de trein op gaat',
          'De verwarmingselementen',
          'De geleidingsrails tegenover het hart'
        ],
        goed: 1,
        uitleg: 'De tongen worden door de wisselaandrijving tegen de ene of de andere stamspoorstaaf gelegd.'
      },
      {
        vraag: 'Waarom sluiten halve overwegbomen maar de helft van de weg af?',
        opties: [
          'Uit kostenoverwegingen',
          'Zodat fietsers er langs kunnen',
          'Zodat verkeer dat al op de overweg staat er altijd nog af kan',
          'Omdat volledige bomen niet sterk genoeg zijn'
        ],
        goed: 2,
        uitleg: 'Bij volle bomen zou een auto ingesloten kunnen raken tussen de bomen.'
      },
      {
        vraag: 'Waarom hebben veel wissels elektrische verwarming?',
        opties: [
          'Om sneeuw en ijs tussen tong en spoorstaaf te voorkomen, zodat het wissel kan sluiten en vergrendelen',
          'Om de spoorstaven uit te laten zetten',
          'Om de wisselmotor op te warmen',
          'Om roest te voorkomen'
        ],
        goed: 0,
        uitleg: 'Een wissel dat niet goed in eindstand komt, kan niet worden vergrendeld en blokkeert de rijweg.'
      }
    ]
  },
  {
    id: 'elektrisch-dieselelektrisch',
    categorie: 'trein',
    titel: 'Elektrische en diesel-elektrische tractie',
    kern: 'Een diesel-elektrische trein is eigenlijk een elektrische trein met een eigen elektriciteitscentrale aan boord.',
    uitleg: [
      'Een elektrische trein krijgt zijn energie van buiten. Daardoor is hij licht in verhouding tot zijn vermogen, accelereert hij snel, kan hij remenergie terugleveren en heeft hij geen lokale uitstoot. Moderne treinen hebben driefasige inductie- of synchrone motoren met vermogenselektronica, net als een EV. Bij treinstellen zijn de motoren verdeeld over meerdere draaistellen (gedistribueerde tractie), wat de beschikbare adhesie beter benut.',
      'Op lijnen zonder bovenleiding, in Nederland vooral in het noorden en oosten, rijden diesel-treinstellen. Een mechanische versnellingsbak voor honderden kilowatts tot megawatts is zwaar en complex; daarom drijft de diesel vaak een generator aan en zijn de wielen elektrisch aangedreven (diesel-elektrisch). Zo draait de diesel altijd in een gunstig toerental, ongeacht de treinsnelheid. Er bestaan ook diesel-hydraulische en -mechanische uitvoeringen.',
      'Tussenvormen nemen toe: bi-mode treinen die onder bovenleiding elektrisch rijden en daarbuiten op diesel, batterijtreinen die onder de draad laden en korte niet-geëlektrificeerde stukken overbruggen, en waterstoftreinen (er zijn in Groningen proeven mee gedaan).'
    ],
    feiten: [
      'Elektrische treinen kunnen bij remmen energie terugleveren aan de bovenleiding, mits een andere trein of het onderstation die kan opnemen.',
      'Gedistribueerde tractie: meer aangedreven assen, dus meer benutbare adhesie.',
      'Een diesel-elektrische locomotief heeft een generator (of dynamo) en elektrische tractiemotoren.',
      'Op 1500 V DC is terugleveren lastiger dan bij AC, omdat de gelijkrichters in onderstations meestal niet terug kunnen voeden.'
    ],
    vragen: [
      {
        vraag: 'Waarom drijft een diesel in een trein vaak een generator aan in plaats van de wielen via een versnellingsbak?',
        opties: [
          'Elektromotoren zijn goedkoper dan diesels',
          'Een diesel kan de wielen niet direct laten draaien',
          'Om sneller te kunnen tanken',
          'Een mechanische bak voor zulke vermogens is zwaar en complex; elektrisch kan de diesel in een gunstig toerental blijven'
        ],
        goed: 3,
        uitleg: 'De generator en elektromotoren werken als een traploze transmissie.'
      },
      {
        vraag: 'Wat is een voordeel van gedistribueerde tractie (motoren onder meerdere rijtuigen)?',
        opties: [
          'Het gewicht op aangedreven assen is groter, dus er is meer adhesie voor optrekken en remmen',
          'Er is maar één pantograaf nodig',
          'De trein kan zonder bovenleiding rijden',
          'De trein heeft geen remmen nodig'
        ],
        goed: 0,
        uitleg: 'Trekkracht is beperkt tot adhesie × gewicht op aangedreven wielen; meer aangedreven assen = meer trekkracht.'
      },
      {
        vraag: 'Wat doet een bi-mode trein?',
        opties: [
          'Rijdt op twee spoorbreedtes',
          'Rijdt elektrisch onder de bovenleiding en op een andere bron (bijv. diesel) daarbuiten',
          'Heeft twee cabines',
          'Kan zowel reizigers als goederen vervoeren'
        ],
        goed: 1,
        uitleg: 'Bi-mode materieel combineert een stroomafnemer met een eigen energiebron.'
      }
    ]
  },
  {
    id: 'ns-materieel',
    categorie: 'trein',
    titel: 'Treinstellen in Nederland: een overzicht',
    kern: 'NS rijdt vooral met treinstellen in plaats van locomotief-plus-rijtuigen, wat snel keren en flexibel koppelen mogelijk maakt.',
    uitleg: [
      'Een treinstel is een vaste combinatie van rijtuigen met aan beide kanten een cabine en de aandrijving verdeeld onder de bak. Aan het eindpunt hoeft de machinist alleen naar de andere cabine te lopen, en bij drukte koppel je twee of drie stellen aan elkaar. Dat past bij het Nederlandse net met veel korte ritten, veel knooppunten en hoge frequenties.',
      'Grofweg rijdt NS met dubbeldeksintercity’s (zoals de VIRM), met de Koploper (ICM) met zijn kenmerkende hooggeplaatste cabine waardoor reizigers tijdens het koppelen door de kop kunnen lopen, met de nieuwe intercity (ICNG) die ook over de HSL-Zuid kan, en met Sprinters (SLT en SNG) die snel optrekken voor korte stopafstanden. Regionale vervoerders rijden in het noorden en oosten met eigen materieel, deels diesel.',
      'Sprinters zijn ontworpen op acceleratie: veel aangedreven assen en lage vloeren voor snel in- en uitstappen. Intercity’s zijn ontworpen op comfort en capaciteit: dubbeldekkers bieden veel zitplaatsen per meter perron, wat in Nederland met beperkte perronlengtes belangrijk is.'
    ],
    feiten: [
      'Treinstel: cabine aan beide uiteinden, aandrijving verdeeld; snel keren zonder rangeren.',
      'VIRM: dubbeldeks intercity-materieel; ICM: Koploper; SLT en SNG: Sprinters; ICNG: Intercity Nieuwe Generatie.',
      'De ICNG is meerspanningsmaterieel: 1500 V DC en 25 kV AC, en kan dus over de HSL-Zuid.',
      'Maximumsnelheid op het klassieke NL-net is meestal 130–140 km/h; op enkele nieuwere trajecten ligt die hoger.'
    ],
    vragen: [
      {
        vraag: 'Wat is het belangrijkste operationele voordeel van treinstellen op het Nederlandse net?',
        opties: [
          'Ze zijn sneller dan locomotieven',
          'Ze kunnen aan het eindpunt direct keren en gemakkelijk gekoppeld worden',
          'Ze hebben geen bovenleiding nodig',
          'Ze verbruiken geen energie bij remmen'
        ],
        goed: 1,
        uitleg: 'Met cabines aan beide kanten hoef je niet om te rangeren; koppelen en ontkoppelen past de capaciteit aan de drukte aan.'
      },
      {
        vraag: 'Waarom kan de ICNG over de HSL-Zuid rijden?',
        opties: [
          'Omdat de HSL-Zuid ook op 1500 V rijdt',
          'Omdat hij een dieselmotor heeft',
          'Omdat hij geschikt is voor zowel 1500 V DC als 25 kV AC',
          'Omdat hij geen ERTMS nodig heeft'
        ],
        goed: 2,
        uitleg: 'De HSL-Zuid heeft 25 kV; alleen meerspanningsmaterieel kan zowel daar als op het hoofdnet rijden.'
      },
      {
        vraag: 'Wat is typisch voor een Sprinter ten opzichte van een intercity?',
        opties: [
          'Hogere topsnelheid',
          'Meer zitplaatsen per meter',
          'Alleen geschikt voor 25 kV',
          'Ontworpen op snel optrekken en snel in- en uitstappen'
        ],
        goed: 3,
        uitleg: 'Bij korte stopafstanden bepalen acceleratie en halteertijd de rijtijd meer dan de topsnelheid.'
      }
    ]
  },
  // ───────────────────────────── SCHIP ─────────────────────────────
  {
    id: 'drijfvermogen-stabiliteit',
    categorie: 'schip',
    titel: 'Drijfvermogen en stabiliteit',
    kern: 'Een schip drijft omdat het zijn eigen gewicht aan water verplaatst; stabiel is het als het metacentrum boven het zwaartepunt ligt.',
    uitleg: [
      'Volgens de wet van Archimedes ondervindt een ondergedompeld lichaam een opwaartse kracht gelijk aan het gewicht van het verplaatste water. Een stalen schip drijft omdat de romp hol is: het zakt zo ver in dat het verplaatste volume water precies evenveel weegt als het hele schip. Dat gewicht heet de waterverplaatsing; hoe diep het schip daarbij ligt, is de diepgang. Laad je meer, dan zakt het schip dieper.',
      'In zoet water (rivier) ligt een schip iets dieper dan in zout zeewater, omdat zoet water minder dicht is (1000 tegen ca. 1025 kg/m³). Daarom staan op zeeschepen laadlijnmerken (Plimsoll-merk) met aparte lijnen voor zoet en zout water, zomer en winter.',
      'Stabiliteit gaat over wat er gebeurt als het schip helt. Het gewicht werkt in het zwaartepunt G; de opwaartse kracht in het drukkingspunt B, het zwaartepunt van het ondergedompelde volume. Helt het schip, dan verschuift B naar de lage kant, omdat die kant dieper in het water komt. De verticaal door de nieuwe B snijdt het hartvlak in het metacentrum M. Ligt M boven G (positieve metacentrische hoogte GM), dan maken gewicht en opwaartse kracht een oprichtend koppel. Ligt G te hoog, bijvoorbeeld door hoge deklading of water op een tussendek, dan kan het schip kapseizen.',
      'Een grote GM geeft een stijf schip dat snel en schokkerig terugslingert; een kleine GM een “slap” schip dat traag rolt maar comfortabel is. Ontwerpers zoeken een balans. Vrij bewegende vloeistof in halfvolle tanks (vrij-vloeistofoppervlak) verkleint de effectieve GM: een belangrijke oorzaak van ongelukken.'
    ],
    feiten: [
      'Dichtheid zoet water: 1000 kg/m³; zeewater: ca. 1025 kg/m³.',
      'Waterverplaatsing = massa van het schip = volume onder water × dichtheid van het water.',
      'GM (metacentrische hoogte) > 0 is nodig voor aanvangsstabiliteit.',
      'Een schip dat van zee een rivier op vaart, ligt een paar procent dieper.'
    ],
    formules: [
      { formule: 'F_opwaarts = ρ × V × g', betekenis: 'Opwaartse kracht = dichtheid water × verplaatst volume × g.' },
      { formule: 'GM = KM − KG', betekenis: 'Metacentrische hoogte = hoogte metacentrum boven de kiel − hoogte zwaartepunt boven de kiel.' }
    ],
    vragen: [
      {
        vraag: 'Een binnenvaartschip vaart van de Noordzee een rivier op. Wat gebeurt er met de diepgang?',
        opties: [
          'Die neemt iets toe, omdat zoet water minder dicht is',
          'Die neemt af',
          'Die blijft gelijk',
          'Dat hangt alleen af van de stroming'
        ],
        goed: 0,
        uitleg: 'Bij lagere dichtheid moet het schip meer volume verplaatsen om hetzelfde gewicht te dragen.'
      },
      {
        vraag: 'Wanneer is een schip stabiel bij een kleine helling?',
        opties: [
          'Als het zwaartepunt boven het metacentrum ligt',
          'Als het drukkingspunt in het hartvlak blijft',
          'Als de diepgang groter is dan de breedte',
          'Als het metacentrum boven het zwaartepunt ligt'
        ],
        goed: 3,
        uitleg: 'Dan vormen gewicht en opwaartse kracht een oprichtend koppel (GM > 0).'
      },
      {
        vraag: 'Waarom zijn halfvolle tanks slecht voor de stabiliteit?',
        opties: [
          'Ze maken het schip zwaarder',
          'De vloeistof stroomt naar de lage kant en verkleint zo de effectieve metacentrische hoogte',
          'Ze verhogen de diepgang',
          'Ze veroorzaken roest'
        ],
        goed: 1,
        uitleg: 'Het vrij-vloeistofoppervlak verschuift gewicht naar de lage kant, wat werkt alsof het zwaartepunt hoger ligt.'
      }
    ]
  },
  {
    id: 'scheepsschroef-voortstuwing',
    categorie: 'schip',
    titel: 'Voortstuwing: schroef, spoed en cavitatie',
    kern: 'Een scheepsschroef werkt als een draaiende vleugel; spoed is de theoretische afstand per omwenteling, cavitatie de grens van wat hij kan.',
    uitleg: [
      'Elk schroefblad is een vleugelprofiel. Draait de schroef, dan maakt het blad een invalshoek met het water en ontstaat aan de voorkant (zuigzijde) onderdruk en aan de achterkant overdruk. De resultante wijst grotendeels naar voren: stuwkracht. De schroef versnelt een grote hoeveelheid water naar achteren.',
      'Spoed is de afstand die de schroef per omwenteling zou afleggen als hij als een kurkentrekker door een vast materiaal draaide. In water is dat minder: het verschil heet slip en is nodig om stuwkracht te maken (geen slip, geen invalshoek). Een grote, langzaam draaiende schroef is efficiënter dan een kleine snelle, omdat hij een grotere massa water een kleinere snelheid geeft. Vandaar de enorme, langzame schroeven van zeeschepen. Een verstelbare schroef (controllable pitch propeller) kan de bladhoek tijdens het draaien veranderen, zelfs naar achteruit.',
      'Cavitatie ontstaat als de onderdruk aan de zuigzijde zo groot wordt dat het water lokaal gaat koken bij omgevingstemperatuur: er vormen zich dampbellen. Die imploderen als ze in een gebied met hogere druk komen, met lokale drukpieken die metaal letterlijk uit het blad slaan (pitting), plus lawaai en trillingen. Hoe hoger de bladsnelheid en hoe ondieper de schroef, hoe sneller cavitatie optreedt.',
      'Een boegschroef is een schroef in een dwarse tunnel in het voorschip. Hij duwt de boeg zijwaarts zonder dat het schip vaart hoeft te maken, onmisbaar bij aanleggen. Bij vaart werkt hij steeds slechter, omdat de langsstroming de straal uit de tunnel afbuigt.'
    ],
    feiten: [
      'Spoed × toerental = theoretische snelheid; werkelijke snelheid is lager (slip).',
      'Cavitatie veroorzaakt pitting (putcorrosie-achtige schade) en geluid; marineschepen zijn er extra gevoelig voor vanwege detectie.',
      'Een boegschroef is vooral effectief bij lage snelheid, ruwweg onder een paar knopen.',
      'Een verstelbare schroef draait met constant toerental; stuwkracht wordt geregeld met de bladhoek.'
    ],
    formules: [
      { formule: 'v_theoretisch = spoed × n', betekenis: 'Snelheid zonder slip; slip = (v_theoretisch − v_werkelijk) / v_theoretisch.' }
    ],
    vragen: [
      {
        vraag: 'Wat is cavitatie bij een scheepsschroef?',
        opties: [
          'Het vastlopen van de schroef in het slib',
          'Het verlies van een schroefblad',
          'Vorming en implosie van dampbellen door te lage druk aan de zuigzijde',
          'Het meezuigen van lucht vanaf het wateroppervlak'
        ],
        goed: 2,
        uitleg: 'Bij voldoende onderdruk kookt water al bij omgevingstemperatuur; imploderende bellen beschadigen het blad.'
      },
      {
        vraag: 'Waarom hebben grote zeeschepen enorme, langzaam draaiende schroeven?',
        opties: [
          'Een grote massa water een kleine snelheidstoename geven is efficiënter',
          'Omdat kleine schroeven niet sterk genoeg zijn',
          'Om de boegschroef te ontlasten',
          'Om cavitatie juist op te wekken'
        ],
        goed: 0,
        uitleg: 'Het voortstuwingsrendement is hoger als je veel water een beetje versnelt dan weinig water veel (zelfde principe als turbofans).'
      },
      {
        vraag: 'Waarom werkt een boegschroef slecht als het schip vaart heeft?',
        opties: [
          'Omdat hij dan uit het water komt',
          'Omdat het roer hem blokkeert',
          'Omdat de motor dan te weinig vermogen heeft',
          'Omdat de langsstroming de dwarse waterstraal afbuigt'
        ],
        goed: 3,
        uitleg: 'Bij vaart wordt de straal uit de tunnel meegesleurd langs de romp, waardoor de dwarskracht afneemt.'
      }
    ]
  },
  {
    id: 'roer-sturen-schip',
    categorie: 'schip',
    titel: 'Roer en sturen: waarom een schip pas stuurt met doorstroming',
    kern: 'Een roer werkt alleen als er water langs stroomt; een stilliggend schip stuurt pas als de schroefstroom over het roer gaat.',
    uitleg: [
      'Een roer is net als een schroefblad een vleugel: met een invalshoek ten opzichte van het langsstromende water levert het een dwarskracht. Die kracht duwt het achterschip opzij; het schip draait om een punt dat ergens in het voorste deel ligt (het draaipunt). Bij een auto stuur je de voorwielen, bij een schip stuur je dus eigenlijk met de achterkant: het hek zwaait uit naar de andere kant van de bocht. Wie een kade dicht aan bakboord heeft en naar stuurboord stuurt, zwaait met het hek tegen de kade.',
      'Zonder vaart is er geen langsstroming en dus geen roerwerking. Het roer staat bij de meeste schepen recht achter de schroef. Geef je even kort gas vooruit met het roer opzij, dan blaast de schroefstroom over het roer en draait het hek, nog voordat het schip echt vaart maakt. Achteruit varen werkt het roer slecht, omdat de schroef dan water wegzuigt bij het roer in plaats van ertegenaan te blazen.',
      'Daarbij komt het schroefeffect (prop walk): een schroef duwt het hek ook iets zijwaarts. Een rechtsdraaiende schroef (van achteren gezien met de klok mee bij vooruit) trekt bij achteruit het hek duidelijk naar bakboord. Ervaren schippers gebruiken dat juist bij aanleggen.',
      'Wind en stroming beïnvloeden alles. Een leeg binnenvaartschip met veel bovenwaterschip vangt veel wind; varen tegen de stroom in geeft meer roerwerking bij dezelfde grondsnelheid, omdat er meer water langs het roer gaat. Daarom leg je bij voorkeur aan tegen de stroom in.'
    ],
    feiten: [
      'Bij een rechtsdraaiende schroef loopt het hek bij achteruitslaan naar bakboord.',
      'De draaicirkel van een groot schip kan enkele scheepslengtes in diameter zijn.',
      'Roerwerking hangt af van de snelheid van het water langs het roer, niet van de grondsnelheid.',
      'Moderne schepen hebben soms roerpropellers (azimuth) of meerdere roeren voor meer wendbaarheid.'
    ],
    letOp: 'Bij het wegvaren van een kade: het hek zwaait uit. Stuur je te vroeg van de kade weg, dan raakt je achterschip de kant.',
    vragen: [
      {
        vraag: 'Waarom stuurt een schip zonder vaart nauwelijks, maar wél als je kort gas geeft met het roer opzij?',
        opties: [
          'Omdat de motor dan de boeg duwt',
          'Omdat de schroefstroom over het roer blaast en zo roerwerking geeft',
          'Omdat het roer bij stilstand vergrendeld is',
          'Omdat de kiel dan meewerkt'
        ],
        goed: 1,
        uitleg: 'Een roer heeft langsstroming nodig; de schroefstroom levert die al voordat het schip echt snelheid heeft.'
      },
      {
        vraag: 'Je ligt met bakboord langs een kade en stuurt bij het wegvaren meteen hard naar stuurboord. Wat gebeurt er?',
        opties: [
          'Het hek zwaait naar bakboord, tegen de kade',
          'De boeg raakt de kade',
          'Het schip schuift evenwijdig van de kade af',
          'Er gebeurt niets tot je vaart hebt'
        ],
        goed: 0,
        uitleg: 'Een schip draait om een punt in het voorschip: het achterschip zwaait naar de andere kant dan de bocht.'
      },
      {
        vraag: 'Een schip met een rechtsdraaiende schroef slaat achteruit. Welke kant op loopt het hek?',
        opties: ['Naar stuurboord', 'Recht naar achteren', 'Dat hangt van het roer af', 'Naar bakboord'],
        goed: 3,
        uitleg: 'Het schroefeffect van een rechtsdraaiende schroef trekt het hek bij achteruit naar bakboord.'
      }
    ]
  },
  {
    id: 'scheepsdiesel',
    categorie: 'schip',
    titel: 'Scheepsmotoren: de grote tweetakt-diesel',
    kern: 'De grootste zeeschepen hebben langzaamlopende tweetakt-diesels die direct op de schroef zitten en ruim 50% rendement halen.',
    uitleg: [
      'Een groot containerschip of tanker heeft meestal één enorme tweetakt-diesel, een “langzaamloper”, die met ca. 60–120 tpm draait en rechtstreeks, zonder tandwielkast, de schroef aandrijft. Zo’n motor kan meer dan tien cilinders hebben, met zuigers van bijna een meter diameter en een slag van meer dan twee meter. Vermogens lopen tot tientallen megawatts.',
      'Waarom tweetakt? Bij lage toeren levert elke omwenteling een arbeidsslag, dus veel vermogen per kilo motor. Het nadeel van de kleine tweetakt (spoelverlies van mengsel) speelt hier niet: een diesel spoelt alleen met lucht, en er wordt pas daarna brandstof ingespoten. Spoeling gaat via poorten onderin de cilindervoering (aangeblazen door turbo’s) en één grote uitlaatklep bovenin: uniflow-spoeling.',
      'Zulke motoren hebben een kruishoofd: de zuigerstang gaat recht naar beneden naar een geleid kruishoofd, en pas daar begint de drijfstang. Daardoor duwt de zuiger niet schuin tegen de cilinderwand, en kunnen cilinder en carter gescheiden worden (andere olie, en vuile verbrandingsresten blijven uit het carter). Ze zijn het efficiëntst van alle verbrandingsmotoren: boven 50% thermisch rendement. Binnenvaartschepen en kleinere schepen gebruiken meestal snellere viertakt-diesels met een keerkoppeling.',
      'Traditioneel draaiden ze op zware stookolie (HFO), een stroperig residu dat verwarmd moet worden voor gebruik. Door strengere zwavelregels (en emissiezones) gebruiken schepen nu laagzwavelige brandstoffen of scrubbers, en worden dual-fuel motoren op LNG, methanol en in de toekomst ammoniak gebouwd.'
    ],
    feiten: [
      'Langzaamlopende tweetakt: ca. 60–120 tpm, direct gekoppeld aan de schroef.',
      'Thermisch rendement grote scheepsdiesels: boven 50%, het hoogste van alle zuigermotoren.',
      'Kruishoofdmotor: zuigerstang + kruishoofd + drijfstang; geen zijdelingse zuigerkracht op de cilinderwand.',
      'Sinds 2020 geldt wereldwijd een zwavellimiet van 0,5% in scheepsbrandstof (strenger in emissiecontrolegebieden zoals de Noordzee).'
    ],
    vragen: [
      {
        vraag: 'Waarom heeft een groot zeeschip geen tandwielkast tussen motor en schroef?',
        opties: [
          'Omdat tandwielen niet in zout water werken',
          'Omdat de motor zo langzaam draait dat hij direct het gunstige schroeftoerental heeft',
          'Omdat de schroef elektrisch aangedreven wordt',
          'Omdat een tandwielkast verboden is'
        ],
        goed: 1,
        uitleg: 'Een langzaamloper draait rond 60–120 tpm, precies het toerental van een grote, efficiënte schroef.'
      },
      {
        vraag: 'Waarom heeft een grote scheepsdiesel geen last van het spoelverlies dat kleine tweetakten vuil maakt?',
        opties: [
          'Omdat hij met alleen lucht spoelt en brandstof pas na het sluiten van de poorten inspuit',
          'Omdat hij een katalysator heeft',
          'Omdat hij op LNG draait',
          'Omdat hij geen uitlaat heeft'
        ],
        goed: 0,
        uitleg: 'Bij een diesel gaat er geen brandstof mee met de spoellucht, dus er kan ook geen onverbrand mengsel ontsnappen.'
      },
      {
        vraag: 'Wat is het voordeel van een kruishoofdconstructie?',
        opties: [
          'Hogere toerentallen',
          'Minder cilinders nodig',
          'Lichter dan een normale motor',
          'De zuiger wordt niet schuin tegen de cilinderwand gedrukt en carter en cilinder zijn gescheiden'
        ],
        goed: 3,
        uitleg: 'De zijkracht van de schuine drijfstang wordt door het kruishoofd en zijn geleiding opgevangen.'
      }
    ]
  },
  {
    id: 'navigatielichten',
    categorie: 'schip',
    titel: 'Navigatielichten: stuurboord groen, bakboord rood',
    kern: 'Uit de combinatie van lichten zie je ’s nachts welke kant een schip op vaart en of je moet uitwijken.',
    uitleg: [
      'Stuurboord is rechts (in de vaarrichting kijkend), bakboord links. Een schip voert een groen boordlicht aan stuurboord en een rood aan bakboord. Elk boordlicht schijnt van recht vooruit tot iets achterlijker dan dwars (112,5°). Een wit heklicht schijnt naar achteren over de resterende 135°. Een wit toplicht (masttoplicht) boven op de mast schijnt over dezelfde sector als beide boordlichten samen, 225° naar voren.',
      'Daardoor kun je ’s nachts aflezen hoe een schip ten opzichte van jou vaart. Zie je rood en groen tegelijk met een wit toplicht erboven, dan komt het schip recht op je af. Zie je alleen groen, dan zie je zijn stuurboordkant: hij vaart van links naar rechts voor je langs. Zie je alleen een wit licht laag, dan kijk je tegen zijn hek: je haalt hem in.',
      'Een ezelsbruggetje voor de kleuren: “rood = links”, net als de port wine die rood is (port = bakboord in het Engels). Grote schepen (zee en binnenvaart boven een bepaalde lengte) voeren twee toplichten, het achterste hoger dan het voorste, wat ook de koers verraadt. In de binnenvaart gelden volgens het BPR deels aanvullende lichten, bijvoorbeeld blauwe lichten of borden voor bijzondere situaties (zoals het blauwe bord bij stuurboord-passeren) en specifieke lichten voor duwvaart en schepen met gevaarlijke stoffen.'
    ],
    feiten: [
      'Boordlichten: groen stuurboord, rood bakboord, elk 112,5°.',
      'Heklicht: wit, 135° naar achteren.',
      'Toplicht: wit, 225° naar voren.',
      'Zie je rood en groen tegelijk, dan vaart het schip recht op je af.'
    ],
    vragen: [
      {
        vraag: 'Je ziet ’s nachts van een schip alleen een rood boordlicht en een wit toplicht. Wat zie je?',
        opties: [
          'Het schip komt recht op je af',
          'Je ziet het hek van het schip',
          'Je ziet de bakboordkant: het schip vaart van rechts naar links voor je langs',
          'Het schip ligt voor anker'
        ],
        goed: 2,
        uitleg: 'Rood is bakboord; zie je alleen rood, dan kijk je tegen de linkerzijde van het schip, dat dus naar jouw linkerkant vaart.'
      },
      {
        vraag: 'Welke kleur heeft het stuurboordlicht?',
        opties: ['Groen', 'Rood', 'Wit', 'Geel'],
        goed: 0,
        uitleg: 'Stuurboord (rechts) = groen; bakboord (links) = rood.'
      },
      {
        vraag: 'Je ziet een schip met rood én groen tegelijk, plus een wit licht erboven. Wat betekent dat?',
        opties: [
          'Het schip vaart van je weg',
          'Het is een zeilschip',
          'Het schip ligt stil',
          'Het schip komt recht op je af'
        ],
        goed: 3,
        uitleg: 'Beide boordlichten zijn alleen tegelijk zichtbaar recht vanuit het voorschip.'
      }
    ]
  },
  {
    id: 'bpr-vaarregels',
    categorie: 'schip',
    titel: 'Vaarregels op het binnenwater (BPR)',
    kern: 'Op de Nederlandse binnenwateren regelt het Binnenvaartpolitiereglement wie uitwijkt: hou stuurboordwal, klein wijkt voor groot.',
    uitleg: [
      'Op de meeste Nederlandse binnenwateren geldt het Binnenvaartpolitiereglement (BPR); op Rijn en Waal het Rijnvaartpolitiereglement (RPR) en op de Westerschelde een eigen reglement. Ze lijken op elkaar. De basisregel in vaarwegen: houd zoveel mogelijk de stuurboordwal (de rechterkant van het vaarwater). Tegenliggers passeren elkaar dan bakboord op bakboord, net als auto’s op de weg, maar dan omgekeerd ten opzichte van het Engelse verkeer.',
      'Een klein schip (in het BPR: korter dan 20 meter) moet ruimte laten aan grote schepen en uitwijken. Een groot schip kan niet snel uitwijken of stoppen, heeft veel diepgang nodig en ziet kleine bootjes vlak voor de boeg vaak niet (de dode hoek kan honderden meters zijn). Groot gaat dus in de praktijk voor klein.',
      'Tussen kleine schepen onderling gelden voorrangsregels. Een klein motorschip wijkt uit voor alle andere kleine schepen (zeil en spierkracht). Een klein schip op spierkracht (roeiboot, kano) wijkt voor een klein zeilschip. Tussen twee zeilschepen hangt het af van de kant waar de wind inkomt: over stuurboord heeft voorrang op over bakboord, en loef wijkt voor lij. Wie voorrang heeft, moet koers en snelheid houden.',
      'Voor een vaarbewijs geldt: een klein vaarbewijs is nodig voor een motorboot langer dan 15 meter of die sneller kan dan 20 km/h. Op veel wateren gelden lokale snelheidsbeperkingen. Wie op druk binnenwater een marifoon heeft, moet die op het juiste kanaal uitluisteren.'
    ],
    feiten: [
      'BPR: klein schip = korter dan 20 m (met uitzonderingen zoals duwboten en passagiersschepen).',
      'Basisregel: stuurboordwal houden; tegenliggers passeren bakboord aan bakboord.',
      'Klein motorschip wijkt voor klein zeilschip en kleine schepen op spierkracht.',
      'Klein vaarbewijs nodig vanaf 15 m lengte of een maximale snelheid boven 20 km/h.'
    ],
    letOp: 'Blijf uit de dode hoek vóór de boeg van grote schepen; de schipper ziet je daar vaak honderden meters niet.',
    vragen: [
      {
        vraag: 'Je vaart met een sloep (6 m, motor) op een kanaal. Een vrachtschip van 110 m komt je tegemoet. Wat doe je?',
        opties: [
          'Voorrang nemen, want je komt van rechts',
          'Midden in de vaargeul blijven',
          'Stuurboordwal houden en het grote schip ruim de ruimte geven',
          'Bakboordwal houden'
        ],
        goed: 2,
        uitleg: 'Kleine schepen wijken voor grote; houd rechts en blijf uit de vaargeul van de beroepsvaart.'
      },
      {
        vraag: 'Een kleine motorboot en een kleine zeilboot naderen elkaar. Wie wijkt uit?',
        opties: [
          'De zeilboot',
          'Degene die van links komt',
          'Allebei naar bakboord',
          'De motorboot'
        ],
        goed: 3,
        uitleg: 'Een klein motorschip wijkt uit voor kleine zeilschepen en kleine schepen op spierkracht.'
      },
      {
        vraag: 'Wanneer heb je een klein vaarbewijs nodig voor een motorboot?',
        opties: [
          'Als hij langer is dan 15 m of sneller kan dan 20 km/h',
          'Altijd als er een motor op zit',
          'Alleen op zee',
          'Alleen boven 20 m lengte'
        ],
        goed: 0,
        uitleg: 'Onder die grenzen is geen vaarbewijs verplicht; de regels kennen moet je wel altijd.'
      }
    ]
  },
  {
    id: 'betonning-iala',
    categorie: 'schip',
    titel: 'Betonning: rode en groene tonnen',
    kern: 'In het IALA-A-stelsel liggen rode tonnen aan bakboord en groene aan stuurboord als je van zee komt of stroomopwaarts vaart.',
    uitleg: [
      'Tonnen markeren de randen van het vaarwater. Europa (en de meeste wereld behalve Amerika en enkele Aziatische landen) gebruikt IALA-systeem A. Daarin geldt: vaar je van zee naar binnen (of stroomopwaarts), dan houd je de rode tonnen aan bakboord en de groene aan stuurboord. Vaar je de andere kant op, dan is het precies omgekeerd. Het vaarwater ligt tussen de rood en groen.',
      'Rode tonnen zijn cilindrisch of stomp (een plat bovenkantje), groene zijn spits (kegelvormig). Zo kun je ook bij weinig licht of kleurverlies aan de vorm zien welke kant het is. Ze zijn vaak genummerd: rood met even nummers, groen met oneven, oplopend in de betonningsrichting. Bij licht hebben ze een rood resp. groen ritmisch knipperend licht.',
      'Daarnaast zijn er kardinale tonnen (geel-zwart, met twee kegeltjes als topteken) die aangeven aan welke kant (N, O, Z, W) van een gevaar het veilige water ligt, gevaarpuntboeien (zwart-rood met twee bollen) op een geïsoleerd gevaar, en scheidingstonnen waar een vaarwater splitst. Op Nederlandse binnenwateren gebruikt het BPR hetzelfde kleurprincipe, met aanvullende borden langs de oever.'
    ],
    feiten: [
      'IALA-A (Europa): binnenkomend rood aan bakboord, groen aan stuurboord.',
      'IALA-B (Amerika, Japan, enz.): precies omgekeerd (“red right returning”).',
      'Rood = stompe/cilindrische vorm, even nummers; groen = spitse vorm, oneven nummers.',
      'Kardinale tonnen: geel-zwart; de topteken-kegels wijzen naar de kant van het veilige water.'
    ],
    vragen: [
      {
        vraag: 'Je vaart vanaf zee een Nederlandse haven binnen. Aan welke kant houd je de rode tonnen?',
        opties: ['Aan stuurboord', 'Aan bakboord', 'Afwisselend', 'Midden in het vaarwater'],
        goed: 1,
        uitleg: 'IALA-A: binnenkomend rood aan bakboord (links).'
      },
      {
        vraag: 'Welke vorm heeft een groene ton in IALA-A?',
        opties: ['Bolvormig', 'Cilindrisch (stomp)', 'Kruisvormig', 'Spits (kegelvormig)'],
        goed: 3,
        uitleg: 'Groen = spits, rood = stomp. Zo is de kant ook zonder kleurherkenning te zien.'
      },
      {
        vraag: 'Je vaart de rivier af, richting zee. Waar liggen nu de groene tonnen?',
        opties: [
          'Aan bakboord',
          'Aan stuurboord',
          'Aan beide kanten',
          'Er zijn dan geen groene tonnen'
        ],
        goed: 0,
        uitleg: 'Uitgaand is alles gespiegeld: groen aan bakboord, rood aan stuurboord.'
      }
    ]
  },
  {
    id: 'marifoon-basis',
    categorie: 'schip',
    titel: 'Marifoon: kanalen en procedures',
    kern: 'De marifoon is de VHF-radio aan boord; kanaal 16 is het internationale nood- en aanroepkanaal op zee.',
    uitleg: [
      'De marifoon werkt op VHF (rond 156–162 MHz) en heeft daardoor een bereik dat ongeveer tot de horizon gaat: van schip tot schip orde 10–20 zeemijl, afhankelijk van antennehoogte. Kanalen zijn vast toegewezen. Op zee is kanaal 16 het nood-, spoed- en aanroepkanaal: je roept iemand op 16 op en gaat dan naar een werkkanaal.',
      'Op de Nederlandse binnenwateren is het systeem anders. Daar luister je het blokkanaal uit dat op borden langs de vaarweg wordt aangegeven (verkeerspost of sector), en schip-schip-communicatie gaat over kanaal 10. Bruggen en sluizen hebben eigen kanalen. Op binnenwater is het uitzenden van een ATIS-code (een identificatie die bij elke uitzending automatisch meegaat) verplicht.',
      'Voor het gebruik van een marifoon heb je een certificaat nodig (in Nederland een basiscertificaat marifonie of een uitgebreider certificaat voor zee met DSC). Bij nood is de procedure: MAYDAY (driemaal), naam en roepnaam, positie, aard van de nood, gevraagde hulp, aantal personen aan boord. PAN-PAN is voor spoed zonder direct levensgevaar, SÉCURITÉ voor veiligheidsberichten zoals een drijvend obstakel.'
    ],
    feiten: [
      'Kanaal 16: internationaal nood-, spoed- en aanroepkanaal (zee).',
      'Binnenwater NL: schip-schip op kanaal 10; blokkanalen per sector; ATIS verplicht.',
      'Prioriteit: MAYDAY (nood) > PAN-PAN (spoed) > SÉCURITÉ (veiligheid).',
      'DSC (digital selective calling) kan met één knop een digitale noodoproep met GPS-positie verzenden.'
    ],
    vragen: [
      {
        vraag: 'Welk kanaal is op zee het internationale nood- en aanroepkanaal?',
        opties: ['Kanaal 10', 'Kanaal 70', 'Kanaal 16', 'Kanaal 1'],
        goed: 2,
        uitleg: 'Kanaal 16 wordt uitgeluisterd door kustwacht en schepen; DSC-oproepen gaan over kanaal 70.'
      },
      {
        vraag: 'Welke oproep gebruik je voor een man-over-boord-situatie met direct levensgevaar?',
        opties: ['MAYDAY', 'SÉCURITÉ', 'PAN-PAN', 'ROGER'],
        goed: 0,
        uitleg: 'Bij direct levensgevaar is het een noodoproep: MAYDAY.'
      },
      {
        vraag: 'Wat is op Nederlandse binnenwateren verplicht bij marifoongebruik?',
        opties: [
          'Uitsluitend kanaal 16 gebruiken',
          'Elk uur een positiemelding geven',
          'Alleen bij nood uitzenden',
          'Een ATIS-identificatie die automatisch met elke uitzending meegaat'
        ],
        goed: 3,
        uitleg: 'Met ATIS is elk uitzendend schip identificeerbaar op het drukke binnenwater.'
      }
    ]
  },
  {
    id: 'sluizen-schutten',
    categorie: 'schip',
    titel: 'Sluizen en schutten',
    kern: 'Een sluis brengt een schip van het ene waterpeil naar het andere door een afgesloten kolk te vullen of te legen.',
    uitleg: [
      'Een schutsluis bestaat uit een kolk met aan beide kanten deuren of schuiven. Schutten gaat zo: de deuren aan de kant van het schip openen (het peil in de kolk is daar gelijk aan), het schip vaart in, de deuren sluiten, en via riolen of schuiven in de deuren loopt water in of uit de kolk tot het peil gelijk is aan de andere kant. Dan gaan die deuren open. Water stroomt dus zonder pompen, puur door het hoogteverschil.',
      'Puntdeuren (twee deuren die in een hoek tegen elkaar staan, met de punt naar het hoge water) worden door de waterdruk zelf dichtgedrukt: ze kunnen pas open als het peil aan beide kanten gelijk is. Zo kan een sluiswachter ze niet per ongeluk tegen de druk in openen.',
      'In de kolk ontstaan bij vullen sterke stromingen en turbulentie. Een schip moet daarom goed vastliggen met lijnen die je meeviert (bij zakken) of inhaalt (bij stijgen); nooit vastknopen aan een bolder bij een dalend peil, want dan kom je aan de lijn te hangen. Kleine schepen liggen bij voorkeur niet direct achter de schroef van een groot schip.',
      'De lichten bij een sluis (volgens BPR): rood = niet invaren; twee rode lichten naast of boven elkaar = sluis buiten gebruik; rood en groen samen = sluis wordt gereedgemaakt, nog niet invaren; groen = invaren toegestaan.'
    ],
    feiten: [
      'Puntdeuren wijzen met de punt naar het hoge water en worden door waterdruk dichtgedrukt.',
      'Sluislichten: rood = wachten; dubbel rood = buiten gebruik; rood + groen = gereedmaken; groen = invaren.',
      'Water stroomt bij schutten onder invloed van zwaartekracht; er is geen pomp nodig.',
      'De IJmuider Zeesluis (2022) is een van de grootste zeesluizen ter wereld.'
    ],
    letOp: 'Leg in een sluis nooit vast met een lijn die niet gevierd kan worden; bij een zakkend peil kan je boot aan de lijn gaan hangen.',
    vragen: [
      {
        vraag: 'Waarom kunnen puntdeuren niet worden geopend zolang er een peilverschil is?',
        opties: [
          'Omdat de waterdruk ze tegen elkaar drukt; ze wijzen met de punt naar het hoge water',
          'Omdat ze elektronisch geblokkeerd zijn',
          'Omdat ze naar het lage water openen',
          'Omdat de sluiswachter dat verbiedt'
        ],
        goed: 0,
        uitleg: 'Het hoge water duwt de deuren in hun V-vorm dicht; pas bij gelijk peil verdwijnt die kracht.'
      },
      {
        vraag: 'Bij een sluis branden een rood en een groen licht tegelijk. Wat doe je?',
        opties: [
          'Direct invaren',
          'Omkeren: de sluis is buiten gebruik',
          'Klaarmaken maar nog niet invaren: de sluis wordt gereedgemaakt',
          'Afmeren en de sluiswachter bellen'
        ],
        goed: 2,
        uitleg: 'Rood-groen betekent dat de sluis wordt voorbereid; invaren mag pas bij groen.'
      },
      {
        vraag: 'Waarom moet je in een sluis je lijnen bij dalend peil meevieren?',
        opties: [
          'Om de deuren niet te raken',
          'Om de stroming tegen te gaan',
          'Om het schip sneller te laten zakken',
          'Omdat je boot anders aan de lijn komt te hangen en kan kapseizen of beschadigen'
        ],
        goed: 3,
        uitleg: 'Een vastgezette lijn wordt bij zakkend water strak en kan de boot scheef trekken.'
      }
    ]
  },
  // ───────────────────────────── HELIKOPTER ─────────────────────────────
  {
    id: 'rotor-lift',
    categorie: 'helikopter',
    titel: 'Hoe een rotor lift maakt',
    kern: 'Rotorbladen zijn draaiende vleugels: het rotortoerental blijft vrijwel constant en lift wordt geregeld met de invalshoek van de bladen.',
    uitleg: [
      'Een rotorblad heeft een vleugelprofiel en levert lift op dezelfde manier als een vliegtuigvleugel: lift ∝ ½ρv² × oppervlak × liftcoëfficiënt, en die coëfficiënt hangt af van de invalshoek. Het grote verschil: de luchtsnelheid komt niet van de vooruitbeweging, maar van het draaien. De bladtip beweegt met ca. 200 m/s (orde Mach 0,6), terwijl het deel bij de naaf veel langzamer gaat. Daarom zijn bladen vaak getordeerd (twist): bij de naaf een grotere bladhoek dan bij de tip, zodat de lift gelijkmatiger over het blad verdeeld is.',
      'Het rotortoerental (Nr) wordt binnen nauwe marges constant gehouden, typisch binnen enkele procenten van 100%. Te laag toerental betekent te weinig centrifugaalkracht om de bladen gestrekt te houden en te weinig lift; te hoog toerental geeft overbelasting en de tips gaan richting geluidssnelheid. Een kleine pistonhelikopter heeft orde 500 rotoromwentelingen per minuut, grote helikopters veel minder (orde 200–300) door hun grotere diameter.',
      'Door het constante toerental regel je lift niet met snelheid maar met bladhoek (pitch). Daarvoor dienen de collective en de cyclic. De bladen zijn met scharnieren of flexibele elementen aan de naaf bevestigd, zodat ze kunnen flappen (op en neer), soms ook leaden-laggen (voor- en achterwaarts in het rotorvlak), en natuurlijk om hun lengteas kunnen verdraaien (feathering) voor de bladhoek.',
      'De rotor duwt lucht naar beneden: de geïnduceerde luchtstroom (downwash). Lift is in feite de reactie op het per seconde naar beneden versnellen van een grote massa lucht. In de hover is die neerwaartse luchtstroom ruwweg 10–20 m/s bij een lichte helikopter, en meer bij zwaardere: denk aan het stof en water dat je ziet opwaaien.'
    ],
    feiten: [
      'Bladtipsnelheid: orde 200 m/s, ongeveer Mach 0,6.',
      'Rotortoerental wordt vrijwel constant gehouden (gouverneur of handmatig met de throttle).',
      'Bladtwist: grotere hoek bij de naaf dan bij de tip, voor gelijkmatigere lift.',
      'Drie bladbewegingen: flapping (op/neer), lead-lag (in het rotorvlak) en feathering (bladhoek).'
    ],
    formules: [
      { formule: 'L = ½ × ρ × v² × S × C_L', betekenis: 'Lift van een blad(element); v is de lokale luchtsnelheid, die van naaf naar tip toeneemt.' },
      { formule: 'v_tip = ω × R = 2π × n × R', betekenis: 'Tipsnelheid; bij R = 5 m en 7 omw/s (420 tpm) ongeveer 220 m/s.' }
    ],
    vragen: [
      {
        vraag: 'Hoe regelt een helikopter de hoeveelheid lift van de hoofdrotor?',
        opties: [
          'Door het rotortoerental te verhogen of te verlagen',
          'Door de bladhoek (pitch) te veranderen bij een vrijwel constant toerental',
          'Door de rotorbladen in te trekken',
          'Door de staartrotor sneller te laten draaien'
        ],
        goed: 1,
        uitleg: 'Toerental is te traag en te kritisch om mee te regelen; de bladhoek bepaalt de liftcoëfficiënt.'
      },
      {
        vraag: 'Waarom hebben rotorbladen vaak twist?',
        opties: [
          'Om het geluid te verminderen',
          'Om ijsvorming te voorkomen',
          'Om lift gelijkmatiger over het blad te verdelen, omdat de tip veel sneller gaat dan de naaf',
          'Om het blad stijver te maken'
        ],
        goed: 2,
        uitleg: 'Een kleinere hoek bij de snelle tip en een grotere bij de langzame naaf geeft een gelijkmatiger liftverdeling.'
      },
      {
        vraag: 'Wat is feathering?',
        opties: [
          'Het op en neer bewegen van het blad',
          'Het voor- en achterwaarts bewegen van het blad in het rotorvlak',
          'Het afremmen van de rotor na de landing',
          'Het verdraaien van het blad om zijn lengteas, dus het veranderen van de bladhoek'
        ],
        goed: 3,
        uitleg: 'Feathering is pitchverandering; flapping en lead-lag zijn de andere twee vrijheden.'
      }
    ]
  },
  {
    id: 'collective',
    categorie: 'helikopter',
    titel: 'De collective: alle bladen tegelijk',
    kern: 'De collective verandert de bladhoek van alle bladen evenveel tegelijk: meer pitch is meer lift, maar ook meer weerstand en meer benodigd vermogen.',
    uitleg: [
      'De collective is de hendel links van de piloot. Omhoog trekken vergroot de bladhoek van alle bladen gelijk, over de hele omwenteling. De totale rotorstuwkracht neemt toe en de helikopter stijgt; omlaag duwen doet het omgekeerde.',
      'Meer bladhoek betekent ook meer luchtweerstand van de bladen: de rotor wil vertragen. Om het toerental constant te houden moet de motor dus meer vermogen leveren. Bij oudere of lichte pistonhelikopters zit daarom een correlator die de throttle meeopent met de collective, en een gouverneur die het restant bijregelt. Bij turbinehelikopters regelt de brandstofregeling (vaak FADEC) dat volledig automatisch.',
      'Meer motorvermogen betekent ook meer koppel op de rotoras, en dus een grotere neiging van de romp om tegen de rotordraairichting in te draaien. Collective omhoog vraagt daarom steeds een correctie met de pedalen. Collective, throttle en pedalen zijn zo onlosmakelijk met elkaar verbonden; de cyclic hoort er ook bij, omdat meer stuwkracht ook de stand van de helikopter in de lucht beïnvloedt. Hoveren is daardoor in het begin berucht lastig: alle bedieningsorganen beïnvloeden elkaar.'
    ],
    feiten: [
      'Collective: links, omhoog = meer bladhoek voor alle bladen = meer lift.',
      'Collective omhoog vraagt meer vermogen en meer anti-torque-pedaal.',
      'Correlator + gouverneur (piston) of FADEC (turbine) houden het rotortoerental constant.',
      'Op de collective zit bij pistonhelikopters vaak de draaigashendel (twist grip throttle).'
    ],
    vragen: [
      {
        vraag: 'Wat gebeurt er als je de collective omhoog trekt zonder iets anders te doen (zonder gouverneur)?',
        opties: [
          'De helikopter stijgt, het rotortoerental zakt en de romp gaat draaien door meer koppel',
          'De helikopter stijgt, verder verandert er niets',
          'De helikopter gaat vooruit',
          'De rotor gaat sneller draaien'
        ],
        goed: 0,
        uitleg: 'Meer bladhoek = meer weerstand = rotor vertraagt; meer vermogen geven geeft meer koppel, dat met pedalen moet worden gecompenseerd.'
      },
      {
        vraag: 'Waarom vraagt meer collective ook pedaalcorrectie?',
        opties: [
          'Omdat de staartrotor anders afslaat',
          'Omdat het motorkoppel toeneemt, dus ook de neiging van de romp om te draaien',
          'Omdat de cyclic dan geblokkeerd is',
          'Omdat de staartrotor aan de collective vastzit'
        ],
        goed: 1,
        uitleg: 'Elk extra vermogen naar de hoofdrotor geeft een even groot tegenkoppel op de romp.'
      },
      {
        vraag: 'Wat doet een correlator in een pistonhelikopter?',
        opties: [
          'Hij verdeelt lift over de bladen',
          'Hij regelt de staartrotor',
          'Hij houdt de cyclic in het midden',
          'Hij opent de throttle mee als de collective omhoog gaat'
        ],
        goed: 3,
        uitleg: 'Zo stijgt het vermogen automatisch mee met de grotere weerstand; de gouverneur doet de fijnregeling.'
      }
    ]
  },
  {
    id: 'cyclic-swashplate',
    categorie: 'helikopter',
    titel: 'De cyclic en de swashplate',
    kern: 'De cyclic varieert de bladhoek per omwenteling via de swashplate; daardoor kantelt het rotorvlak en daarmee de stuwkracht.',
    uitleg: [
      'De swashplate (tuimelschijf) bestaat uit twee ringen rond de rotoras: een stilstaande onderste ring, verbonden met de bedieningsorganen, en een meedraaiende bovenste ring, die via pitch links met elk blad verbonden is. De collective schuift de hele swashplate omhoog of omlaag: alle bladen krijgen dezelfde extra hoek. De cyclic kantelt de swashplate.',
      'Is de swashplate gekanteld, dan krijgt elk blad tijdens één omwenteling een wisselende bladhoek: op het ene punt maximaal, 180° verder minimaal. Waar het blad meer lift heeft, flapt het omhoog; waar het minder heeft, flapt het omlaag. Het rotorvlak (de tip path plane) kantelt dus, en de totale stuwkracht kantelt mee. Een voorwaarts gekantelde stuwkracht heeft een horizontale component: de helikopter versnelt naar voren.',
      'De grootste uitslag van het blad komt niet op het punt waar de pitch maximaal is, maar ongeveer 90° later in de draairichting. Dat heet faseverschuiving (vaak uitgelegd als gyroscopische precessie; aerodynamisch is het het resonantiegedrag van een flappend blad). Om de rotor naar voren te kantelen moet de maximale pitch dus aan de zijkant liggen, 90° vóór het voorste punt. Ontwerpers bouwen dat in de koppeling van swashplate en pitch links in; de piloot hoeft er niets van te merken: cyclic naar voren is rotor naar voren.',
      'In de sim merk je dat cyclic-input een snelheidscommando is voor de rotorkanteling, niet voor de rompstand: de romp hangt er als een slinger onder en volgt met vertraging. Kleine, rustige bewegingen werken veel beter dan grote correcties.'
    ],
    feiten: [
      'Swashplate: onderste ring staat stil, bovenste ring draait mee met de rotor.',
      'Collective = hele swashplate omhoog/omlaag; cyclic = swashplate kantelen.',
      'Faseverschuiving: maximale flapuitslag ca. 90° na de maximale pitch (bij scharnier dicht bij de as).',
      'De cyclic bestuurt de richting van de rotorstuwkracht, en daarmee stampen, rollen en horizontale beweging.'
    ],
    beeld: 'rotor',
    vragen: [
      {
        vraag: 'Wat doet de cyclic mechanisch met de swashplate?',
        opties: [
          'Hij schuift de swashplate omhoog',
          'Hij laat de swashplate sneller draaien',
          'Hij kantelt de swashplate, waardoor de bladhoek per omwenteling varieert',
          'Hij koppelt de staartrotor los'
        ],
        goed: 2,
        uitleg: 'Een gekantelde swashplate laat de pitch links op en neer gaan tijdens elke omwenteling.'
      },
      {
        vraag: 'Waarom kantelt het rotorvlak als de bladhoek per omwenteling varieert?',
        opties: [
          'Omdat de rotoras zelf kantelt',
          'Omdat de bladen flappen: omhoog waar ze meer lift hebben, omlaag waar minder',
          'Omdat de motor het rotorvlak trekt',
          'Omdat de staartrotor ertegen duwt'
        ],
        goed: 1,
        uitleg: 'Het rotorvlak volgt het flapgedrag van de bladen; de stuwkracht staat loodrecht op dat vlak.'
      },
      {
        vraag: 'Waar ligt bij een rotor de maximale flapuitslag ten opzichte van de maximale bladhoek?',
        opties: [
          'Op hetzelfde punt',
          '180° later',
          '45° eerder',
          'Ongeveer 90° later in de draairichting'
        ],
        goed: 3,
        uitleg: 'Door de faseverschuiving van ca. 90° moet de pitchvariatie een kwartslag eerder worden ingevoerd.'
      },
      {
        vraag: 'Welk deel van de swashplate draait mee met de rotor?',
        opties: ['De bovenste ring', 'De onderste ring', 'Beide ringen', 'Geen van beide'],
        goed: 0,
        uitleg: 'De onderste ring is verbonden met de stuurorganen en staat stil; de bovenste draait mee en is via pitch links met de bladen verbonden.'
      }
    ]
  },
  {
    id: 'staartrotor-anti-torque',
    categorie: 'helikopter',
    titel: 'Koppel en de staartrotor',
    kern: 'De motor draait de rotor, dus de rotor draait de romp de andere kant op; de staartrotor levert het tegenkoppel en de pedalen sturen het.',
    uitleg: [
      'Actie is reactie: het koppel waarmee de motor de hoofdrotor aandrijft, werkt even groot terug op de romp. Zonder compensatie zou de romp tegengesteld aan de rotor gaan draaien. De staartrotor zit aan het einde van een lange staartboom en levert een zijwaartse stuwkracht; die kracht maal de arm (de afstand tot de rotoras) geeft een tegenkoppel.',
      'De pedalen veranderen de collectieve bladhoek van de staartrotor (de staartrotor heeft zelf geen cyclic). Zo stuur je om de verticale as (yaw) in de hover. De staartrotor is via een aandrijfas en tandwielkasten mechanisch verbonden met de hoofdrotor, dus hij draait in een vaste verhouding mee. Hij kost een flink deel van het vermogen, orde 10% of meer in de hover.',
      'Draait de hoofdrotor van boven gezien tegen de klok in (de meeste Amerikaanse ontwerpen), dan wil de romp met de klok mee draaien (neus naar rechts) en heb je in de hover vooral linkerpedaal nodig. Bij veel Franse/Airbus- en Russische ontwerpen draait de rotor andersom, en dus ook het benodigde pedaal. Een bijeffect: de zijwaartse stuwkracht van de staartrotor duwt de hele helikopter opzij (translating tendency), wat met een beetje cyclic of een scheve rotormast wordt gecompenseerd.',
      'Alternatieven: de fenestron (ommantelde staartrotor in de staartvin, o.a. Airbus), NOTAR (lucht door de staartboom die met het Coandă-effect en een stuurbare straal tegenkoppel levert), tandemrotoren (twee tegengesteld draaiende hoofdrotoren voor en achter, zoals de Chinook) en coaxiale rotoren (twee rotoren boven elkaar, zoals de Kamov-helikopters). Bij die laatste twee heffen de koppels van de rotoren elkaar op.'
    ],
    feiten: [
      'De staartrotor kost in de hover orde 10% of meer van het vermogen.',
      'Pedalen = collectieve pitch van de staartrotor.',
      'Fenestron: ommantelde staartrotor; NOTAR: geen staartrotor, maar luchtstraal en Coandă-effect.',
      'Tandem (Chinook) en coaxiaal (Kamov) hebben geen staartrotor nodig: de koppels heffen elkaar op.'
    ],
    letOp: 'Verlies van staartrotorwerking (LTE) bij lage snelheid en bepaalde windrichtingen kan een snelle, ongecommandeerde draai veroorzaken; vol pedaal en voorwaartse snelheid zijn de remedie.',
    vragen: [
      {
        vraag: 'Waarom heeft een helikopter met één hoofdrotor een staartrotor nodig?',
        opties: [
          'Om vooruit te vliegen',
          'Om lift te leveren bij hoge snelheid',
          'Om het reactiekoppel van de aangedreven hoofdrotor op de romp te compenseren',
          'Om de hoofdrotor te koelen'
        ],
        goed: 2,
        uitleg: 'Het aandrijfkoppel werkt terug op de romp; de staartrotor levert een gelijk tegenkoppel.'
      },
      {
        vraag: 'Wat verander je met de pedalen?',
        opties: [
          'De collectieve bladhoek van de staartrotor',
          'Het toerental van de staartrotor',
          'De kanteling van de hoofdrotor',
          'De stand van de staartvin'
        ],
        goed: 0,
        uitleg: 'De staartrotor draait in vaste verhouding met de hoofdrotor mee; je stuurt alleen de pitch.'
      },
      {
        vraag: 'Welk ontwerp heeft geen staartrotor nodig omdat twee rotoren in tegengestelde richting draaien?',
        opties: ['Fenestron', 'NOTAR', 'Starre rotor', 'Tandemrotor'],
        goed: 3,
        uitleg: 'Bij tandem- en coaxiale rotoren heffen de koppels van de twee rotoren elkaar op. Fenestron en NOTAR zijn alternatieve vormen van anti-torque.'
      }
    ]
  },
  {
    id: 'dissymmetry-flapping',
    categorie: 'helikopter',
    titel: 'Dissymmetry of lift en flapping',
    kern: 'In voorwaartse vlucht heeft het naar voren draaiende blad meer luchtsnelheid dan het terugkerende; flappen maakt de lift weer gelijk.',
    uitleg: [
      'In de hover heeft elk blad op elke positie dezelfde luchtsnelheid. Vlieg je met 100 knopen vooruit, dan krijgt het blad dat naar voren draait (advancing blade) zijn rotatiesnelheid plús 100 knopen, en het blad dat terugdraait (retreating blade) zijn rotatiesnelheid mín 100 knopen. Omdat lift met het kwadraat van de snelheid gaat, zou de helikopter zonder compensatie hard naar de kant van het terugkerende blad rollen.',
      'De oplossing is flapping. Het voorwaartse blad krijgt meer lift en flapt omhoog. Door die opwaartse beweging komt de relatieve luchtstroom meer van boven, waardoor de effectieve invalshoek kleiner wordt: minder lift. Het terugkerende blad flapt omlaag en krijgt daardoor een grotere effectieve invalshoek: meer lift. Het systeem vindt vanzelf een evenwicht waarin beide zijden ongeveer evenveel lift leveren.',
      'Een bijeffect is blowback (flapback): door de flapbeweging en de 90° faseverschuiving kantelt het rotorvlak naar achteren als de snelheid toeneemt. De piloot compenseert dat met steeds meer voorwaartse cyclic naarmate hij sneller vliegt. Een blad met een cyclische bladhoek (via de swashplate) helpt ook: het voorwaartse blad krijgt een kleinere en het terugkerende een grotere geometrische pitch.',
      'Aan de terugkerende kant ligt bij de naaf zelfs een gebied waar de lucht van achteren op het blad komt: het reverse-flowgebied. Dat groeit met de snelheid en is een van de factoren die de maximale snelheid van een helikopter begrenzen.'
    ],
    feiten: [
      'Voorwaarts blad: v_rotatie + v_vlieg; terugkerend blad: v_rotatie − v_vlieg.',
      'Flapping vereffent de lift door de effectieve invalshoek te veranderen.',
      'Blowback: rotorvlak kantelt naar achteren bij toenemende snelheid; compenseren met voorwaartse cyclic.',
      'Reverse flow: bij de naaf aan de terugkerende kant komt de lucht van achteren.'
    ],
    vragen: [
      {
        vraag: 'Waarom ontstaat dissymmetry of lift in voorwaartse vlucht?',
        opties: [
          'De staartrotor duwt één kant omhoog',
          'Het voorwaarts draaiende blad heeft een hogere luchtsnelheid dan het terugkerende blad',
          'De motor geeft meer koppel aan één kant',
          'De romp blokkeert de luchtstroom aan één kant'
        ],
        goed: 1,
        uitleg: 'Vliegsnelheid telt op bij het voorwaartse blad en trekt af bij het terugkerende blad.'
      },
      {
        vraag: 'Hoe verkleint flappen de lift van het voorwaartse blad?',
        opties: [
          'Door de opwaartse beweging komt de relatieve wind meer van boven, wat de effectieve invalshoek verkleint',
          'Door het blad korter te maken',
          'Door het rotortoerental te verlagen',
          'Door de swashplate te blokkeren'
        ],
        goed: 0,
        uitleg: 'Een opwaarts bewegend blad ‘ziet’ een luchtstroom die schuiner van boven komt.'
      },
      {
        vraag: 'Wat is blowback?',
        opties: [
          'Downwash die tegen de romp slaat',
          'Een terugslag van de motor bij starten',
          'Wind die de staartrotor wegblaast',
          'Het naar achteren kantelen van het rotorvlak bij toenemende snelheid'
        ],
        goed: 3,
        uitleg: 'Door flapping en de faseverschuiving kantelt de rotor naar achteren; daarom heb je bij hogere snelheid meer voorwaartse cyclic nodig.'
      }
    ]
  },
  {
    id: 'translational-lift-grondeffect',
    categorie: 'helikopter',
    titel: 'Translational lift en grondeffect',
    kern: 'Boven ca. 15–25 knopen en dicht bij de grond werkt de rotor efficiënter, omdat hij minder last heeft van zijn eigen neerwaartse luchtstroom.',
    uitleg: [
      'In de hover zuigt de rotor zijn eigen, al naar beneden versnelde lucht aan. Rond de bladtips ontstaan tipwervels die lucht van onder weer naar boven laten circuleren. Dat kost veel vermogen: hoveren buiten grondeffect is een van de duurste vluchtfasen.',
      'Zodra de helikopter vooruit gaat, stroomt er steeds nieuwe, ongestoorde lucht de rotor in. Bij ongeveer 15–25 knopen laat de rotor zijn eigen wervelsysteem achter zich en neemt de efficiëntie merkbaar toe: effective translational lift (ETL). Je voelt dat als een korte trilling en daarna een duidelijke toename van lift; de helikopter wil stijgen en de neus omhoog. Daardoor kost horizontale vlucht rond 60–80 knopen vaak het minste vermogen, minder dan de hover.',
      'Grondeffect treedt op als de rotor binnen ongeveer één rotordiameter van de grond is, en is het sterkst onder een halve diameter. De grond belemmert de neerwaartse luchtstroom en verkleint de tipwervels, waardoor de geïnduceerde snelheid afneemt en de rotor bij dezelfde bladhoek meer lift geeft. Daarom kan een helikopter vaak wél dicht boven de grond hoveren (IGE, in ground effect) maar niet hoog (OGE, out of ground effect), bijvoorbeeld bij een hoge temperatuur of een hoog terrein. Hoog gras, water of een helling verminderen het grondeffect.'
    ],
    feiten: [
      'ETL: ongeveer 15–25 knopen, afhankelijk van type.',
      'Grondeffect: merkbaar binnen ca. één rotordiameter, sterkst onder een halve diameter.',
      'Minimaal benodigd vermogen in horizontale vlucht ligt typisch rond 60–80 knopen.',
      'Hoveren OGE kost meer vermogen dan IGE; prestatietabellen geven beide.'
    ],
    vragen: [
      {
        vraag: 'Wat merk je typisch bij het bereiken van effective translational lift tijdens het optrekken vanuit de hover?',
        opties: [
          'Een korte trilling, gevolgd door extra lift en neiging tot stijgen',
          'Een plotseling verlies van rotortoerental',
          'De staartrotor gaat haperen',
          'De helikopter zakt door'
        ],
        goed: 0,
        uitleg: 'Door de verandering van de luchtstroom door de rotor ontstaat een korte trilling; daarna is de rotor efficiënter.'
      },
      {
        vraag: 'Waarom kan een helikopter soms wel in grondeffect hoveren maar niet erbuiten?',
        opties: [
          'Omdat de motor dicht bij de grond meer vermogen levert',
          'Omdat de lucht bij de grond warmer is',
          'Omdat de grond de neerwaartse luchtstroom en tipwervels beperkt, waardoor er minder vermogen nodig is',
          'Omdat de staartrotor dan minder vermogen nodig heeft'
        ],
        goed: 2,
        uitleg: 'Minder geïnduceerde snelheid betekent meer lift bij dezelfde bladhoek en hetzelfde vermogen.'
      },
      {
        vraag: 'Een helikopter heeft een rotordiameter van 10 m. Tot welke hoogte merk je grondeffect ongeveer?',
        opties: ['1 m', '30 m', '10 m', '100 m'],
        goed: 2,
        uitleg: 'Grondeffect werkt tot ongeveer één rotordiameter boven de grond, het sterkst onder 5 m.'
      }
    ]
  },
  {
    id: 'autorotatie',
    categorie: 'helikopter',
    titel: 'Autorotatie: veilig landen zonder motor',
    kern: 'Bij motoruitval drijft de omhoog stromende lucht de rotor aan; de piloot spaart rotorenergie tot hij die vlak boven de grond gebruikt.',
    uitleg: [
      'Tussen motor en rotor zit een vrijloopkoppeling (freewheel unit): als de motor stopt, kan de rotor vrij doordraaien. Het eerste en belangrijkste: direct de collective omlaag. Anders vertraagt de rotor in enkele seconden door de grote weerstand van de bladen, en een rotor met te laag toerental is niet meer te herstellen.',
      'Met de collective omlaag daalt de helikopter, en de lucht stroomt van onder naar boven door de rotor. Het binnenste deel van elk blad krijgt dan een luchtstroom waarvan de liftvector naar voren is gekanteld: dat deel (het aandrijvende gebied) drijft de rotor aan. Het buitenste deel (het aangedreven gebied) remt; in het midden ligt een evenwicht. Vlak bij de naaf ligt nog een klein overtrokken gebied. De piloot regelt het rotortoerental met de collective en vliegt met de cyclic een optimale snelheid, typisch rond 60–70 knopen voor een lichte helikopter. De daalsnelheid is dan orde 1500–2000 ft/min.',
      'Vlak boven de grond volgt de flare: cyclic naar achteren. De rotor kantelt achterover, de voorwaartse snelheid en de daalsnelheid nemen af, en door de toegenomen luchtstroom door de rotor loopt het rotortoerental op. Daarna zet de piloot de helikopter recht en trekt hij vlak boven de grond de collective omhoog: de opgeslagen rotationele energie wordt omgezet in een laatste dosis lift om de landing zacht te maken. Dat kan maar één keer.',
      'Het hoogte-snelheidsdiagram (de “dead man’s curve”) geeft combinaties van lage hoogte en lage snelheid aan waarin een veilige autorotatie niet mogelijk is: je hebt dan niet genoeg tijd of energie om de rotor op toeren te houden en te flaren.'
    ],
    feiten: [
      'Vrijloopkoppeling (sprag clutch) laat de rotor doordraaien bij motorstilstand.',
      'Eerste actie: collective omlaag om rotortoerental te behouden.',
      'Daalsnelheid in autorotatie: orde 1500–2000 ft/min (lichte helikopters).',
      'Hoogte-snelheidsdiagram: te vermijden combinaties van lage hoogte en lage snelheid.'
    ],
    letOp: 'Rotortoerental is je levensverzekering in een autorotatie: te laag is onherstelbaar, te hoog belast de rotor. Elke fout in de eerste seconden telt.',
    vragen: [
      {
        vraag: 'Wat is de eerste actie bij een motorstoring in kruisvlucht?',
        opties: [
          'Cyclic naar achteren',
          'Collective direct omlaag om het rotortoerental te behouden',
          'Vol pedaal geven',
          'De motor opnieuw starten'
        ],
        goed: 1,
        uitleg: 'Met hoge bladhoek vertraagt de rotor zeer snel; collective omlaag laat de luchtstroom de rotor aandrijven.'
      },
      {
        vraag: 'Waarom kan de rotor bij motoruitval blijven draaien?',
        opties: [
          'Omdat de staartrotor hem aandrijft',
          'Omdat de accu een elektromotor voedt',
          'Omdat er een vrijloopkoppeling is en de omhoog stromende lucht de rotor aandrijft',
          'Omdat de rotor geen weerstand heeft'
        ],
        goed: 2,
        uitleg: 'De vrijloopkoppeling ontkoppelt de stilstaande motor; de opwaartse luchtstroom levert de aandrijvende kracht.'
      },
      {
        vraag: 'Wat gebeurt er tijdens de flare vlak voor de landing?',
        opties: [
          'Voorwaartse en daalsnelheid nemen af en het rotortoerental loopt op',
          'De rotor stopt',
          'De helikopter versnelt naar voren',
          'Het rotortoerental daalt snel'
        ],
        goed: 0,
        uitleg: 'Door de achterover gekantelde rotor stroomt er meer lucht door, wat het toerental verhoogt en de helikopter afremt.'
      },
      {
        vraag: 'Wat geeft het hoogte-snelheidsdiagram aan?',
        opties: [
          'De maximale kruissnelheid op elke hoogte',
          'De optimale klimsnelheid',
          'Hoeveel brandstof je verbruikt per hoogte',
          'Combinaties van hoogte en snelheid waarbij een veilige autorotatie niet mogelijk is'
        ],
        goed: 3,
        uitleg: 'Bij lage snelheid op geringe hoogte is er te weinig tijd en energie om de rotor op toeren te houden en te flaren.'
      }
    ]
  },
  {
    id: 'vortex-ring-state',
    categorie: 'helikopter',
    titel: 'Vortex ring state',
    kern: 'Daal je verticaal met weinig voorwaartse snelheid en vermogen erop, dan kan de rotor in zijn eigen neerwaartse luchtstroom terechtkomen en lift verliezen.',
    uitleg: [
      'Normaal stroomt lucht van boven naar beneden door de rotor. Daal je verticaal of steil met een daalsnelheid die vergelijkbaar is met de geïnduceerde snelheid van de rotor, dan beweegt de helikopter naar beneden in zijn eigen downwash. Rond de tips ontstaat een ringvormige wervel: lucht gaat buiten de rotor naar beneden, langs de tips omhoog en weer door de rotor naar beneden. De rotor “pompt” dezelfde lucht rond.',
      'Het gevolg: een groot deel van de rotor levert nauwelijks lift, ondanks volle collective. Sterker nog, meer collective maakt het erger: meer neerwaartse luchtstroom versterkt de wervel. De daalsnelheid kan oplopen tot duizenden voet per minuut, met sterke trillingen en verminderde bestuurbaarheid.',
      'Voorwaarden (vuistregels): weinig of geen voorwaartse snelheid (onder ETL, orde onder 10–20 knopen), een daalsnelheid van orde 300 ft/min of meer, en vermogen erop (20–100% van het hoververmogen). Typische situaties: steile naderingen met wind in de rug, of hoveren buiten grondeffect en dan langzaam zakken.',
      'Herstel: de helikopter uit zijn eigen luchtstroom halen. De klassieke methode is voorwaartse cyclic om snelheid te maken en zo naar schone lucht te vliegen, en daarna de collective te gebruiken. De Vuichard-methode gebruikt zijwaartse cyclic plus pedaal en meer collective, wat sneller herstelt met minder hoogteverlies. Beide kosten hoogte, dus voorkomen is beter dan genezen.'
    ],
    feiten: [
      'Voorwaarden: lage voorwaartse snelheid, daalsnelheid vanaf ca. 300 ft/min, en motorvermogen aan.',
      'Meer collective in vortex ring state maakt het erger.',
      'Herstel: uit de eigen downwash vliegen (voorwaarts of zijwaarts).',
      'In autorotatie (geen vermogen) treedt vortex ring state niet op, omdat de lucht dan van onder door de rotor stroomt.'
    ],
    vragen: [
      {
        vraag: 'Waarom helpt meer collective niet in vortex ring state?',
        opties: [
          'Omdat de motor dan afslaat',
          'Omdat de staartrotor dan overbelast raakt',
          'Omdat de bladen dan breken',
          'Omdat meer neerwaartse luchtstroom de ringwervel versterkt'
        ],
        goed: 3,
        uitleg: 'De rotor zit in zijn eigen downwash; extra pitch pompt meer lucht in hetzelfde wervelsysteem.'
      },
      {
        vraag: 'Welke combinatie maakt vortex ring state waarschijnlijk?',
        opties: [
          'Weinig voorwaartse snelheid, flinke daalsnelheid en vermogen erop',
          'Hoge snelheid en klimmen',
          'Autorotatie met 70 knopen',
          'Hoveren in grondeffect'
        ],
        goed: 0,
        uitleg: 'Alle drie zijn nodig: de rotor moet in zijn eigen neerwaartse luchtstroom zakken.'
      },
      {
        vraag: 'Wat is de klassieke herstelmethode?',
        opties: [
          'Vol collective omhoog',
          'Motor uitzetten',
          'Voorwaartse cyclic om snelheid te maken en uit de eigen downwash te vliegen',
          'Vol pedaal naar links'
        ],
        goed: 2,
        uitleg: 'Met voorwaartse snelheid komt er schone lucht door de rotor en verdwijnt de ringwervel.'
      }
    ]
  },
  {
    id: 'turboshaft',
    categorie: 'helikopter',
    titel: 'De turboshaft-motor',
    kern: 'Een turboshaft is een gasturbine die geen stuwkracht maar asvermogen levert, via een vrije arbeidsturbine los van de gasgenerator.',
    uitleg: [
      'Een turboshaft heeft net als een straalmotor een compressor, verbrandingskamer en turbine: samen de gasgenerator. Daarachter zit een tweede, mechanisch losse turbine: de vrije arbeidsturbine (power turbine). De hete gassen van de gasgenerator drijven die aan, en die as gaat via een reductiekast naar de rotor. Bijna alle energie wordt zo als asvermogen afgenomen; er blijft weinig stuwkracht over.',
      'Doordat de arbeidsturbine los van de gasgenerator draait, kan het rotortoerental (via de arbeidsturbine, vaak aangeduid als N2 of Nf) constant blijven, terwijl het toerental van de gasgenerator (N1 of Ng) varieert met het gevraagde vermogen. De brandstofregeling (vaak FADEC) regelt N1 zo dat N2 en dus het rotortoerental op 100% blijft.',
      'Waarom turbines in helikopters? De vermogen-gewichtsverhouding is veel beter dan van een zuigermotor: een turboshaft van enkele honderden kilo’s levert gemakkelijk 500–1500 kW. Daarnaast is hij betrouwbaar en trillingsarm. Nadelen: hoger brandstofverbruik per kWh (vooral bij deellast) en hoge aanschafkosten, waardoor lichte trainingshelikopters vaak nog een zuigermotor hebben.',
      'Belangrijke grenzen in de cockpit: de turbine-temperatuur (TOT, ITT of MGT), het koppel (torque, in procent) en N1. Bij het starten moet je de temperatuur nauwlettend in de gaten houden: een te snelle brandstoftoevoer bij een te laag toerental geeft een hot start, die de turbine kan beschadigen.'
    ],
    feiten: [
      'Gasgenerator (N1/Ng) + vrije arbeidsturbine (N2/Nf).',
      'Rotortoerental wordt constant gehouden via N2; N1 varieert met het vermogen.',
      'Vermogen lichte tot middelzware helikopterturbines: orde 400–1500 kW.',
      'Kritieke limieten: turbinetemperatuur, koppel en N1.'
    ],
    vragen: [
      {
        vraag: 'Wat is het voordeel van een vrije arbeidsturbine in een turboshaft?',
        opties: [
          'Hij levert extra stuwkracht',
          'Het rotortoerental kan constant blijven terwijl de gasgenerator varieert met het gevraagde vermogen',
          'Er is geen brandstofregeling nodig',
          'Hij maakt de motor stiller'
        ],
        goed: 1,
        uitleg: 'Gasgenerator en arbeidsturbine zijn mechanisch los; alleen de gassen koppelen ze.'
      },
      {
        vraag: 'Waarom hebben veel lichte trainingshelikopters nog een zuigermotor?',
        opties: [
          'Zuigermotoren zijn lichter per kW',
          'Turbines kunnen geen constant toerental leveren',
          'Turboshafts zijn duur in aanschaf en zuinig zijn ze niet bij deellast',
          'Zuigermotoren zijn betrouwbaarder'
        ],
        goed: 2,
        uitleg: 'Voor kleine vermogens wegen de kosten en het verbruik van een turbine zwaarder dan het gewichtsvoordeel.'
      },
      {
        vraag: 'Wat is een hot start?',
        opties: [
          'Een start bij hoge buitentemperatuur',
          'Een start met een warme motor',
          'Een start waarbij de rotor te snel draait',
          'Een start waarbij de turbinetemperatuur de limiet overschrijdt'
        ],
        goed: 3,
        uitleg: 'Te veel brandstof bij te weinig luchtdoorstroming laat de temperatuur in de turbine te hoog oplopen.'
      }
    ]
  },
  {
    id: 'snelheidslimieten-heli',
    categorie: 'helikopter',
    titel: 'Snelheidslimieten en retreating blade stall',
    kern: 'Een helikopter kan niet onbeperkt snel: het terugkerende blad moet steeds meer invalshoek maken en overtrekt uiteindelijk.',
    uitleg: [
      'Bij toenemende snelheid krijgt het terugkerende blad steeds minder luchtsnelheid. Om zijn deel van de lift te blijven leveren, moet het steeds verder omlaag flappen en een steeds grotere invalshoek krijgen. Op een gegeven moment overschrijdt het buitenste deel van dat blad de kritische invalshoek en overtrekt het: retreating blade stall.',
      'Door de faseverschuiving van ca. 90° merk je dat niet als een rol, maar als een combinatie van trillingen, de neus die omhoog gaat (pitch-up) en een rol naar de kant van het terugkerende blad. Ga je niet terug in snelheid, dan wordt het erger. Herstel: collective omlaag (minder invalshoek), snelheid verminderen door de cyclic voorzichtig naar achteren, en de belastingsfactor verminderen. Niet met voorwaartse cyclic de neus omlaag drukken, want dat versnelt en vergroot het probleem.',
      'Factoren die retreating blade stall eerder laten optreden: hoge totale massa, grote dichtheidshoogte (dunnere lucht), laag rotortoerental, scherpe bochten (hogere belastingsfactor) en turbulentie. Daarom daalt de VNE van een helikopter met de hoogte en temperatuur; dat staat in de VNE-tabellen of op een kaartje in de cockpit.',
      'Aan de voorwaartse kant speelt een andere grens: de tips naderen de geluidssnelheid (compressibiliteit), met schokgolven, meer weerstand en lawaai. Samen beperken die twee effecten conventionele helikopters tot orde 150–180 knopen. Ontwerpen met coaxiale rotoren en een duwschroef, of tiltrotors, omzeilen dat.'
    ],
    feiten: [
      'Symptomen retreating blade stall: trillingen, pitch-up en rol naar de kant van het terugkerende blad.',
      'VNE daalt met toenemende dichtheidshoogte en massa.',
      'Conventionele helikopters: maximale snelheid orde 150–180 knopen.',
      'Aan de voorwaartse kant begrenzen compressibiliteitseffecten de tipsnelheid.'
    ],
    letOp: 'Bij retreating blade stall nooit de neus omlaag duwen om te herstellen: dat verhoogt de snelheid en verergert de overtrek.',
    vragen: [
      {
        vraag: 'Waarom overtrekt het terugkerende blad bij hoge snelheid?',
        opties: [
          'Het moet bij steeds minder luchtsnelheid evenveel lift leveren en daarom een steeds grotere invalshoek maken',
          'Omdat het rotortoerental daalt bij hoge snelheid',
          'Omdat de staartrotor het verstoort',
          'Omdat het blad dan dichter bij de romp komt'
        ],
        goed: 0,
        uitleg: 'Minder luchtsnelheid moet gecompenseerd worden met meer invalshoek, tot de kritische hoek wordt overschreden.'
      },
      {
        vraag: 'Welke combinatie van symptomen hoort bij retreating blade stall?',
        opties: [
          'Motor hapert en toerental daalt',
          'Gieren naar de kant van de staartrotor',
          'Neus naar beneden en rol naar de kant van het voorwaartse blad',
          'Trillingen, neus omhoog en rol naar de kant van het terugkerende blad'
        ],
        goed: 3,
        uitleg: 'Door de faseverschuiving leidt liftverlies van het terugkerende blad tot pitch-up en een rol naar die kant.'
      },
      {
        vraag: 'Welke omstandigheid laat retreating blade stall bij een lagere snelheid optreden?',
        opties: [
          'Lage massa',
          'Hoge dichtheidshoogte en hoge massa',
          'Hoog rotortoerental',
          'Rechtuit vliegen in rustige lucht'
        ],
        goed: 1,
        uitleg: 'Dunnere lucht en meer gewicht vragen meer invalshoek, dus de stalgrens komt bij een lagere snelheid.'
      }
    ]
  },
]
