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
      'Het is ook een eeuw van rampen en onrust. De Zwarte Dood (1349–1351) keert telkens terug en kost steden soms een derde van hun inwoners. De Sint-Elisabethsvloed (1421) verzwelgt tientallen dorpen en schept de Biesbosch. En wie te zwaar belast wordt, komt in opstand: in 1492 trekt het Kaas- en Broodvolk plunderend door Holland voordat het hardhandig wordt neergeslagen. Intussen groeit in de steden een nieuwe geest — Erasmus van Rotterdam (±1466–1536) wordt de beroemdste humanist van Europa.',
      'Als Karel de Stoute in 1477 sneuvelt bij Nancy, moet zijn dochter Maria van Bourgondië met het Groot Privilege vergaande rechten aan de gewesten teruggeven — en trouwt ze met Maximiliaan van Habsburg. Zo komen de Nederlanden per erfenis in Habsburgse handen.',
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
      'Karel V regeert streng maar wordt nog als "eigen" vorst gezien — al voelt zijn geboortestad Gent dat anders als hij haar in 1540 vernedert (de "stroppendragers") en al staan er vanaf 1550 met de bloedplakkaten doodstraffen op ketterij. In 1555 draagt hij de Nederlanden over aan zijn zoon Filips II, die vanuit Spanje regeert, hardhandig centraliseert en protestanten vervolgt. Het verzet groeit: lage edelen bieden in 1566 het Smeekschrift aan (het scheldwoord "geuzen" wordt een erenaam), en in datzelfde jaar raast de Beeldenstorm door honderden kerken.',
      'Filips stuurt de hertog van Alva, wiens Bloedraad duizenden veroordeelt en de graven Egmont en Horne laat onthoofden. In 1568 begint met de Slag bij Heiligerlee de Tachtigjarige Oorlog. Willem van Oranje wordt de leider van de Opstand. Na jaren van tegenslag keert het tij: de watergeuzen nemen op 1 april 1572 Den Briel in, Alkmaar doorstaat het beleg (1573, "bij Alkmaar begint de victorie") en Leiden wordt op 3 oktober 1574 ontzet — als beloning krijgt de stad in 1575 de eerste universiteit van het noorden.',
      'In 1576 sluiten alle gewesten kortstondig de rijen (Pacificatie van Gent), maar de wegen scheiden: de noordelijke gewesten verbinden zich in 1579 in de Unie van Utrecht en zweren in 1581 met het Plakkaat van Verlatinghe hun wettige vorst af — een revolutionaire daad. De prijs is hoog: Willem van Oranje wordt in 1584 in Delft vermoord door Balthasar Gerards, en in 1585 valt Antwerpen, waarna kooplieden en kapitaal massaal naar Amsterdam vluchten.',
      'Onder prins Maurits, legervernieuwer, boekt de jonge staat successen: de list met het turfschip van Breda (1590), de overwinning bij Nieuwpoort (1600). Tegelijk begint de blik naar buiten te gaan: Cornelis de Houtman vaart in 1595 als eerste om de Kaap naar Indië, en Willem Barentsz overwintert in 1596–97 op Nova Zembla in Het Behouden Huys.',
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
      'Het kleine land wordt in de 17e eeuw wereldmacht. In 1602 wordt de VOC opgericht — de eerste "multinational" ter wereld, met verhandelbare aandelen. De Amsterdamse Wisselbank (1609) maakt de stad het financiële hart van Europa, terwijl Henry Hudson in VOC-dienst de rivier bij het latere New York verkent. Tijdens het Twaalfjarig Bestand (1609–1621) lopen de interne spanningen op: het conflict tussen Maurits en landsadvocaat Johan van Oldenbarnevelt eindigt op de Synode van Dordrecht — en met de onthoofding van Van Oldenbarnevelt (1619). Hugo de Groot ontsnapt in 1621 per boekenkist uit Slot Loevestein.',
      'De expansie is duizelingwekkend: Jan Pieterszoon Coen sticht Batavia (1619), de WIC begint de Atlantische handel — inclusief de slavenhandel, de zwarte bladzijde van de eeuw — en sticht Nieuw-Amsterdam op Manhattan (1626). Piet Hein kaapt in 1628 de Spaanse zilvervloot, Frederik Hendrik "de stedendwinger" neemt Den Bosch (1629), de WIC verovert Curaçao (1634), Tromp vernietigt een Spaanse armada bij Duins (1639), de VOC wordt als enige toegelaten tot Japan (Decima, 1641), Abel Tasman bereikt Nieuw-Zeeland (1642) en Jan van Riebeeck sticht de Kaapkolonie (1652).',
      'Thuis bloeit alles tegelijk: Amsterdam bouwt zijn grachtengordel (vanaf 1613), de Statenbijbel en de tulpencrash vallen in hetzelfde jaar (1637), Rembrandt voltooit De Nachtwacht (1642). Vermeer schildert het licht, Vondel dicht, Spinoza denkt, Christiaan Huygens vindt het slingeruurwerk uit en Antoni van Leeuwenhoek ziet als eerste mens bacteriën. Zelfs de Leidse pilgrims die in 1620 met de Mayflower vertrekken, nemen een stukje Nederland mee naar Amerika.',
      'Politiek blijft het schuren. Na de Vrede van Münster (1648) en de vroege dood van Willem II volgt het Eerste Stadhouderloze Tijdperk (1650–1672), het tijdperk van raadpensionaris Johan de Witt. Drie Engelse zeeoorlogen om de wereldhandel brengen glorie — De Ruyters Tocht naar Chatham (1667) — maar ook het einde van Nieuw-Nederland: bij de vrede van 1674 blijft Manhattan definitief Engels. In het Rampjaar 1672 ("het volk redeloos, de regering radeloos, het land reddeloos") vallen vier vijanden tegelijk aan; de gebroeders De Witt worden gelyncht en Willem III wordt stadhouder. Hij redt het land, verwelkomt na 1685 tienduizenden gevluchte hugenoten en wordt in 1688 óók koning van Engeland.',
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
      'Toch is het geen dode eeuw: de Vrede van Utrecht (1713) wordt nog op Nederlandse bodem gesloten, en de Leidse arts Herman Boerhaave geldt als "leermeester van heel Europa". Na een Franse inval wordt Willem IV in 1747 erfstadhouder van alle gewesten — maar het herstel blijft uit.',
      'Burgers die zich "patriotten" noemen eisen democratische hervormingen, aangevuurd door het anonieme pamflet "Aan het Volk van Nederland" (1781) van Joan van der Capellen tot den Pol. In 1787 grijpen ze bijna de macht: pas nadat prinses Wilhelmina bij Goejanverwellesluis is aangehouden, herstelt een Pruisisch leger het gezag van Willem V en vluchten duizenden patriotten. Acht jaar later keren ze terug — met een Frans revolutieleger achter zich.',
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
      'De prijs van het Franse bondgenootschap is hoog: de Engelsen vernietigen de Bataafse vloot bij Camperduin (1797) — het einde van Nederland als grote zeemacht — en in 1799 wordt de failliete VOC opgeheven, al wordt datzelfde jaar een Brits-Russische invasie in Noord-Holland nog afgeslagen.',
      'Napoleon vormt de republiek in 1806 om tot het Koninkrijk Holland voor zijn broer Lodewijk — Nederlands éérste koning, die zo zijn best doet voor zijn onderdanen ("Konijn van Olland") dat Napoleon hem in 1810 afzet en het land simpelweg bij Frankrijk trekt. Drie jaar lang is Nederland Frans grondgebied, met dienstplicht en censuur, maar ook blijvende vernieuwingen: de burgerlijke stand met vaste achternamen (1811), het kadaster, rechts rijden.',
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
      'Willem I verdient zijn bijnaam: hij sticht de Nederlandsche Handel-Maatschappij (1824), graaft kanalen en jaagt de industrie aan. Maar zijn eigenzinnigheid roept ook verzet op — orthodoxe gereformeerden breken in 1834 met de hervormde kerk (de Afscheiding) — en het verlies van België verwerkt hij nooit. In 1839 rijdt tussen Amsterdam en Haarlem wel de eerste Nederlandse trein: de moderne tijd komt eraan.',
      'In 1848 dwingen revoluties elders in Europa koning Willem II ("in één nacht van conservatief liberaal") tot de grondwet van Thorbecke: ministers worden verantwoordelijk aan het parlement, de koning onschendbaar maar machteloos. Nederland is sindsdien een parlementaire democratie. De samenleving verandert mee: katholieken krijgen in 1853 weer bisdommen (tot protestants protest in de Aprilbeweging), Multatuli\'s Max Havelaar (1860) klaagt het koloniale stelsel aan, de slavernij wordt in 1863 afgeschaft — rijkelijk laat — en de doodstraf verdwijnt in 1870. Het Kinderwetje van Van Houten (1874) is de eerste sociale wet; de Leerplichtwet volgt in 1900.',
      'Rond de eeuwwisseling moderniseert het land in hoog tempo: het Noordzeekanaal (1876), het Rijksmuseum (1885), Philips in Eindhoven (1891). Abraham Kuyper organiseert de "kleine luyden" in de eerste politieke partij (ARP, 1879), Troelstra sticht de SDAP (1894), Aletta Jacobs baant als eerste vrouwelijke arts de weg voor het vrouwenkiesrecht — en Vincent van Gogh schildert doeken die pas na zijn dood de wereld veroveren. Minder fraai: in Atjeh voert Nederland zijn langste en bloedigste koloniale oorlog (1873–1904). In 1890 komt de tienjarige Wilhelmina op de troon, onder regentschap van koningin Emma.',
    ],
  },
  {
    periode: 'Oorlog en crisis (1914–1945)',
    anker: 'oorlog',
    staat: 'Koninkrijk der Nederlanden (bezet 1940–1945)',
    jaren: '1914–1945',
    staatsvorm: 'Parlementaire monarchie; tijdens de bezetting een Duits rijkscommissariaat',
    verhaal: [
      'Nederland blijft neutraal in de Eerste Wereldoorlog (1914–1918), maar voelt hem wél: het leger is gemobiliseerd, een miljoen Belgische vluchtelingen worden opgevangen en voedsel gaat op de bon. Binnenslands wordt intussen geschiedenis geschreven: de Pacificatie van 1917 ruilt algemeen mannenkiesrecht tegen gelijke bekostiging van het bijzonder onderwijs, Troelstra vergist zich in november 1918 deerlijk in zijn revolutieoproep, en in 1919 krijgen ook vrouwen kiesrecht. De Zuiderzeevloed van 1916 geeft het laatste zetje voor het plan van ingenieur Lely: in 1932 sluit de Afsluitdijk de Zuiderzee af.',
      'Het interbellum begint hoopvol — de KLM (1919), de Olympische Spelen in Amsterdam (1928) — maar de wereldcrisis van de jaren dertig slaat hard toe: massawerkloosheid, het zuinige beleid van Colijn, en aan de rand van het bestel sticht Mussert de NSB (1931). In 1939 mobiliseert Nederland opnieuw en verrijst kamp Westerbork — gebouwd voor Joodse vluchtelingen, straks door de bezetter gebruikt als doorgangskamp.',
      'De hoop op herhaalde neutraliteit vervliegt op 10 mei 1940. Na vijf dagen strijd en het bombardement op Rotterdam capituleert het leger; Wilhelmina en de regering wijken uit naar Londen (Radio Oranje), bezet Nederland komt onder rijkscommissaris Seyss-Inquart. De bezetting is de zwartste bladzijde van de vaderlandse geschiedenis: van de 140.000 Nederlandse Joden overleven er ruim 100.000 de oorlog niet — onder wie Anne Frank, wier dagboek uit het Achterhuis wereldberoemd wordt. Amsterdam staakt in februari 1941 tegen de eerste razzia\'s, in april-mei 1943 leggen stakingen het hele land plat. Na de mislukte luchtlandingen bij Arnhem ("een brug te ver", 1944) volgt de Hongerwinter met duizenden doden, tot de bevrijding op 5 mei 1945.',
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
      'De wederopbouw onder "vadertje Drees" legt het fundament: de AOW (1956) kroont de verzorgingsstaat, de eerste televisie-uitzending (1951) verandert de huiskamer, en het gasveld van Slochteren (1959) maakt het land rijk. De watersnoodramp van 1 februari 1953 — 1836 doden — leidt tot het Deltaplan, bekroond met de Oosterscheldekering (1986); Flevoland wordt dat jaar de twaalfde provincie. Nederland kiest definitief voor samenwerking: medeoprichter van de NAVO (1949) en van de Europese eenwording (Rome 1957, Maastricht 1992).',
      'De jaren zestig breken de verzuilde samenleving open: Provo bespot het gezag, de televisie relativeert alles, en het huwelijk van Beatrix (1966) en de kroningsrellen van 1980 ("geen woning, geen kroning") tonen een mondiger land. Het kolonialisme wordt afgewikkeld — Nieuw-Guinea (1962), Suriname (1975) — met de Molukse treinkapingen (1975, 1977) als pijnlijke naklank. De oliecrisis (1973) brengt autoloze zondagen, het "totaalvoetbal" van Cruijff verovert de wereld maar verliest de WK-finale (1974), Oranje wint eindelijk in 1988 het EK, en de Lockheed-affaire (1976) kost prins Bernhard zijn uniformen.',
      'Na de eeuwwisseling wordt de politiek onstuimiger: het eerste paarse kabinet (1994) regeert zonder confessionelen, maar Srebrenica (1995), de vuurwerkramp in Enschede (2000), de moorden op Pim Fortuyn (2002) en Theo van Gogh (2004) en het "nee" tegen de Europese Grondwet (2005) schokken het land. Nederland opent als eerste land ter wereld het huwelijk voor paren van gelijk geslacht (2001), ruilt de gulden in voor de euro (2002) en doorstaat de kredietcrisis (2008). Willem-Alexander wordt in 2013 de eerste koning in 123 jaar; de ramp met vlucht MH17 (2014), de stikstofcrisis (2019) en de coronapandemie (2020) bepalen de recente jaren — van een land dat nog altijd koninkrijk is onder het Huis van Oranje-Nassau.',
    ],
  },
]
