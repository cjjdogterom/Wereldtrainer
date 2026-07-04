// Geschiedenis van Nederland vanaf ±1300: belangrijke gebeurtenissen en
// personen, gecureerd op hoofdlijnen (indeling naar de tijdvakken van de
// Wikipedia-tijdlijn van de Nederlandse geschiedenis).
export type Soort = 'gebeurtenis' | 'persoon'

export type HistItem = {
  jaar: number // sorteerjaar (voor personen: geboortejaar)
  label?: string // weergave, bijv. '1568–1648' of '1533–1584'
  titel: string
  uitleg: string
  soort: Soort
  periode: Periode
}

export type Periode =
  | 'Late middeleeuwen (1300–1515)'
  | 'Habsburg en Opstand (1515–1602)'
  | 'De Gouden Eeuw (1602–1702)'
  | 'Republiek in verval (1702–1795)'
  | 'Bataafs-Franse tijd (1795–1813)'
  | 'Koninkrijk in opbouw (1813–1914)'
  | 'Oorlog en crisis (1914–1945)'
  | 'Naoorlogs Nederland (1945–nu)'

export const PERIODES: Periode[] = [
  'Late middeleeuwen (1300–1515)',
  'Habsburg en Opstand (1515–1602)',
  'De Gouden Eeuw (1602–1702)',
  'Republiek in verval (1702–1795)',
  'Bataafs-Franse tijd (1795–1813)',
  'Koninkrijk in opbouw (1813–1914)',
  'Oorlog en crisis (1914–1945)',
  'Naoorlogs Nederland (1945–nu)',
]

const G = 'gebeurtenis' as const
const P = 'persoon' as const

export const ITEMS: HistItem[] = [
  // ─── Late middeleeuwen (1300–1515) ───
  { jaar: 1302, titel: 'Guldensporenslag', uitleg: 'Vlaamse steden verslaan het Franse ridderleger bij Kortrijk — symbool van de macht van de opkomende steden in de Lage Landen.', soort: G, periode: 'Late middeleeuwen (1300–1515)' },
  { jaar: 1345, titel: 'Slag bij Warns', uitleg: 'De Friezen verslaan het leger van de Hollandse graaf Willem IV; Friesland blijft nog lang buiten grafelijk gezag.', soort: G, periode: 'Late middeleeuwen (1300–1515)' },
  { jaar: 1350, label: '±1350–1490', titel: 'Hoekse en Kabeljauwse twisten', uitleg: 'Langdurige burgertwisten in Holland tussen adels- en stedenpartijen over de grafelijke macht.', soort: G, periode: 'Late middeleeuwen (1300–1515)' },
  { jaar: 1401, label: '1401–1436', titel: 'Jacoba van Beieren', uitleg: 'Gravin van Holland en Zeeland die haar erfenis moest verdedigen; verloor de strijd uiteindelijk van Bourgondië.', soort: P, periode: 'Late middeleeuwen (1300–1515)' },
  { jaar: 1421, titel: 'Sint-Elisabethsvloed', uitleg: 'Grote overstroming in Holland en Zeeland; tientallen dorpen verdwijnen, de Biesbosch ontstaat.', soort: G, periode: 'Late middeleeuwen (1300–1515)' },
  { jaar: 1428, titel: 'Zoen van Delft', uitleg: 'Jacoba van Beieren moet Filips de Goede als erfgenaam en regent erkennen — Holland komt in de Bourgondische invloedssfeer.', soort: G, periode: 'Late middeleeuwen (1300–1515)' },
  { jaar: 1396, label: '1396–1467', titel: 'Filips de Goede', uitleg: 'Bourgondische hertog die Holland, Zeeland, Brabant en meer gewesten onder één bewind bracht — begin van "de Nederlanden".', soort: P, periode: 'Late middeleeuwen (1300–1515)' },
  { jaar: 1464, titel: 'Eerste Staten-Generaal', uitleg: 'Afgevaardigden van de gewesten komen voor het eerst samen — de kiem van gezamenlijk overleg in de Nederlanden.', soort: G, periode: 'Late middeleeuwen (1300–1515)' },
  { jaar: 1477, titel: 'Groot Privilege', uitleg: 'Maria van Bourgondië moet na de dood van haar vader vergaande rechten aan de gewesten teruggeven.', soort: G, periode: 'Late middeleeuwen (1300–1515)' },
  { jaar: 1492, titel: 'Opstand van het Kaas- en Broodvolk', uitleg: 'Boeren en burgers in Holland komen in opstand tegen zware belastingen; hardhandig neergeslagen.', soort: G, periode: 'Late middeleeuwen (1300–1515)' },
  { jaar: 1466, label: '±1466–1536', titel: 'Erasmus van Rotterdam', uitleg: 'Beroemdste humanist van Europa; pleitte voor verdraagzaamheid en een zuiver christendom ("Lof der Zotheid").', soort: P, periode: 'Late middeleeuwen (1300–1515)' },

  // ─── Habsburg en Opstand (1515–1602) ───
  { jaar: 1515, titel: 'Karel V aan de macht', uitleg: 'De Habsburger Karel V wordt heer der Nederlanden en groeit uit tot vorst van een wereldrijk.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1500, label: '1500–1558', titel: 'Karel V', uitleg: 'Keizer van het Heilige Roomse Rijk én heer der Nederlanden; bracht met de Transactie van Augsburg de Zeventien Provinciën bijeen.', soort: P, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1548, titel: 'Transactie van Augsburg', uitleg: 'De Zeventien Provinciën worden één staatsverband binnen het rijk van Karel V.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1555, titel: 'Troonsafstand van Karel V', uitleg: 'Karel V draagt de Nederlanden over aan zijn zoon Filips II — wiens strenge bewind de Opstand zal uitlokken.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1527, label: '1527–1598', titel: 'Filips II', uitleg: 'Koning van Spanje en heer der Nederlanden; zijn centralisme en kettervervolging dreven de gewesten tot opstand.', soort: P, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1566, titel: 'Beeldenstorm', uitleg: 'Calvinisten vernielen in korte tijd beelden en altaren in honderden kerken — het begin van openlijk verzet.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1567, titel: 'Alva naar de Nederlanden', uitleg: 'Filips II stuurt de hertog van Alva; diens Raad van Beroerten ("Bloedraad") veroordeelt duizenden.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1507, label: '1507–1582', titel: 'Hertog van Alva', uitleg: 'IJzeren Spaanse landvoogd; zijn schrikbewind en Tiende Penning joegen de Nederlanden in het verzet.', soort: P, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1568, titel: 'Slag bij Heiligerlee — begin Tachtigjarige Oorlog', uitleg: 'Eerste overwinning van de opstandelingen; in hetzelfde jaar worden de graven Egmont en Horne onthoofd.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1533, label: '1533–1584', titel: 'Willem van Oranje', uitleg: '"Vader des Vaderlands": leider van de Opstand tegen Spanje, in 1584 in Delft vermoord door Balthasar Gerards.', soort: P, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1572, titel: 'Inname van Den Briel', uitleg: 'De watergeuzen veroveren op 1 april Den Briel; stad na stad kiest daarna voor de prins.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1573, titel: 'Ontzet van Alkmaar', uitleg: 'Eerste grote zege op de Spaanse belegeraars: "Bij Alkmaar begint de victorie".', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1574, titel: 'Leidens Ontzet', uitleg: 'Na maandenlang beleg wordt Leiden op 3 oktober bevrijd; als beloning krijgt de stad een universiteit.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1576, titel: 'Pacificatie van Gent', uitleg: 'Alle gewesten sluiten kortstondig de rijen tegen de muitende Spaanse troepen.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1579, titel: 'Unie van Utrecht', uitleg: 'De noordelijke gewesten sluiten een verbond dat uitgroeit tot de grondslag van de Republiek.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1581, titel: 'Plakkaat van Verlatinghe', uitleg: 'De Staten-Generaal zweren Filips II af — een vroege "onafhankelijkheidsverklaring".', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1584, titel: 'Moord op Willem van Oranje', uitleg: 'Balthasar Gerards schiet de prins dood in het Prinsenhof in Delft.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1585, titel: 'Val van Antwerpen', uitleg: 'Spanje herovert de grootste handelsstad; kooplieden en geld vluchten naar Amsterdam.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1588, titel: 'Geboorte van de Republiek', uitleg: 'De gewesten gaan zonder vorst verder: de Republiek der Zeven Verenigde Nederlanden; Engeland en de Republiek verslaan de Spaanse Armada.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1590, titel: 'Turfschip van Breda', uitleg: 'Soldaten verstopt in een turfschip heroveren Breda — de beroemdste list van prins Maurits.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1596, label: '1596–1597', titel: 'Overwintering op Nova Zembla', uitleg: 'Willem Barentsz en Jacob van Heemskerck overleven de poolwinter in Het Behouden Huys.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1600, titel: 'Slag bij Nieuwpoort', uitleg: 'Maurits wint een beroemde maar strategisch loze slag op het strand ("1600: slag bij Nieuwpoort").', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1567.5, label: '1567–1625', titel: 'Prins Maurits', uitleg: 'Zoon van Willem van Oranje en legervernieuwer; maakte het Staatse leger het modernste van Europa.', soort: P, periode: 'Habsburg en Opstand (1515–1602)' },

  // ─── De Gouden Eeuw (1602–1702) ───
  { jaar: 1602, titel: 'Oprichting van de VOC', uitleg: 'De Verenigde Oost-Indische Compagnie: eerste "multinational" ter wereld, met aandelen en handelsmonopolie op Azië.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1609, label: '1609–1621', titel: 'Twaalfjarig Bestand', uitleg: 'Wapenstilstand met Spanje; intern lopen de spanningen tussen Maurits en Van Oldenbarnevelt op.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1547, label: '1547–1619', titel: 'Johan van Oldenbarnevelt', uitleg: 'Landsadvocaat en bouwer van de Republiek; na conflict met Maurits in 1619 onthoofd.', soort: P, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1618, label: '1618–1619', titel: 'Synode van Dordrecht', uitleg: 'Nationale kerkvergadering: strenge lijn wint, Van Oldenbarnevelt onthoofd, opdracht voor de Statenbijbel.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1619, titel: 'Stichting van Batavia', uitleg: 'Jan Pieterszoon Coen maakt Batavia (Jakarta) tot hoofdkwartier van de VOC in Azië.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1587, label: '1587–1629', titel: 'Jan Pieterszoon Coen', uitleg: 'Hard en omstreden VOC-bewindvoerder ("dispereert niet"); stichter van Batavia, verantwoordelijk voor de gewelddadige verovering van de Banda-eilanden.', soort: P, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1621, titel: 'Oprichting van de WIC en boekenkist van Hugo de Groot', uitleg: 'De West-Indische Compagnie start (Atlantische handel, ook slavenhandel); Hugo de Groot ontsnapt uit Slot Loevestein in een boekenkist.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1583, label: '1583–1645', titel: 'Hugo de Groot', uitleg: 'Rechtsgeleerde, grondlegger van het volkenrecht ("Mare Liberum"); wereldberoemd door zijn ontsnapping in de boekenkist.', soort: P, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1626, titel: 'Stichting van Nieuw-Amsterdam', uitleg: 'Nederlandse kolonisten vestigen zich op Manhattan — het latere New York.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1628, titel: 'Verovering van de Zilvervloot', uitleg: 'Piet Hein kaapt bij Cuba de Spaanse zilvervloot — "zijn naam is klein, zijn daden bennen groot".', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1637, titel: 'Tulpencrash en Statenbijbel', uitleg: 'De eerste speculatiezeepbel ter wereld knapt; tegelijk verschijnt de Statenvertaling die het Nederlands mede vormde.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1642, titel: 'De Nachtwacht en de reizen van Tasman', uitleg: 'Rembrandt voltooit De Nachtwacht; Abel Tasman bereikt als eerste Europeaan Tasmanië en Nieuw-Zeeland.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1606, label: '1606–1669', titel: 'Rembrandt van Rijn', uitleg: 'Grootste schilder van de Gouden Eeuw (De Nachtwacht, talloze portretten en zelfportretten).', soort: P, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1632, label: '1632–1675', titel: 'Johannes Vermeer', uitleg: 'Delftse meester van het licht (Het meisje met de parel, Het melkmeisje).', soort: P, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1632.5, label: '1632–1677', titel: 'Baruch Spinoza', uitleg: 'Amsterdamse filosoof; zijn radicale denken over God en vrijheid maakte hem wereldberoemd én verguisd.', soort: P, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1629, label: '1629–1695', titel: 'Christiaan Huygens', uitleg: 'Natuurkundige en uitvinder van het slingeruurwerk; ontdekte de maan Titan en de ringen van Saturnus.', soort: P, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1632.7, label: '1632–1723', titel: 'Antoni van Leeuwenhoek', uitleg: 'Delftse lakenhandelaar die met zelfgeslepen microscoopjes als eerste bacteriën zag.', soort: P, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1648, titel: 'Vrede van Münster', uitleg: 'Einde van de Tachtigjarige Oorlog: Spanje en Europa erkennen de Republiek als soevereine staat.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1650, titel: 'Eerste Stadhouderloze Tijdperk', uitleg: 'Na de vroege dood van Willem II besturen de regenten ruim twintig jaar zonder stadhouder — het "Ware Vrijheid"-tijdperk van Johan de Witt.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1625, label: '1625–1672', titel: 'Johan de Witt', uitleg: 'Raadpensionaris en feitelijk leider van de Republiek op haar hoogtepunt; in het Rampjaar door een menigte gelyncht.', soort: P, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1652, label: '1652–1674', titel: 'Engelse zeeoorlogen', uitleg: 'Drie zeeoorlogen om de wereldhandel; hoogtepunt is De Ruyters Tocht naar Chatham (1667).', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1607, label: '1607–1676', titel: 'Michiel de Ruyter', uitleg: 'Beroemdste zeeheld van de Republiek ("Bestevaêr"); versloeg de Engelsen bij Chatham en sneuvelde voor Sicilië.', soort: P, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1672, titel: 'Het Rampjaar', uitleg: 'Engeland, Frankrijk, Munster en Keulen vallen aan: "het volk redeloos, de regering radeloos, het land reddeloos". De gebroeders De Witt worden vermoord; Willem III wordt stadhouder.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1688, titel: 'Glorious Revolution', uitleg: 'Stadhouder Willem III steekt over naar Engeland en wordt er koning — de Republiek en Engeland onder één leider.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1650.5, label: '1650–1702', titel: 'Stadhouder-koning Willem III', uitleg: 'Redde de Republiek in het Rampjaar en werd koning van Engeland; stierf kinderloos.', soort: P, periode: 'De Gouden Eeuw (1602–1702)' },

  // ─── Republiek in verval (1702–1795) ───
  { jaar: 1702, titel: 'Tweede Stadhouderloze Tijdperk', uitleg: 'Na de dood van Willem III blijven de meeste gewesten decennia zonder stadhouder; de Republiek teert in op haar Gouden Eeuw.', soort: G, periode: 'Republiek in verval (1702–1795)' },
  { jaar: 1713, titel: 'Vrede van Utrecht', uitleg: 'Europese vrede gesloten in Utrecht; de Republiek telt daarna internationaal steeds minder mee.', soort: G, periode: 'Republiek in verval (1702–1795)' },
  { jaar: 1668, label: '1668–1738', titel: 'Herman Boerhaave', uitleg: 'Leidse arts en hoogleraar, in zijn tijd de beroemdste medicus van Europa ("leermeester van heel Europa").', soort: P, periode: 'Republiek in verval (1702–1795)' },
  { jaar: 1747, titel: 'Willem IV erfstadhouder', uitleg: 'Onder druk van oorlog en oproer wordt het stadhouderschap erfelijk in alle gewesten.', soort: G, periode: 'Republiek in verval (1702–1795)' },
  { jaar: 1780, label: '1780–1784', titel: 'Vierde Engelse Oorlog', uitleg: 'Vernederende nederlaag op zee die het verval van de Republiek pijnlijk blootlegt.', soort: G, periode: 'Republiek in verval (1702–1795)' },
  { jaar: 1781, titel: '"Aan het Volk van Nederland"', uitleg: 'Anoniem pamflet van Joan van der Capellen: startschot van de patriottenbeweging tegen stadhouder Willem V.', soort: G, periode: 'Republiek in verval (1702–1795)' },
  { jaar: 1741, label: '1741–1784', titel: 'Joan van der Capellen tot den Pol', uitleg: 'Adellijke voorman van de patriotten; zijn pamflet mobiliseerde de burgerij tegen het stadhouderlijk bewind.', soort: P, periode: 'Republiek in verval (1702–1795)' },
  { jaar: 1787, titel: 'Pruisische inval — patriotten verslagen', uitleg: 'Na de aanhouding van prinses Wilhelmina bij Goejanverwellesluis herstelt een Pruisisch leger het gezag van Willem V; duizenden patriotten vluchten.', soort: G, periode: 'Republiek in verval (1702–1795)' },

  // ─── Bataafs-Franse tijd (1795–1813) ───
  { jaar: 1795, titel: 'Bataafse Revolutie', uitleg: 'Met Franse steun wordt de Bataafse Republiek uitgeroepen; stadhouder Willem V vlucht naar Engeland.', soort: G, periode: 'Bataafs-Franse tijd (1795–1813)' },
  { jaar: 1798, titel: 'Eerste grondwet (Staatsregeling)', uitleg: 'De eerste geschreven grondwet van Nederland: één ondeelbare staat in plaats van losse gewesten.', soort: G, periode: 'Bataafs-Franse tijd (1795–1813)' },
  { jaar: 1806, titel: 'Koninkrijk Holland', uitleg: 'Napoleon maakt zijn broer Lodewijk Napoleon koning; die toont zich verrassend betrokken ("Konijn van Olland").', soort: G, periode: 'Bataafs-Franse tijd (1795–1813)' },
  { jaar: 1778, label: '1778–1846', titel: 'Lodewijk Napoleon', uitleg: 'Franse koning van Holland (1806–1810); bezocht rampen, leerde Nederlands en werd door zijn broer afgezet omdat hij té Nederlands werd.', soort: P, periode: 'Bataafs-Franse tijd (1795–1813)' },
  { jaar: 1810, titel: 'Inlijving bij Frankrijk', uitleg: 'Nederland wordt drie jaar lang gewoon een deel van het Franse keizerrijk; dienstplicht en censuur volgen.', soort: G, periode: 'Bataafs-Franse tijd (1795–1813)' },
  { jaar: 1811, titel: 'Burgerlijke stand ingevoerd', uitleg: 'Iedereen krijgt een geregistreerde achternaam — een blijvende Franse erfenis, net als het kadaster.', soort: G, periode: 'Bataafs-Franse tijd (1795–1813)' },
  { jaar: 1813, titel: 'Willem Frederik landt in Scheveningen', uitleg: 'Na Napoleons nederlaag keert de zoon van de laatste stadhouder terug en wordt soeverein vorst.', soort: G, periode: 'Bataafs-Franse tijd (1795–1813)' },

  // ─── Koninkrijk in opbouw (1813–1914) ───
  { jaar: 1815, titel: 'Koninkrijk der Nederlanden', uitleg: 'Na Waterloo verenigt het Congres van Wenen Noord en Zuid (met België) onder koning Willem I.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1772, label: '1772–1843', titel: 'Koning Willem I', uitleg: '"Koning-koopman": bouwde kanalen, banken en industrie, maar regeerde eigenzinnig en verloor België.', soort: P, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1830, titel: 'Belgische Revolutie', uitleg: 'Het zuiden komt in opstand en scheidt zich af; een opera-voorstelling in Brussel is de vonk.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1831, titel: 'Tiendaagse Veldtocht', uitleg: 'Willem I probeert België gewapend terug te winnen: militair succes, politiek zinloos.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1839, titel: 'Erkenning van België en de eerste spoorlijn', uitleg: 'Willem I erkent België; tussen Amsterdam en Haarlem rijdt de eerste Nederlandse trein.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1848, titel: 'Grondwet van Thorbecke', uitleg: 'Koning Willem II wordt "in één nacht van conservatief liberaal": ministeriële verantwoordelijkheid en rechtstreekse verkiezingen.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1798.5, label: '1798–1872', titel: 'Johan Rudolph Thorbecke', uitleg: 'Staatsman en architect van de grondwet van 1848 — de basis van de parlementaire democratie.', soort: P, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1853, titel: 'Herstel bisschoppelijke hiërarchie', uitleg: 'Katholieken krijgen weer bisdommen; protestants protest (Aprilbeweging) laat de oude tegenstellingen zien.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1860, titel: 'Max Havelaar verschijnt', uitleg: 'Multatuli klaagt het koloniale uitbuitingssysteem op Java aan — het boek dreunt door tot in de politiek.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1820, label: '1820–1887', titel: 'Multatuli (Eduard Douwes Dekker)', uitleg: 'Schrijver van Max Havelaar; belangrijkste Nederlandse auteur van de 19e eeuw.', soort: P, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1863, titel: 'Afschaffing van de slavernij', uitleg: 'Nederland schaft de slavernij af in Suriname en op de Antillen — als een van de laatste Europese landen.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1873, label: '1873–1904', titel: 'Atjeh-oorlog', uitleg: 'Langste en bloedigste koloniale oorlog van Nederland, om de noordpunt van Sumatra.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1876, titel: 'Noordzeekanaal geopend', uitleg: 'Amsterdam krijgt een directe verbinding met zee; de haven en industrie bloeien op.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1853.5, label: '1853–1890', titel: 'Vincent van Gogh', uitleg: 'Wereldberoemd geworden ná zijn dood; schilderde in tien jaar bijna 900 doeken (De aardappeleters, Zonnebloemen).', soort: P, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1854, label: '1854–1929', titel: 'Aletta Jacobs', uitleg: 'Eerste vrouwelijke student en arts van Nederland; boegbeeld van de strijd voor vrouwenkiesrecht.', soort: P, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1837, label: '1837–1920', titel: 'Abraham Kuyper', uitleg: 'Oprichter van de eerste politieke partij (ARP, 1879) en van de Vrije Universiteit; premier en voorman van de "kleine luyden".', soort: P, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1890, titel: 'Wilhelmina wordt koningin', uitleg: 'Willem III sterft; de tienjarige Wilhelmina volgt op onder regentschap van koningin Emma. De band met Luxemburg eindigt.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1894, titel: 'Oprichting SDAP', uitleg: 'Pieter Jelles Troelstra sticht de sociaaldemocratische partij — de arbeidersbeweging wordt politieke macht.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },

  // ─── Oorlog en crisis (1914–1945) ───
  { jaar: 1914, label: '1914–1918', titel: 'Neutraal in de Eerste Wereldoorlog', uitleg: 'Nederland blijft buiten de oorlog maar mobiliseert het leger en vangt een miljoen Belgische vluchtelingen op.', soort: G, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1917, titel: 'Pacificatie van 1917', uitleg: 'Grote politieke ruil: algemeen mannenkiesrecht én gelijke bekostiging van bijzonder onderwijs.', soort: G, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1918, titel: '"Vergissing van Troelstra"', uitleg: 'Troelstra roept tevergeefs op tot revolutie; een jaar later krijgen ook vrouwen kiesrecht (1919).', soort: G, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1860.5, label: '1860–1930', titel: 'Pieter Jelles Troelstra', uitleg: 'Voorman van de sociaaldemocraten; beroemd om zijn mislukte revolutieoproep van november 1918.', soort: P, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1920, titel: 'Oprichting KLM en eerste Schiphol-jaren', uitleg: 'De oudste nog vliegende luchtvaartmaatschappij ter wereld verbindt Nederland met Indië.', soort: G, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1928, titel: 'Olympische Spelen in Amsterdam', uitleg: 'Voor het eerst brandt het olympisch vuur; Nederland presenteert zich aan de wereld.', soort: G, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1932, titel: 'Afsluitdijk voltooid', uitleg: 'De Zuiderzee wordt IJsselmeer — kroon op het plan van ingenieur Cornelis Lely.', soort: G, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1854.5, label: '1854–1929', titel: 'Cornelis Lely', uitleg: 'Ingenieur en minister; bedacht de Zuiderzeewerken en gaf zijn naam aan Lelystad.', soort: P, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1933, titel: 'Crisisjaren', uitleg: 'De wereldcrisis slaat hard toe: massawerkloosheid, steuntrekkers en het zuinige beleid van premier Colijn.', soort: G, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1940, titel: 'Duitse inval en bombardement op Rotterdam', uitleg: '10 mei 1940: inval; na het bombardement op Rotterdam (14 mei) capituleert Nederland. Wilhelmina wijkt uit naar Londen.', soort: G, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1880, label: '1880–1962', titel: 'Koningin Wilhelmina', uitleg: 'Vijftig jaar koningin; werd via Radio Oranje vanuit Londen het symbool van het verzet.', soort: P, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1941, titel: 'Februaristaking', uitleg: 'Amsterdam staakt massaal tegen de eerste razzia\'s op Joodse inwoners — uniek in bezet Europa.', soort: G, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1942, titel: 'Deportaties en onderduik', uitleg: 'De Jodenvervolging wordt systematisch: van de 140.000 Nederlandse Joden overleven er ruim 100.000 de oorlog niet. Anne Frank duikt onder in het Achterhuis.', soort: G, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1929, label: '1929–1945', titel: 'Anne Frank', uitleg: 'Haar dagboek uit het Achterhuis werd het beroemdste oorlogsdocument ter wereld; zij stierf in Bergen-Belsen.', soort: P, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1944, titel: 'Market Garden en de Hongerwinter', uitleg: 'De luchtlandingen bij Arnhem mislukken ("een brug te ver"); het westen gaat een hongerwinter in met duizenden doden.', soort: G, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1945, titel: 'Bevrijding', uitleg: '5 mei 1945: de Duitse capitulatie wordt in Wageningen getekend; Canadezen en geallieerden bevrijden het land.', soort: G, periode: 'Oorlog en crisis (1914–1945)' },

  // ─── Naoorlogs Nederland (1945–nu) ───
  { jaar: 1945.5, label: '1945–1949', titel: 'Indonesische onafhankelijkheidsoorlog', uitleg: 'Soekarno roept in 1945 de onafhankelijkheid uit; na koloniale oorlogen ("politionele acties") draagt Nederland in 1949 de soevereiniteit over.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1948, titel: 'Juliana koningin, Drees premier', uitleg: 'Wilhelmina treedt af; onder "vadertje Drees" wordt de verzorgingsstaat opgebouwd (noodwet ouderdomsvoorziening, later AOW).', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1886, label: '1886–1988', titel: 'Willem Drees', uitleg: 'Premier 1948–1958 en vader van de AOW; voor velen de beste premier van de 20e eeuw.', soort: P, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1949, titel: 'Nederland medeoprichter van de NAVO', uitleg: 'Definitief afscheid van de neutraliteitspolitiek; Nederland kiest voor het westerse bondgenootschap.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1953, titel: 'Watersnoodramp', uitleg: '1 februari 1953: springtij en storm breken de Zeeuwse en Zuid-Hollandse dijken; 1836 doden. Het Deltaplan volgt.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1957, titel: 'Verdrag van Rome — EEG', uitleg: 'Nederland is medeoprichter van de Europese Economische Gemeenschap, voorloper van de EU.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1959, titel: 'Aardgas gevonden in Slochteren', uitleg: 'Een van de grootste gasvelden ter wereld maakt Nederland rijk — en Groningen decennia later gedupeerd.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1965, label: '1965–1967', titel: 'Provo en de jaren zestig', uitleg: 'Ludiek protest in Amsterdam; ontzuiling, televisie en jongerencultuur veranderen het land in hoog tempo.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1973, titel: 'Oliecrisis en autoloze zondagen', uitleg: 'Arabisch olie-embargo; premier Den Uyl maant tot zuinigheid, Nederlanders picknicken op de snelweg.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1974, titel: 'WK-finale verloren van West-Duitsland', uitleg: 'Het "totaalvoetbal" van Cruijff verovert de wereld maar verliest de finale — een nationaal trauma.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1947, label: '1947–2016', titel: 'Johan Cruijff', uitleg: 'Grootste Nederlandse voetballer ooit; nummer 14, drievoudig winnaar van de Ballon d\'Or.', soort: P, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1975, titel: 'Suriname onafhankelijk', uitleg: '25 november 1975; honderdduizenden Surinamers kiezen voor Nederland.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1977, titel: 'Molukse treinkapingen', uitleg: 'Gijzelingen bij Wijster (1975) en De Punt (1977) vragen gewelddadig aandacht voor het Molukse ideaal.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1980, titel: 'Beatrix koningin', uitleg: 'Troonswisseling in Amsterdam te midden van krakersrellen: "geen woning, geen kroning".', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1986, titel: 'Oosterscheldekering en Flevoland', uitleg: 'Het pronkstuk van de Deltawerken gaat open; Flevoland wordt de twaalfde provincie.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1992, titel: 'Verdrag van Maastricht', uitleg: 'In Maastricht wordt de Europese Unie opgericht en de euro afgesproken.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1995, titel: 'Evacuatie van het rivierengebied', uitleg: 'Extreem hoogwater dwingt 250.000 mensen hun huis uit; aanleiding voor "Ruimte voor de Rivier".', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 2001, titel: 'Eerste homohuwelijk ter wereld', uitleg: 'Nederland stelt als eerste land het burgerlijk huwelijk open voor paren van gelijk geslacht.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 2002, titel: 'Euro en de moord op Pim Fortuyn', uitleg: 'De gulden verdwijnt; negen dagen voor de verkiezingen wordt Pim Fortuyn vermoord — een politieke aardverschuiving volgt.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1948.5, label: '1948–2002', titel: 'Pim Fortuyn', uitleg: 'Flamboyante politicus die het politieke bestel opschudde; vermoord door een milieuactivist.', soort: P, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 2004, titel: 'Moord op Theo van Gogh', uitleg: 'De filmmaker wordt op straat in Amsterdam vermoord; het debat over islam en vrijheid van meningsuiting verhardt.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 2013, titel: 'Willem-Alexander koning', uitleg: 'Beatrix treedt af; voor het eerst in 123 jaar heeft Nederland weer een koning.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 2014, titel: 'Ramp met vlucht MH17', uitleg: 'Boven Oost-Oekraïne wordt een passagierstoestel neergeschoten: 298 doden, onder wie 196 Nederlanders.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 2010, label: '2010–2024', titel: 'De kabinetten-Rutte', uitleg: 'Mark Rutte wordt de langstzittende premier van Nederland (VVD, vier kabinetten).', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 2020, titel: 'Coronapandemie', uitleg: 'Lockdowns, avondklok (en rellen daartegen); de grootste maatschappelijke ingreep sinds de oorlog.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
]

// Tweede laag: verdieping bij "uitgebreid" — samen met ITEMS ±150 items.
export const EXTRA: HistItem[] = [
  { jaar: 1349, label: '1349–1351', titel: 'De Zwarte Dood', uitleg: 'De pest bereikt de Lage Landen en keert nadien telkens terug; steden verliezen soms een derde van hun inwoners.', soort: G, periode: 'Late middeleeuwen (1300–1515)' },
  { jaar: 1433, label: '1433–1477', titel: 'Karel de Stoute', uitleg: 'Eerzuchtige Bourgondische hertog die van zijn landen één koninkrijk wilde smeden; sneuvelde bij Nancy.', soort: P, periode: 'Late middeleeuwen (1300–1515)' },
  { jaar: 1540, titel: 'Gent vernederd (stroppendragers)', uitleg: 'Karel V straft zijn opstandige geboortestad: notabelen moeten met een strop om de nek om genade smeken.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1550, titel: 'Bloedplakkaten', uitleg: 'Ketterij wordt met de dood bestraft — de vervolging van protestanten wordt op scherp gezet.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1566.5, titel: 'Smeekschrift der Edelen', uitleg: 'Lage edelen vragen Margaretha van Parma de vervolging te matigen; het scheldwoord "geuzen" wordt een erenaam.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1575, titel: 'Universiteit Leiden opgericht', uitleg: 'De eerste universiteit van de Noordelijke Nederlanden — Leidens beloning voor het doorstane beleg.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1595, titel: 'Eerste Schipvaart naar Indië', uitleg: 'Cornelis de Houtman vaart om de Kaap naar Java; het begin van de Nederlandse Azië-handel.', soort: G, periode: 'Habsburg en Opstand (1515–1602)' },
  { jaar: 1587.5, label: '1587–1679', titel: 'Joost van den Vondel', uitleg: 'De "prins der dichters" (Gijsbrecht van Aemstel, Lucifer); naamgever van het Vondelpark.', soort: P, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1584.5, label: '1584–1647', titel: 'Frederik Hendrik', uitleg: 'De "stedendwinger": stadhouder die met belegeringen (Den Bosch, Breda) het grondgebied afrondde.', soort: P, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1609.5, titel: 'Wisselbank en de Hudson', uitleg: 'De Amsterdamse Wisselbank maakt de stad het financiële centrum van Europa; Henry Hudson verkent in VOC-dienst de rivier bij het latere New York.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1613, titel: 'Aanleg grachtengordel', uitleg: 'Amsterdam begint aan de beroemde uitbreiding met Heren-, Keizers- en Prinsengracht.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1620, titel: 'Pilgrim Fathers vertrekken uit Leiden', uitleg: 'Engelse puriteinen die jaren in Leiden woonden, zeilen met de Mayflower naar Amerika.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1629, titel: 'Verovering van Den Bosch', uitleg: 'Frederik Hendrik neemt de "onneembare" vestingstad — een keerpunt in de oorlog.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1634, titel: 'Curaçao veroverd', uitleg: 'De WIC neemt Curaçao op de Spanjaarden; de Antillen blijven tot vandaag bij het Koninkrijk.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1639, titel: 'Slag bij Duins', uitleg: 'Maarten Tromp vernietigt een Spaanse armada voor de Engelse kust; Spanje is als zeemacht uitgeschakeld.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1641, titel: 'Monopolie op Japan (Decima)', uitleg: 'De VOC wordt als enige westerse partij toegelaten tot Japan, via het eilandje Decima bij Nagasaki.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1652.5, titel: 'Stichting van de Kaapkolonie', uitleg: 'Jan van Riebeeck sticht een verversingspost aan de Kaap — het begin van Zuid-Afrikaʼs Nederlandse geschiedenis (en van het Afrikaans).', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1674, titel: 'Nieuw-Nederland definitief Engels', uitleg: 'Bij de vrede na de derde Engelse oorlog blijft Nieuw-Amsterdam Engels: New York; de Republiek houdt Suriname.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1685, titel: 'Hugenoten vluchten naar de Republiek', uitleg: 'Tienduizenden Franse protestanten vinden een veilige haven en versterken economie en cultuur.', soort: G, periode: 'De Gouden Eeuw (1602–1702)' },
  { jaar: 1740, label: '1740–1805', titel: 'Belle van Zuylen', uitleg: 'Schrijfster en vrijdenker uit Utrecht ("Ik heb geen talent voor ondergeschiktheid").', soort: P, periode: 'Republiek in verval (1702–1795)' },
  { jaar: 1797, titel: 'Slag bij Camperduin', uitleg: 'De Bataafse vloot wordt door de Engelsen vernietigd — het einde van Nederland als grote zeemacht.', soort: G, periode: 'Bataafs-Franse tijd (1795–1813)' },
  { jaar: 1799, titel: 'VOC opgeheven; invasie afgeslagen', uitleg: 'De failliete VOC wordt genationaliseerd; een Brits-Russische landing in Noord-Holland wordt afgeslagen.', soort: G, periode: 'Bataafs-Franse tijd (1795–1813)' },
  { jaar: 1824, titel: 'Nederlandsche Handel-Maatschappij', uitleg: 'Willem I richt de NHM op om de koloniale handel aan te jagen — motor achter het latere Cultuurstelsel.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1834, titel: 'De Afscheiding', uitleg: 'Orthodoxe gereformeerden breken met de hervormde kerk; velen emigreren later naar Amerika.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1792, label: '1792–1849', titel: 'Koning Willem II', uitleg: 'Held van Waterloo die in 1848 "in één nacht van conservatief liberaal" werd en de nieuwe grondwet toestond.', soort: P, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1870, titel: 'Doodstraf afgeschaft', uitleg: 'Nederland schaft als een van de eerste landen de doodstraf in vredestijd af.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1874, titel: 'Kinderwetje van Van Houten', uitleg: 'Eerste sociale wet: kinderen onder de twaalf mogen niet meer in fabrieken werken.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1885, titel: 'Rijksmuseum geopend', uitleg: 'Cuypers\' "kathedraal voor de kunst" in Amsterdam krijgt De Nachtwacht als middelpunt.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1891, titel: 'Philips opgericht', uitleg: 'Gloeilampenfabriekje in Eindhoven groeit uit tot wereldconcern — symbool van de late industrialisatie.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1900, titel: 'Leerplichtwet', uitleg: 'Alle kinderen van 6 tot 12 jaar moeten naar school.', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1903, titel: 'Spoorwegstakingen', uitleg: 'Solidariteitsstakingen leggen het land plat; de regering-Kuyper breekt ze met de "worgwetten".', soort: G, periode: 'Koninkrijk in opbouw (1813–1914)' },
  { jaar: 1916, titel: 'Zuiderzeevloed', uitleg: 'Overstroming rond de Zuiderzee; directe aanleiding voor de Zuiderzeewet (1918) en de Afsluitdijk.', soort: G, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1931, titel: 'Oprichting NSB', uitleg: 'Anton Mussert sticht de Nationaal-Socialistische Beweging; in de oorlog collaborateur, na de oorlog geëxecuteerd.', soort: G, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1939, titel: 'Mobilisatie en kamp Westerbork', uitleg: 'Nederland mobiliseert; vluchtelingenkamp Westerbork wordt gebouwd — in de oorlog door de bezetter als doorgangskamp gebruikt.', soort: G, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1943, titel: 'April-meistakingen', uitleg: 'Massale stakingen tegen het terugvoeren van Nederlandse militairen in krijgsgevangenschap; tientallen doden.', soort: G, periode: 'Oorlog en crisis (1914–1945)' },
  { jaar: 1909, label: '1909–2004', titel: 'Koningin Juliana', uitleg: 'De "fietsende koningin" (1948–1980): informeel, sociaal bewogen, geliefd.', soort: P, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1911, label: '1911–1995', titel: 'Annie M.G. Schmidt', uitleg: 'Schreef Jip en Janneke, Pluk van de Petteflet en Ja zuster, nee zuster — de "echte koningin van Nederland".', soort: P, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1951, titel: 'Eerste televisie-uitzending', uitleg: 'Nederland krijgt tv; het toestel verovert in tien jaar de huiskamer en breekt de verzuiling open.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1956, titel: 'AOW ingevoerd', uitleg: 'Drees geeft elke oudere een staatspensioen — de kroon op de opbouw van de verzorgingsstaat.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1962, titel: 'Nieuw-Guinea overgedragen', uitleg: 'Na jaren conflict met Indonesië geeft Nederland zijn laatste Aziatische kolonie op.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1976, titel: 'Lockheed-affaire', uitleg: 'Prins Bernhard blijkt steekpenningen te hebben aangenomen; hij moet al zijn militaire functies neerleggen.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1988, titel: 'Europees kampioen voetbal', uitleg: 'Van Basten, Gullit en Koeman winnen het EK in Duitsland — de grootste sportzege ooit; het land kleurt oranje.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1994, titel: 'Eerste paarse kabinet', uitleg: 'PvdA, VVD en D66 regeren voor het eerst sinds 1918 zonder confessionele partijen (Kok I).', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 1995.5, titel: 'Val van Srebrenica', uitleg: 'De door Dutchbat beschermde enclave valt; ruim 8000 moslimmannen worden vermoord. Het kabinet-Kok II treedt er in 2002 om af.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 2000, titel: 'Vuurwerkramp Enschede', uitleg: 'Een vuurwerkopslag ontploft midden in een woonwijk: 23 doden, een wijk weggevaagd.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 2005, titel: '"Nee" tegen de Europese Grondwet', uitleg: 'Bij het eerste nationale referendum sinds 1805 stemt ruim 61% tegen — een schok voor Den Haag en Brussel.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 2008, titel: 'Kredietcrisis', uitleg: 'De staat redt ABN AMRO en steunt ING; een diepe recessie en jaren van bezuinigingen volgen.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
  { jaar: 2019, titel: 'Stikstofcrisis en boerenprotesten', uitleg: 'De Raad van State zet een streep door het stikstofbeleid; trekkers rijden massaal naar het Malieveld.', soort: G, periode: 'Naoorlogs Nederland (1945–nu)' },
]

export const ALLES: HistItem[] = [...ITEMS, ...EXTRA]

// Weergavejaar (afgerond, want sommige sorteersleutels hebben decimalen om
// gelijke jaren te ontdubbelen)
export function jaarLabel(item: HistItem): string {
  return item.label ?? String(Math.floor(item.jaar))
}

export const GESORTEERD = [...ALLES].sort((a, b) => a.jaar - b.jaar)
