// De staatkundige geschiedenis van Nederland: onder welk "rijk" viel het
// gebied per tijdvak, hoe ontstond dat en hoe ging het over in het volgende.
import type { Periode } from './data'

export type Afbeelding = { file: string; caption: string }

export type StaatSectie = {
  periode: Periode
  anker: string
  staat: string
  jaren: string
  staatsvorm: string
  kaart?: Afbeelding
  extra?: Afbeelding
  verhaal: string[]
}

export const STATEN: StaatSectie[] = [
  {
    periode: 'Late middeleeuwen (1300–1515)',
    anker: 'middeleeuwen',
    staat: 'Losse gewesten → Bourgondische Nederlanden',
    jaren: '±1300–1482',
    staatsvorm: 'Graafschappen en hertogdommen binnen het Heilige Roomse Rijk',
    kaart: { file: 'kaart-1350.png', caption: 'De Lage Landen rond 1350: een lappendeken van gewesten.' },
    extra: { file: 'kaart-bourgondisch.png', caption: 'De Bourgondische Nederlanden rond 1477.' },
    verhaal: [
      'Er bestaat in 1300 nog geen "Nederland". Het gebied is een lappendeken van vrijwel zelfstandige gewesten — het graafschap Holland en Zeeland, het hertogdom Gelre, het hertogdom Brabant, het Sticht Utrecht (bestuurd door een bisschop) en het koppige, heerloze Friesland. Formeel vallen ze bijna allemaal onder het Heilige Roomse Rijk, maar in de praktijk doet elke graaf en hertog wat hem goeddunkt, en vechten steden en adel om de macht (de Hoekse en Kabeljauwse twisten).',
      'Vanaf 1384 verzamelen de hertogen van Bourgondië de gewesten stuk voor stuk: door huwelijk, aankoop en oorlog. Filips de Goede verwerft in 1433 Holland en Zeeland (nadat Jacoba van Beieren het onderspit dolf) en regeert zo over vrijwel alle Nederlanden tegelijk — het begin van de Nederlanden als één geheel. Uit deze tijd stammen ook de eerste Staten-Generaal (1464).',
      'Als Karel de Stoute in 1477 sneuvelt, trouwt zijn dochter Maria van Bourgondië met Maximiliaan van Habsburg — en zo komen de Nederlanden per erfenis in Habsburgse handen.',
    ],
  },
  {
    periode: 'Habsburg en Opstand (1515–1602)',
    anker: 'habsburg',
    staat: 'Habsburgse Nederlanden (de Zeventien Provinciën)',
    jaren: '1482–1581',
    staatsvorm: 'Personele unie onder de Habsburgse landsheer',
    kaart: { file: 'kaart-zeventien.png', caption: 'De Habsburgse Nederlanden: de Zeventien Provinciën.' },
    extra: { file: 'portret-willem.jpg', caption: 'Willem van Oranje (1533–1584), leider van de Opstand.' },
    verhaal: [
      'Onder Karel V — geboren in Gent, heer van de Nederlanden vanaf 1515 en ook nog keizer van het Heilige Roomse Rijk en koning van Spanje — worden de gewesten in 1548 formeel samengebracht als de Zeventien Provinciën. Voor het eerst is "de Nederlanden" één staatkundig geheel, al houden de gewesten hun eigen rechten en gewoonten angstvallig vast.',
      'Zijn zoon Filips II regeert vanuit Spanje, centraliseert hardhandig en vervolgt protestanten. Beeldenstorm (1566), de komst van Alva en de onthoofding van Egmont en Horne drijven de gewesten in opstand — de Tachtigjarige Oorlog (1568). In 1581 zetten de opstandige gewesten met het Plakkaat van Verlatinghe hun wettige vorst af: een revolutionaire daad die het noorden definitief van het (Spaanse) zuiden scheidt.',
    ],
  },
  {
    periode: 'De Gouden Eeuw (1602–1702)',
    anker: 'gouden-eeuw',
    staat: 'Republiek der Zeven Verenigde Nederlanden',
    jaren: '1588–1795',
    staatsvorm: 'Statenbond zonder vorst: Staten-Generaal, stadhouders en raadpensionarissen',
    kaart: { file: 'kaart-republiek.png', caption: 'De Republiek der Zeven Verenigde Nederlanden.' },
    extra: { file: 'nachtwacht.jpg', caption: 'De Nachtwacht (Rembrandt, 1642) — icoon van de Gouden Eeuw.' },
    verhaal: [
      'Nadat pogingen om een nieuwe vorst te vinden mislukken, besluiten de opstandige gewesten het in 1588 gewoon zónder te doen: de Republiek der Zeven Verenigde Nederlanden. In een Europa vol koningen is dat hoogst ongebruikelijk. De macht ligt bij de Staten-Generaal en bij de gewesten zelf; de stadhouder (een Oranje) leidt het leger, de raadpensionaris van Holland de dagelijkse politiek — en die twee botsen geregeld, soms dodelijk (Van Oldenbarnevelt 1619, de gebroeders De Witt 1672).',
      'Het kleine land wordt in de 17e eeuw wereldmacht: de VOC beheerst de handel op Azië, Amsterdam is het financiële centrum van de wereld, en De Ruyter maakt de vloot gevreesd. De Vrede van Münster (1648) bezegelt de onafhankelijkheid die in 1581 was uitgeroepen.',
    ],
  },
  {
    periode: 'Republiek in verval (1702–1795)',
    anker: 'verval',
    staat: 'Republiek der Zeven Verenigde Nederlanden (nadagen)',
    jaren: '1702–1795',
    staatsvorm: 'Zelfde statenbond, verlamd door regenten en factiestrijd',
    verhaal: [
      'Na de dood van stadhouder-koning Willem III (1702) verliest de Republiek haar voorsprong. Engeland en Frankrijk groeien; de Nederlandse vloot en handel verschrompelen, regentenfamilies verdelen de baantjes. De Vierde Engelse Oorlog (1780–1784) legt het verval pijnlijk bloot.',
      'Burgers die zich "patriotten" noemen eisen democratische hervormingen en grijpen in 1787 bijna de macht; alleen een Pruisische interventie redt stadhouder Willem V. Acht jaar later keren de patriotten terug — met een Frans revolutieleger achter zich.',
    ],
  },
  {
    periode: 'Bataafs-Franse tijd (1795–1813)',
    anker: 'bataafs-frans',
    staat: 'Bataafse Republiek → Koninkrijk Holland → deel van Frankrijk',
    jaren: '1795–1813',
    staatsvorm: 'Eerst eenheidsstaat naar Frans model, dan koninkrijk, dan Franse provincie',
    kaart: { file: 'kaart-bataafs.jpg', caption: 'De Bataafse Republiek (±1798): voor het eerst een eenheidsstaat.' },
    extra: { file: 'kaart-holland-1806.jpg', caption: 'Het Koninkrijk Holland van Lodewijk Napoleon (1806–1810).' },
    verhaal: [
      'In 1795 trekken Franse troepen over de bevroren rivieren; Willem V vlucht en de Bataafse Republiek wordt uitgeroepen. Cruciaal: de oude gewesten-lappendeken wordt afgeschaft. De Staatsregeling van 1798 — onze eerste grondwet — maakt van Nederland één ondeelbare staat met één bestuur, één belastingstelsel en burgerrechten.',
      'Napoleon vormt de republiek in 1806 om tot het Koninkrijk Holland voor zijn broer Lodewijk — Nederlands éérste koning, die zo zijn best doet voor zijn onderdanen dat Napoleon hem in 1810 afzet en het land simpelweg bij Frankrijk trekt. Drie jaar lang is Nederland Frans grondgebied, met dienstplicht, censuur én blijvende vernieuwingen: burgerlijke stand, achternamen, kadaster.',
      'Na Napoleons nederlaag bij Leipzig (1813) landt de zoon van de laatste stadhouder in Scheveningen en wordt als Willem I soeverein vorst — de monarchie is geboren, nota bene uit de familie die twee eeuwen stadhouder was.',
    ],
  },
  {
    periode: 'Koninkrijk in opbouw (1813–1914)',
    anker: 'koninkrijk',
    staat: 'Verenigd Koninkrijk der Nederlanden → Koninkrijk der Nederlanden',
    jaren: '1815–heden',
    staatsvorm: 'Constitutionele monarchie, vanaf 1848 parlementair',
    kaart: { file: 'kaart-vk-1815.png', caption: 'Het Verenigd Koninkrijk der Nederlanden (1815–1830), met België.' },
    extra: { file: 'portret-thorbecke.jpg', caption: 'Thorbecke, architect van de grondwet van 1848.' },
    verhaal: [
      'Het Congres van Wenen (1815) plakt Noord en Zuid aaneen tot het Verenigd Koninkrijk der Nederlanden onder koning Willem I: een bufferstaat tegen Frankrijk, met ook Luxemburg. De "koning-koopman" bouwt kanalen en banken, maar regeert autoritair; het katholieke, Franstalige zuiden voelt zich achtergesteld en scheurt zich in 1830 af als België (definitief erkend in 1839).',
      'In 1848 dwingen revoluties elders in Europa Willem II tot de grondwet van Thorbecke: ministers worden verantwoordelijk aan het parlement, de koning wordt onschendbaar maar machteloos. Nederland is sindsdien een parlementaire democratie onder het Huis van Oranje — de staatsvorm die tot vandaag bestaat.',
    ],
  },
  {
    periode: 'Oorlog en crisis (1914–1945)',
    anker: 'oorlog',
    staat: 'Koninkrijk der Nederlanden (bezet 1940–1945)',
    jaren: '1914–1945',
    staatsvorm: 'Parlementaire monarchie; tijdens de bezetting een Duits rijkscommissariaat',
    verhaal: [
      'Nederland blijft neutraal in de Eerste Wereldoorlog en hoopt dat in 1940 te herhalen — tevergeefs. Na vijf dagen strijd en het bombardement op Rotterdam capituleert het leger; koningin Wilhelmina en de regering wijken uit naar Londen, terwijl bezet Nederland onder rijkscommissaris Seyss-Inquart komt te staan.',
      'De bezetting is de zwartste bladzijde van de vaderlandse geschiedenis: ruim honderdduizend Nederlandse Joden worden vermoord. Verzet (Februaristaking 1941), de mislukte bevrijding bij Arnhem en de Hongerwinter volgen, tot de bevrijding op 5 mei 1945.',
    ],
  },
  {
    periode: 'Naoorlogs Nederland (1945–nu)',
    anker: 'naoorlogs',
    staat: 'Koninkrijk der Nederlanden (vier landen)',
    jaren: '1945–heden',
    staatsvorm: 'Parlementaire monarchie; sinds het Statuut van 1954 een koninkrijk van meerdere landen',
    extra: { file: 'watersnood.jpg', caption: 'Zierikzee, 1953 — het jaar van de watersnoodramp die tot het Deltaplan leidde.' },
    verhaal: [
      'Na de oorlog verliest Nederland zijn kolonie Indonesië (1949) en bouwt het onder Drees de verzorgingsstaat op. Het Statuut van 1954 maakt van het koninkrijk een verband van gelijkwaardige landen: Nederland, Suriname (tot 1975) en de Antillen — tegenwoordig Nederland, Aruba, Curaçao en Sint-Maarten.',
      'Nederland kiest definitief voor samenwerking: medeoprichter van de NAVO (1949) en van de Europese Unie (Rome 1957, Maastricht 1992). De verzuilde samenleving van weleer wordt in de jaren zestig opengebroken en het land ontwikkelt zich tot een van de welvarendste democratieën ter wereld — nog altijd als koninkrijk onder het Huis van Oranje-Nassau.',
    ],
  },
]
