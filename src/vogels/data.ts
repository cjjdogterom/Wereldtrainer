// Veertig veelvoorkomende Nederlandse vogels: uiterlijk en geluid.
// Foto's: Wikipedia; geluiden: Wikimedia Commons (gestreamd).
import { MEDIA } from './media'

export type Categorie = 'Tuin & stad' | 'Bos & park' | 'Water' | 'Weide & kust' | 'Roofvogels'

export type Vogel = {
  id: string
  naam: string
  latijn: string
  categorie: Categorie
  uiterlijk: string
  geluid: string
  foto?: string
  geluidUrl?: string
  geluidPagina?: string
}

type Basis = Omit<Vogel, 'foto' | 'geluidUrl' | 'geluidPagina'>

const BASIS: Basis[] = [
  { id: 'huismus', naam: 'Huismus', latijn: 'Passer domesticus', categorie: 'Tuin & stad', uiterlijk: 'Bruin-grijs, gedrongen; het mannetje heeft een grijze kruin en zwarte bef.', geluid: 'Vrolijk, druk getsjilp — "tsjilp tsjilp", vaak in groepen.' },
  { id: 'merel', naam: 'Merel', latijn: 'Turdus merula', categorie: 'Tuin & stad', uiterlijk: 'Mannetje gitzwart met oranjegele snavel en oogring; vrouwtje donkerbruin.', geluid: 'Melodieuze, rustige fluitzang vanaf een dak of boomtop, vooral in de schemering.' },
  { id: 'roodborst', naam: 'Roodborst', latijn: 'Erithacus rubecula', categorie: 'Tuin & stad', uiterlijk: 'Klein en bol, met oranjerode borst en gezicht; bruine rug.', geluid: 'Parelende, wat weemoedige zang; zingt ook in de winter. Tikkend "tik-tik" als alarm.' },
  { id: 'koolmees', naam: 'Koolmees', latijn: 'Parus major', categorie: 'Tuin & stad', uiterlijk: 'Gele borst met zwarte stropdas, zwarte kop met witte wangen.', geluid: 'Helder tweetonig "ti-ta ti-ta" ("fietspomp"), plus veel andere roepjes.' },
  { id: 'pimpelmees', naam: 'Pimpelmees', latijn: 'Cyanistes caeruleus', categorie: 'Tuin & stad', uiterlijk: 'Kleiner dan de koolmees; blauw petje, blauwe vleugels, gele borst.', geluid: 'Hoog, zilverig riedeltje: "tsie-tsie-tsirrrr".' },
  { id: 'vink', naam: 'Vink', latijn: 'Fringilla coelebs', categorie: 'Tuin & stad', uiterlijk: 'Mannetje met roze borst, blauwgrijze kop en opvallende witte vleugelstrepen.', geluid: 'Krachtige, aflopende "vinkenslag" die eindigt in een zwierige krul.' },
  { id: 'winterkoning', naam: 'Winterkoning', latijn: 'Troglodytes troglodytes', categorie: 'Tuin & stad', uiterlijk: 'Piepklein bruin bolletje met opgewipt staartje.', geluid: 'Verrassend luide, ratelende zang voor zo\'n klein vogeltje.' },
  { id: 'spreeuw', naam: 'Spreeuw', latijn: 'Sturnus vulgaris', categorie: 'Tuin & stad', uiterlijk: 'Zwart met metaalglans en lichte spikkels; korte staart, spitse snavel.', geluid: 'Kwetterende mix van fluittonen en imitaties — bootst zelfs wekkers en buizerds na.' },
  { id: 'ekster', naam: 'Ekster', latijn: 'Pica pica', categorie: 'Tuin & stad', uiterlijk: 'Onmiskenbaar zwart-wit met lange, groenglanzende staart.', geluid: 'Droog, ratelend "tsjak-tsjak-tsjak".' },
  { id: 'kauw', naam: 'Kauw', latijn: 'Coloeus monedula', categorie: 'Tuin & stad', uiterlijk: 'Kleine kraai met grijze nek en opvallend lichtblauwe ogen.', geluid: 'Kort, helder "kja!" of "kauw!", vaak in vlucht en in groepen.' },
  { id: 'zwarte-kraai', naam: 'Zwarte kraai', latijn: 'Corvus corone', categorie: 'Tuin & stad', uiterlijk: 'Geheel zwart, forse snavel; meestal alleen of in paren.', geluid: 'Rauw, luid "kraa kraa kraa".' },
  { id: 'gaai', naam: 'Gaai', latijn: 'Garrulus glandarius', categorie: 'Bos & park', uiterlijk: 'Rozebruin met felblauwe vleugelveldjes en zwarte snorstreep.', geluid: 'Schorre, krijsende alarmroep; kan ook andere vogels nadoen.' },
  { id: 'houtduif', naam: 'Houtduif', latijn: 'Columba palumbus', categorie: 'Tuin & stad', uiterlijk: 'Grote grijze duif met witte halsvlek en witte vleugelbanden in vlucht.', geluid: 'Vijflettergrepig gekoer: "roe-koe-koe, roe-koe".' },
  { id: 'turkse-tortel', naam: 'Turkse tortel', latijn: 'Streptopelia decaocto', categorie: 'Tuin & stad', uiterlijk: 'Slanke beige duif met smal zwart nekbandje.', geluid: 'Drielettergrepig, eentonig "koe-KOE-koe".' },
  { id: 'putter', naam: 'Putter', latijn: 'Carduelis carduelis', categorie: 'Tuin & stad', uiterlijk: 'Kleurig: rood gezicht, zwart-witte kop, brede gele vleugelstreep.', geluid: 'Tinkelend, vrolijk "stiglit" — klinkt als belletjes.' },
  { id: 'zanglijster', naam: 'Zanglijster', latijn: 'Turdus philomelos', categorie: 'Bos & park', uiterlijk: 'Bruin met roomwitte, gestippelde borst; kleiner dan de merel.', geluid: 'Herhaalt elk motief twee tot vier keer — hét kenmerk van de zang.' },
  { id: 'tjiftjaf', naam: 'Tjiftjaf', latijn: 'Phylloscopus collybita', categorie: 'Bos & park', uiterlijk: 'Klein en onopvallend groenbruin, donkere pootjes.', geluid: 'Zegt zijn eigen naam: "tjif-tjaf-tjif-tjaf".' },
  { id: 'fitis', naam: 'Fitis', latijn: 'Phylloscopus trochilus', categorie: 'Bos & park', uiterlijk: 'Vrijwel identiek aan de tjiftjaf, maar met lichte pootjes.', geluid: 'Zacht, weemoedig aflopend riedeltje — heel anders dan de tjiftjaf.' },
  { id: 'zwartkop', naam: 'Zwartkop', latijn: 'Sylvia atricapilla', categorie: 'Bos & park', uiterlijk: 'Grijs zangvogeltje; mannetje met zwart, vrouwtje met bruin petje.', geluid: 'Rijke, heldere fluitzang die begint met gekras en eindigt in jubelen.' },
  { id: 'boerenzwaluw', naam: 'Boerenzwaluw', latijn: 'Hirundo rustica', categorie: 'Weide & kust', uiterlijk: 'Blauwzwart met rode keel en lange, diep gevorkte staart.', geluid: 'Snel, babbelend gekwetter, vaak in de vlucht.' },
  { id: 'gierzwaluw', naam: 'Gierzwaluw', latijn: 'Apus apus', categorie: 'Tuin & stad', uiterlijk: 'Sikkelvormige vleugels, geheel donker; vliegt vrijwel altijd.', geluid: 'Doordringend gierend "srie-srie" van groepen boven de stad op zomeravonden.' },
  { id: 'grote-bonte-specht', naam: 'Grote bonte specht', latijn: 'Dendrocopos major', categorie: 'Bos & park', uiterlijk: 'Zwart-wit met vuurrode onderstaart; mannetje met rode nekvlek.', geluid: 'Kort scherp "kik!"; in het voorjaar de bekende roffel op dode takken.' },
  { id: 'groene-specht', naam: 'Groene specht', latijn: 'Picus viridis', categorie: 'Bos & park', uiterlijk: 'Groen met gele stuit en rode kruin; zit vaak op de grond (mieren).', geluid: 'Luide lachende roep: "kju-kju-kju" — de "lach" van het bos.' },
  { id: 'staartmees', naam: 'Staartmees', latijn: 'Aegithalos caudatus', categorie: 'Bos & park', uiterlijk: 'Wit-roze bolletje met extreem lange staart; altijd in groepjes.', geluid: 'Fijne, hoge contactroepjes: "tsie-tsie-tsie" en droog "prrrt".' },
  { id: 'boomklever', naam: 'Boomklever', latijn: 'Sitta europaea', categorie: 'Bos & park', uiterlijk: 'Blauwgrijze rug, oranje buik, zwarte oogstreep; loopt als enige óók omlaag langs stammen.', geluid: 'Luid fluitend "tuu-tuu-tuu" en een snelle triller.' },
  { id: 'wilde-eend', naam: 'Wilde eend', latijn: 'Anas platyrhynchos', categorie: 'Water', uiterlijk: 'Woerd met glanzend groene kop; vrouwtje bruin gevlekt met blauwe vleugelspiegel.', geluid: 'Het klassieke "kwak kwak" (alleen het vrouwtje kwaakt luid).' },
  { id: 'meerkoet', naam: 'Meerkoet', latijn: 'Fulica atra', categorie: 'Water', uiterlijk: 'Zwart met spierwitte snavel en voorhoofdsschild; grote gelobde tenen.', geluid: 'Explosief, metalig "pik!" of "kow!".' },
  { id: 'fuut', naam: 'Fuut', latijn: 'Podiceps cristatus', categorie: 'Water', uiterlijk: 'Slanke hals, in zomerkleed met roestbruine kraag en zwarte kuif; beroemd om de baltsdans.', geluid: 'Ratelende, knorrende roepen; jongen bedelen met hoog gepiep.' },
  { id: 'knobbelzwaan', naam: 'Knobbelzwaan', latijn: 'Cygnus olor', categorie: 'Water', uiterlijk: 'Groot en wit, oranje snavel met zwarte knobbel.', geluid: 'Meestal stil; blaast en gromt bij dreiging, vleugels "zingen" in de vlucht.' },
  { id: 'grauwe-gans', naam: 'Grauwe gans', latijn: 'Anser anser', categorie: 'Water', uiterlijk: 'Grote grijsbruine gans met oranjeroze snavel — voorouder van de boerengans.', geluid: 'Luid, nasaal gegak, net als op de boerderij.' },
  { id: 'blauwe-reiger', naam: 'Blauwe reiger', latijn: 'Ardea cinerea', categorie: 'Water', uiterlijk: 'Grote grijze steltloper met zwarte kuifstreep; staat roerloos te vissen.', geluid: 'Hard, schor "fraank!" in de vlucht.' },
  { id: 'ooievaar', naam: 'Ooievaar', latijn: 'Ciconia ciconia', categorie: 'Weide & kust', uiterlijk: 'Wit met zwarte vleugels, rode snavel en rode poten; nestelt op palen en daken.', geluid: 'Vrijwel stemloos: klepperende snavel op het nest.' },
  { id: 'kokmeeuw', naam: 'Kokmeeuw', latijn: 'Chroicocephalus ridibundus', categorie: 'Water', uiterlijk: 'Sierlijke meeuw; in de zomer chocoladebruine kop, in de winter alleen een oorvlekje.', geluid: 'Krijsend, lachend "kriea kriea".' },
  { id: 'aalscholver', naam: 'Aalscholver', latijn: 'Phalacrocorax carbo', categorie: 'Water', uiterlijk: 'Groot, zwart, haakvormige snavel; droogt zijn vleugels wijd gespreid.', geluid: 'Meestal stil; keelgeluiden en gegrom bij de kolonie.' },
  { id: 'ijsvogel', naam: 'IJsvogel', latijn: 'Alcedo atthis', categorie: 'Water', uiterlijk: 'Turkooisblauwe rug, oranje buik; schiet als een blauwe flits laag over het water.', geluid: 'Hoog, scherp fluitend "tsie!" in de vlucht.' },
  { id: 'kievit', naam: 'Kievit', latijn: 'Vanellus vanellus', categorie: 'Weide & kust', uiterlijk: 'Zwart-wit met groene metaalglans en zwierige kuif; buitelende baltsvlucht.', geluid: 'Klagend "kie-wit!" — hij zegt zijn eigen naam.' },
  { id: 'grutto', naam: 'Grutto', latijn: 'Limosa limosa', categorie: 'Weide & kust', uiterlijk: 'Onze nationale vogel: lange rechte snavel, oranjebruine hals, lange poten.', geluid: 'Luid en herhaald "grutto-grutto-grutto" boven het weiland.' },
  { id: 'scholekster', naam: 'Scholekster', latijn: 'Haematopus ostralegus', categorie: 'Weide & kust', uiterlijk: 'Zwart-wit met lange oranjerode snavel en roze poten — "bonte piet".', geluid: 'Doordringend "te-piet te-piet!", vaak in luidruchtige groepjes.' },
  { id: 'buizerd', naam: 'Buizerd', latijn: 'Buteo buteo', categorie: 'Roofvogels', uiterlijk: 'Forse roofvogel, bruin met lichte vlekken; cirkelt op brede vleugels of zit op een paal.', geluid: 'Miauwend "piéé-oe", vaak hoog in de lucht.' },
  { id: 'torenvalk', naam: 'Torenvalk', latijn: 'Falco tinnunculus', categorie: 'Roofvogels', uiterlijk: 'Slanke valk die stil "biddend" boven bermen hangt; roodbruine rug.', geluid: 'Snel, hoog "kikikiki" bij het nest.' },
]

export const VOGELS: Vogel[] = BASIS.map((v) => ({ ...v, ...MEDIA[v.id] }))
export const CATEGORIEEN: Categorie[] = ['Tuin & stad', 'Bos & park', 'Water', 'Weide & kust', 'Roofvogels']
