// Beknopte geschiedenis van Europa: wie had wanneer de macht, en waar.
// Bewust algemeen gehouden — hoofdlijnen, geen detailgeschiedenis.
export type Tijdvak = 'Oudheid (vóór Rome)' | 'Rome' | 'Middeleeuwen' | 'Vroegmoderne tijd' | 'Moderne tijd'

export type Macht = {
  id: string
  periode: string
  // beginjaar voor sortering en "wat kwam eerder"-vragen (negatief = v.Chr.)
  start: number
  macht: string
  gebied: string
  uitleg: string
  tijdvak: Tijdvak
}

export const MACHTEN: Macht[] = [
  // ── Oudheid, vóór Rome ──
  { id: 'minoers', periode: '±2000–1450 v.Chr.', start: -2000, macht: 'Minoërs', gebied: 'Kreta', uitleg: 'Eerste hoogontwikkelde beschaving van Europa, met paleizen als Knossos.', tijdvak: 'Oudheid (vóór Rome)' },
  { id: 'myceners', periode: '±1600–1100 v.Chr.', start: -1600, macht: 'Myceners', gebied: 'Griekenland', uitleg: 'Vroege Griekse paleiscultuur; de wereld van de Trojaanse-oorlogverhalen.', tijdvak: 'Oudheid (vóór Rome)' },
  { id: 'feniciers', periode: '±1100–600 v.Chr.', start: -1100, macht: 'Feniciërs', gebied: 'Kusten van de Middellandse Zee', uitleg: 'Handelsvolk uit de Levant; stichtte kolonies waaronder Carthago en gaf ons het alfabet.', tijdvak: 'Oudheid (vóór Rome)' },
  { id: 'kelten', periode: '±800–50 v.Chr.', start: -800, macht: 'Kelten', gebied: 'West- en Midden-Europa', uitleg: 'Stammenvolken van Ierland tot de Donau; uiteindelijk door Rome en Germanen verdrongen.', tijdvak: 'Oudheid (vóór Rome)' },
  { id: 'stadstaten', periode: '±800–338 v.Chr.', start: -799, macht: 'Griekse stadstaten', gebied: 'Griekenland en kolonies', uitleg: 'Athene (democratie) en Sparta; bakermat van filosofie, theater en wetenschap.', tijdvak: 'Oudheid (vóór Rome)' },
  { id: 'perzen', periode: '±550–479 v.Chr.', start: -550, macht: 'Perzische Rijk', gebied: 'Dreiging vanuit het oosten', uitleg: 'Probeerde Griekenland te veroveren; verslagen bij Marathon en Salamis.', tijdvak: 'Oudheid (vóór Rome)' },
  { id: 'carthago', periode: '±650–146 v.Chr.', start: -650, macht: 'Carthago', gebied: 'Westelijke Middellandse Zee', uitleg: 'Fenicische handelsmacht; verloor de Punische oorlogen van Rome ondanks Hannibals olifantentocht over de Alpen.', tijdvak: 'Oudheid (vóór Rome)' },
  { id: 'alexander', periode: '336–323 v.Chr.', start: -336, macht: 'Alexander de Grote (Macedonië)', gebied: 'Griekenland tot aan India', uitleg: 'Veroverde het Perzische Rijk en verspreidde de Griekse cultuur (hellenisme).', tijdvak: 'Oudheid (vóór Rome)' },

  // ── Rome ──
  { id: 'republiek', periode: '509–27 v.Chr.', start: -509, macht: 'Romeinse Republiek', gebied: 'Italië → hele Middellandse Zee', uitleg: 'Senaat en consuls; Julius Caesar veroverde Gallië en maakte feitelijk een einde aan de republiek.', tijdvak: 'Rome' },
  { id: 'keizerrijk', periode: '27 v.Chr.–476 n.Chr.', start: -27, macht: 'Romeinse Keizerrijk', gebied: 'Van Schotland tot Syrië', uitleg: 'Augustus werd de eerste keizer; eeuwenlang bracht de Pax Romana wegen, steden en recht.', tijdvak: 'Rome' },
  { id: 'splitsing', periode: '395', start: 395, macht: 'Splitsing van het Romeinse Rijk', gebied: 'West en Oost', uitleg: 'Het rijk werd definitief gedeeld in een West- en Oost-Romeins deel.', tijdvak: 'Rome' },
  { id: 'val-rome', periode: '476', start: 476, macht: 'Val van West-Rome', gebied: 'West-Europa', uitleg: 'Germaanse volksverhuizingen; op de puinhopen ontstonden Germaanse koninkrijken.', tijdvak: 'Rome' },

  // ── Middeleeuwen ──
  { id: 'byzantium', periode: '395–1453', start: 396, macht: 'Byzantijnse Rijk', gebied: 'Balkan en Klein-Azië', uitleg: 'Het Oost-Romeinse Rijk rond Constantinopel; hoogtepunt onder keizer Justinianus.', tijdvak: 'Middeleeuwen' },
  { id: 'clovis', periode: '±481–511', start: 481, macht: 'Clovis (Franken)', gebied: 'Gallië (Frankrijk)', uitleg: 'Verenigde de Frankische stammen en werd de eerste katholieke koning van het rijk.', tijdvak: 'Middeleeuwen' },
  { id: 'moren', periode: '711–1492', start: 711, macht: 'Moren (islamitisch Spanje)', gebied: 'Iberisch schiereiland', uitleg: 'Al-Andalus met bloeiend Córdoba; de christelijke Reconquista eindigde in 1492 met de val van Granada.', tijdvak: 'Middeleeuwen' },
  { id: 'karel', periode: '768–814', start: 768, macht: 'Karel de Grote', gebied: 'West- en Midden-Europa', uitleg: 'Frankische koning, in 800 tot keizer gekroond; "vader van Europa".', tijdvak: 'Middeleeuwen' },
  { id: 'vikingen', periode: '±800–1050', start: 800, macht: 'Vikingen', gebied: 'Scandinavië, kusten van heel Europa', uitleg: 'Plunderaars én handelaars/kolonisten: Normandië, Engeland (Danelaw) en het Kievse Rijk.', tijdvak: 'Middeleeuwen' },
  { id: 'hrr', periode: '962–1806', start: 962, macht: 'Heilige Roomse Rijk', gebied: 'Duitsland en Midden-Europa', uitleg: 'Gekroond keizerschap vanaf Otto I; een lappendeken van honderden staatjes.', tijdvak: 'Middeleeuwen' },
  { id: 'willem-veroveraar', periode: '1066', start: 1066, macht: 'Willem de Veroveraar (Normandiërs)', gebied: 'Engeland', uitleg: 'Won de Slag bij Hastings; Normandische adel ging Engeland besturen.', tijdvak: 'Middeleeuwen' },
  { id: 'kruistochten', periode: '1096–1291', start: 1096, macht: 'Kruisvaarders', gebied: 'Vanuit heel Europa naar het Heilige Land', uitleg: 'Reeks door de paus gesteunde veldtochten; grote invloed op handel en contact met het oosten.', tijdvak: 'Middeleeuwen' },
  { id: 'mongolen', periode: '1237–1480', start: 1237, macht: 'Mongolen (Gouden Horde)', gebied: 'Rusland en Oost-Europa', uitleg: 'Verwoestende invallen; Russische vorstendommen eeuwenlang schatplichtig.', tijdvak: 'Middeleeuwen' },
  { id: 'honderdjarige', periode: '1337–1453', start: 1337, macht: 'Engeland vs. Frankrijk', gebied: 'Frankrijk', uitleg: 'De Honderdjarige Oorlog om de Franse troon; Jeanne d\'Arc keerde het tij.', tijdvak: 'Middeleeuwen' },
  { id: 'bourgondie', periode: '1384–1477', start: 1384, macht: 'Bourgondische hertogen', gebied: 'De Lage Landen', uitleg: 'Verenigden de Nederlandse gewesten onder één vorstenhuis; basis van "de Nederlanden".', tijdvak: 'Middeleeuwen' },
  { id: 'ottomanen', periode: '1453–1922', start: 1453, macht: 'Ottomaanse Rijk', gebied: 'Balkan en Zuidoost-Europa', uitleg: 'Veroverde Constantinopel (1453) en stond tweemaal voor Wenen (1529, 1683).', tijdvak: 'Middeleeuwen' },

  // ── Vroegmoderne tijd ──
  { id: 'habsburg-spanje', periode: '1516–1659', start: 1516, macht: 'Habsburgs Spanje (Karel V, Filips II)', gebied: 'Spanje, Nederlanden, Italië + koloniën', uitleg: 'Wereldrijk "waarin de zon nooit onderging"; tegenstander van de Nederlandse Opstand.', tijdvak: 'Vroegmoderne tijd' },
  { id: 'reformatie', periode: '1517', start: 1517, macht: 'Reformatie', gebied: 'Noord- en West-Europa', uitleg: 'Luther spijkerde zijn stellingen aan; Europa splitste in katholiek en protestant, met godsdienstoorlogen tot gevolg.', tijdvak: 'Vroegmoderne tijd' },
  { id: 'habsburg-oostenrijk', periode: '1526–1918', start: 1526, macht: 'Oostenrijkse Habsburgers', gebied: 'Midden-Europa (Donaumonarchie)', uitleg: 'Eeuwenlange dynastie in Wenen; Maria Theresia als bekendste vorstin.', tijdvak: 'Vroegmoderne tijd' },
  { id: 'westfalen', periode: '1618–1648', start: 1618, macht: 'Dertigjarige Oorlog → Vrede van Westfalen', gebied: 'Duitsland / heel Europa', uitleg: 'Verwoestende godsdienstoorlog; de vrede van 1648 legde de basis voor soevereine staten (en erkende de Republiek).', tijdvak: 'Vroegmoderne tijd' },
  { id: 'republiek-nl', periode: '±1600–1700', start: 1600, macht: 'Republiek der Zeven Verenigde Nederlanden', gebied: 'Nederland, wereldzeeën', uitleg: 'Gouden Eeuw: grootste handelsvloot ter wereld, VOC en wetenschappelijke bloei.', tijdvak: 'Vroegmoderne tijd' },
  { id: 'lodewijk14', periode: '1643–1715', start: 1643, macht: 'Lodewijk XIV ("Zonnekoning")', gebied: 'Frankrijk, dominant op het continent', uitleg: 'Absoluut vorst in Versailles; voerde bijna onafgebroken oorlog, ook tegen de Republiek (1672).', tijdvak: 'Vroegmoderne tijd' },
  { id: 'peter', periode: '1682–1725', start: 1682, macht: 'Peter de Grote (Rusland)', gebied: 'Rusland → Europese grootmacht', uitleg: 'Moderniseerde Rusland naar westers voorbeeld en stichtte Sint-Petersburg.', tijdvak: 'Vroegmoderne tijd' },
  { id: 'pruisen', periode: '1701–1871', start: 1701, macht: 'Pruisen', gebied: 'Noord-Duitsland', uitleg: 'Militaire staat van de Hohenzollerns; Frederik de Grote maakte het een grootmacht.', tijdvak: 'Vroegmoderne tijd' },
  { id: 'brits-rijk', periode: '±1700–1900', start: 1700, macht: 'Groot-Brittannië', gebied: 'Zeemacht met wereldwijde koloniën', uitleg: 'Heerste na 1763 over de zeeën; in de 19e eeuw het grootste rijk ooit (Victoria).', tijdvak: 'Vroegmoderne tijd' },

  // ── Moderne tijd ──
  { id: 'revolutie', periode: '1789', start: 1789, macht: 'Franse Revolutie', gebied: 'Frankrijk → heel Europa', uitleg: 'Einde van het absolute koningschap; vrijheid, gelijkheid en broederschap als nieuw ideaal.', tijdvak: 'Moderne tijd' },
  { id: 'napoleon', periode: '1799–1815', start: 1799, macht: 'Napoleon Bonaparte', gebied: 'Vrijwel heel continentaal Europa', uitleg: 'Kroonde zichzelf tot keizer en hervormde Europa (wetboek); definitief verslagen bij Waterloo.', tijdvak: 'Moderne tijd' },
  { id: 'wenen', periode: '1815', start: 1815, macht: 'Congres van Wenen', gebied: 'Heel Europa', uitleg: 'Grootmachten herordenden de kaart; een eeuw van relatieve machtsbalans volgde.', tijdvak: 'Moderne tijd' },
  { id: 'bismarck', periode: '1871', start: 1871, macht: 'Duitse Keizerrijk (Bismarck)', gebied: 'Duitsland', uitleg: 'Pruisen verenigde Duitsland na de zege op Frankrijk; nieuwe grootmacht in het hart van Europa.', tijdvak: 'Moderne tijd' },
  { id: 'wo1', periode: '1914–1918', start: 1914, macht: 'Eerste Wereldoorlog', gebied: 'Heel Europa', uitleg: 'Vier keizerrijken verdwenen: het Duitse, Oostenrijks-Hongaarse, Russische en Ottomaanse.', tijdvak: 'Moderne tijd' },
  { id: 'sovjet', periode: '1922–1991', start: 1922, macht: 'Sovjet-Unie', gebied: 'Rusland, na 1945 heel Oost-Europa', uitleg: 'Communistische wereldmacht; hield Oost-Europa achter het IJzeren Gordijn.', tijdvak: 'Moderne tijd' },
  { id: 'nazi', periode: '1933–1945', start: 1933, macht: 'Nazi-Duitsland', gebied: 'Bezet groot deel van Europa', uitleg: 'Hitlers dictatuur ontketende de Tweede Wereldoorlog en de Holocaust.', tijdvak: 'Moderne tijd' },
  { id: 'koude-oorlog', periode: '1945–1989', start: 1945, macht: 'Koude Oorlog: VS vs. Sovjet-Unie', gebied: 'Europa in twee blokken', uitleg: 'NAVO tegenover Warschaupact; de Berlijnse Muur als symbool, gevallen in 1989.', tijdvak: 'Moderne tijd' },
  { id: 'eu', periode: '1951–nu', start: 1951, macht: 'Europese eenwording (EU)', gebied: 'Steeds groter deel van Europa', uitleg: 'Van Kolen- en Staalgemeenschap naar Europese Unie; na 1989 uitgebreid naar het oosten.', tijdvak: 'Moderne tijd' },
]

export const TIJDVAKKEN: Tijdvak[] = ['Oudheid (vóór Rome)', 'Rome', 'Middeleeuwen', 'Vroegmoderne tijd', 'Moderne tijd']
