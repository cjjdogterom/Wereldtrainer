// Het Europa-artikel: doorlopende tekst per tijdvak, met een kaartenreeks
// die laat zien hoe de grond verdeeld was (Wikimedia Commons).
export type ArtikelKaart = { file: string; titel: string; uitleg: string }

export type ArtikelSectie = {
  anker: string
  titel: string
  jaren: string
  alineas: string[]
  kaarten: ArtikelKaart[]
}

export const ARTIKEL: ArtikelSectie[] = [
  {
    anker: 'oudheid',
    titel: 'Vóór de Romeinen',
    jaren: '±2000–500 v.Chr.',
    kaarten: [],
    alineas: [
      'Het oudste "Europa" is een wereld van losse volken, niet van landen. Op Kreta bloeit vanaf ±2000 v.Chr. de Minoïsche beschaving — de eerste hoogontwikkelde cultuur van Europa, met paleizen als Knossos. Op het Griekse vasteland volgen de Myceners (±1600–1100 v.Chr.), de wereld waar de verhalen over Troje uit stammen. Rond 1100 v.Chr. stort deze paleiswereld in en volgen "donkere eeuwen".',
      'Daarna komen drie krachten op die het continent vormen. De Feniciërs, een handelsvolk uit de Levant, stichten kolonies langs de hele Middellandse Zee — waaronder Carthago — en geven Europa het alfabet. De Kelten bewonen als lappendeken van stammen vrijwel heel West- en Midden-Europa, van Ierland tot de Donau. En in Griekenland groeien vanaf ±800 v.Chr. de stadstaten: Athene (bakermat van de democratie) en Sparta voorop. Als het Perzische wereldrijk Griekenland probeert te veroveren, houden de verenigde Grieken stand bij Marathon (490 v.Chr.) en Salamis (480 v.Chr.).',
      'Alexander de Grote van Macedonië verovert vervolgens in één generatie (336–323 v.Chr.) het complete Perzische Rijk, tot aan India. Zijn rijk valt na zijn dood uiteen, maar de Griekse taal en cultuur — het hellenisme — blijven de hele oostelijke Middellandse Zee beheersen. In het westen wordt intussen Carthago de grootste macht, tot het botst met een opkomende stad in Italië: Rome.',
    ],
  },
  {
    anker: 'rome',
    titel: 'Rome heerst over Europa',
    jaren: '500 v.Chr.–476 n.Chr.',
    kaarten: [
      { file: 'rome-117.png', titel: 'Het Romeinse Rijk op zijn hoogtepunt (117 n.Chr.)', uitleg: 'Onder keizer Trajanus omsluit het rijk de hele Middellandse Zee — van Schotland tot de Perzische Golf.' },
    ],
    alineas: [
      'De Romeinse Republiek (vanaf 509 v.Chr.) verovert eerst Italië en verslaat dan in de drie Punische oorlogen aartsrivaal Carthago — zelfs Hannibals olifantentocht over de Alpen mag niet baten. Daarna valt de hele Middellandse Zee als een rijpe vrucht in Romeinse handen. Julius Caesar verovert Gallië (58–50 v.Chr.) en maakt met zijn machtsgreep feitelijk een einde aan de republiek; zijn erfgenaam Augustus wordt in 27 v.Chr. de eerste keizer.',
      'Vier eeuwen lang is vrijwel heel Zuid- en West-Europa Romeins: van Schotland tot Syrië, met wegen, steden, recht en één munt — de Pax Romana. In 395 wordt het onbestuurbaar grote rijk definitief gedeeld in een westelijk en een oostelijk deel. Het westen bezwijkt in de vijfde eeuw onder de volksverhuizingen: in 476 zet een Germaanse legeraanvoerder de laatste westelijke keizer af. Op de puinhopen ontstaan Germaanse koninkrijken — de kiemen van de latere Europese landen.',
    ],
  },
  {
    anker: 'vroege-me',
    titel: 'Vroege middeleeuwen',
    jaren: '476–1000',
    kaarten: [
      { file: 'europa-565.png', titel: 'Het Oost-Romeinse (Byzantijnse) Rijk in 565', uitleg: 'Onder keizer Justinianus herovert Byzantium Italië, Noord-Afrika en Zuid-Spanje — de laatste keer dat één rijk de hele Middellandse Zee bijna omsluit.' },
      { file: 'franken-814.png', titel: 'Het rijk van Karel de Grote (814)', uitleg: 'Bij Karels dood omvat het Frankische rijk Frankrijk, de Lage Landen, Duitsland en Noord-Italië. De deling van Verdun (843) legt de kiem voor Frankrijk en Duitsland.' },
    ],
    alineas: [
      'Terwijl het westen versplintert, blijft het Oost-Romeinse of Byzantijnse Rijk rond Constantinopel nog duizend jaar bestaan (tot 1453). Onder Justinianus (527–565) herovert het zelfs Italië en Noord-Afrika. In het westen verenigt de Frankische koning Clovis rond 500 Gallië; in het zuiden steken in 711 de islamitische Moren de Straat van Gibraltar over en veroveren vrijwel het hele Iberisch schiereiland — Al-Andalus, met bloeiend Córdoba.',
      'De Franken worden dé macht van het westen. Karel de Grote (768–814) regeert van de Pyreneeën tot de Elbe en wordt in het jaar 800 door de paus tot keizer gekroond — "vader van Europa". Na zijn dood wordt het rijk gedeeld (Verdun, 843): uit West-Francië groeit Frankrijk, uit Oost-Francië het Duitse rijk. Otto I laat zich in 962 tot keizer kronen: het begin van het Heilige Roomse Rijk, dat als lappendeken van honderden staatjes tot 1806 zal bestaan.',
      'Vanuit het noorden plunderen, handelen en koloniseren intussen de Vikingen (±800–1050): ze stichten Normandië, veroveren delen van Engeland en leggen in het oosten de basis voor het Kievse Rijk — de bakermat van Rusland. Rond het jaar 1000 kerstenen en "verstatelijken" de randen van Europa: Polen (966), Hongarije (1000), Denemarken en Noorwegen krijgen koningen en kerken.',
    ],
  },
  {
    anker: 'hoge-me',
    titel: 'Hoge en late middeleeuwen',
    jaren: '1000–1453',
    kaarten: [
      { file: 'europa-1200.png', titel: 'Europa rond 1200', uitleg: 'Frankrijk, Engeland en het Heilige Roomse Rijk domineren het westen; Byzantium en de kruisvaardersstaten het oosten; Al-Andalus krimpt.' },
    ],
    alineas: [
      'In 1066 verovert de Normandische hertog Willem Engeland (Slag bij Hastings) — Engelse koningen met Franse bezittingen: de kiem van eeuwen Engels-Franse strijd. Vanaf 1096 trekken kruisvaarders uit heel Europa naar het Heilige Land; de kruistochten brengen ook handel en kennis van de islamitische wereld mee terug. Op het Iberisch schiereiland duwt de christelijke Reconquista de Moren eeuw na eeuw terug, tot in 1492 Granada valt.',
      'In het oosten verwoesten de Mongolen van de Gouden Horde vanaf 1237 Rusland en Oost-Europa; de Russische vorstendommen blijven twee eeuwen schatplichtig. In het westen vechten Engeland en Frankrijk de Honderdjarige Oorlog uit (1337–1453) — het conflict waarin Jeanne d\'Arc het tij keert en waaruit Frankrijk als sterke eenheidsstaat komt. De pest (1347–1351) doodt intussen een derde van alle Europeanen.',
      'De Bourgondische hertogen verzamelen in de 15e eeuw de Lage Landen; Portugal en Castilië beginnen aan de ontdekkingsreizen. En in 1453 valt Constantinopel: het duizendjarige Byzantium is ten einde, en het Ottomaanse Rijk wordt de nieuwe grootmacht van Zuidoost-Europa — het zal tot tweemaal toe voor Wenen staan (1529 en 1683).',
    ],
  },
  {
    anker: 'vroegmodern',
    titel: 'Vroegmoderne tijd',
    jaren: '1453–1789',
    kaarten: [
      { file: 'europa-1519.jpg', titel: 'De landen van Karel V (1519)', uitleg: 'Door erfenissen regeert één Habsburger over Spanje, de Nederlanden, Oostenrijk en Zuid-Italië — "een rijk waarin de zon nooit ondergaat".' },
      { file: 'europa-1648.jpg', titel: 'Europa na de Vrede van Westfalen (1648)', uitleg: 'Het moderne statenstelsel: soevereine staten met vaste grenzen. De Republiek is erkend; Duitsland blijft een lappendeken.' },
    ],
    alineas: [
      'Rond 1500 krijgt de kaart van Europa herkenbare vormen: Spanje ontstaat uit het huwelijk van Castilië en Aragon (1479), Portugal en Engeland zijn oude koninkrijken, Frankrijk is gecentraliseerd. Door huwelijkspolitiek erft de Habsburger Karel V een wereldrijk: Spanje mét Amerika, de Nederlanden, Oostenrijk en half Italië. Zijn zoon Filips II krijgt het Spaanse deel — en verliest de opstandige Nederlanden.',
      'Luther spijkert in 1517 zijn stellingen aan de kerkdeur: de Reformatie splijt Europa in katholiek en protestant. Een eeuw van godsdienstoorlogen culmineert in de verwoestende Dertigjarige Oorlog (1618–1648). De Vrede van Westfalen die hem beëindigt is een keerpunt: voortaan bestaat Europa uit soevereine staten die elkaars grenzen (in theorie) respecteren — en de Republiek der Nederlanden wordt formeel erkend.',
      'Daarna wisselen de grootmachten elkaar af: de kleine Republiek beleeft haar Gouden Eeuw op zee, het Frankrijk van Lodewijk XIV domineert het continent, Engeland en Schotland fuseren tot Groot-Brittannië (1707) en heersen na 1763 over de zeeën. In het oosten moderniseert Peter de Grote Rusland tot Europese grootmacht (Sint-Petersburg, 1703) en maakt Frederik de Grote van Pruisen een militaire macht. Polen, ooit reusachtig, wordt aan het eind van de 18e eeuw door zijn buren in drie delingen van de kaart geveegd.',
    ],
  },
  {
    anker: 'revolutie-19e',
    titel: 'Revolutie en de 19e eeuw',
    jaren: '1789–1914',
    kaarten: [
      { file: 'europa-1812.png', titel: 'Europa onder Napoleon (1812)', uitleg: 'Vrijwel het hele continent is Frans, bondgenoot of vazal; alleen Groot-Brittannië en Rusland staan erbuiten.' },
      { file: 'europa-1815.png', titel: 'Europa na het Congres van Wenen (1815)', uitleg: 'De grootmachten herordenen de kaart; er volgt een eeuw van relatieve machtsbalans.' },
      { file: 'europa-1871.png', titel: 'Europa in 1871', uitleg: 'Na de Duitse en Italiaanse eenwording staan de nieuwe nationale staten op de kaart.' },
    ],
    alineas: [
      'De Franse Revolutie (1789) maakt een einde aan het absolute koningschap en zet "vrijheid, gelijkheid en broederschap" op de Europese agenda. Napoleon Bonaparte exporteert de revolutie met het zwaard: rond 1812 is vrijwel heel continentaal Europa Frans, bondgenoot of vazal. Zijn wetboek en bestuur hervormen half Europa blijvend — maar de veldtocht naar Moskou en Waterloo (1815) maken een einde aan het avontuur.',
      'Het Congres van Wenen (1815) tekent de kaart opnieuw met koningen en machtsbalans; nieuwe staten als het Verenigd Koninkrijk der Nederlanden moeten Frankrijk indammen. Maar de geest van nationalisme is uit de fles: België scheurt zich af (1830), Griekenland bevecht zijn onafhankelijkheid van de Ottomanen (1830), Italië wordt onder Cavour en Garibaldi verenigd (1861–1870) en Bismarck smeedt na de zege op Frankrijk het Duitse Keizerrijk (1871).',
      'Aan de vooravond van 1914 is Europa verdeeld in vijf grootmachten — Groot-Brittannië (het grootste wereldrijk ooit onder Victoria), Frankrijk, het nieuwe Duitsland, Oostenrijk-Hongarije en Rusland — plus het wegkwijnende Ottomaanse Rijk, "de zieke man van Europa". Twee bondgenootschappen staan tegenover elkaar, wachtend op een vonk.',
    ],
  },
  {
    anker: 'wereldoorlogen',
    titel: 'De wereldoorlogen',
    jaren: '1914–1945',
    kaarten: [
      { file: 'europa-1914.png', titel: 'De bondgenootschappen van 1914', uitleg: 'De Centralen (Duitsland, Oostenrijk-Hongarije) tegenover de Entente (Frankrijk, Rusland, Groot-Brittannië).' },
      { file: 'europa-1923.jpg', titel: 'Europa in 1923', uitleg: 'Na de Eerste Wereldoorlog: vier keizerrijken verdwenen, een gordel van nieuwe staten van Finland tot Joegoslavië.' },
      { file: 'europa-1942.png', titel: 'De As-bezetting van Europa (1942)', uitleg: 'Op het hoogtepunt beheersen nazi-Duitsland en zijn bondgenoten vrijwel het hele continent.' },
    ],
    alineas: [
      'Eén schot in Sarajevo (1914) ontsteekt de Eerste Wereldoorlog: vier jaar loopgraven en tien miljoen doden. Aan het einde zijn vier keizerrijken verdwenen — het Duitse, het Oostenrijks-Hongaarse, het Russische en het Ottomaanse — en verschijnt een gordel van nieuwe staten op de kaart: Polen herrijst, Tsjecho-Slowakije, Joegoslavië, Finland en de Baltische staten worden geboren. In Rusland grijpen de bolsjewieken de macht (1917): de Sovjet-Unie.',
      'De vrede van Versailles vernedert Duitsland en de crisis van de jaren dertig doet de rest: Hitler grijpt in 1933 de macht en ontketent in 1939 de Tweede Wereldoorlog. Op het hoogtepunt (1942) beheerst nazi-Duitsland vrijwel heel Europa. De oorlog en de Holocaust kosten tientallen miljoenen levens; in 1945 ligt het continent in puin en rukken de bevrijders vanuit west én oost op naar Berlijn.',
    ],
  },
  {
    anker: 'naoorlogs',
    titel: 'Gedeeld en verenigd',
    jaren: '1945–nu',
    kaarten: [
      { file: 'koude-oorlog.png', titel: 'NAVO tegenover Warschaupact (1949–1990)', uitleg: 'Europa in twee blokken, gescheiden door het IJzeren Gordijn dwars door Duitsland.' },
      { file: 'eu-uitbreiding.png', titel: 'De uitbreiding van de Europese Unie', uitleg: 'Van zes oprichters (1957) naar meer dan 25 lidstaten; na 1989 schuift de Unie naar het oosten op.' },
    ],
    alineas: [
      'Na 1945 valt Europa in tweeën: het westen onder Amerikaanse paraplu (NAVO, 1949), het oosten achter het IJzeren Gordijn onder de Sovjet-Unie (Warschaupact, 1955). Berlijn — met zijn Muur vanaf 1961 — wordt hét symbool van de deling. Tegelijk begint in het westen iets nieuws: zes landen richten in 1957 de Europese Economische Gemeenschap op, het begin van de Europese eenwording.',
      'In 1989 valt de Muur en stort het Sovjetblok in; in 1991 valt de Sovjet-Unie zelf uiteen in vijftien landen. Duitsland wordt herenigd, Tsjecho-Slowakije splitst vreedzaam (1993), Joegoslavië bloedig (1991–2008). De Europese Unie (Maastricht, 1992) breidt uit naar het oosten en telt inmiddels meer dan 25 lidstaten met grotendeels open grenzen — een verenigd Europa dat niettemin, zoals de oorlog in Oekraïne laat zien, zijn oostgrens opnieuw bevochten ziet.',
    ],
  },
]
