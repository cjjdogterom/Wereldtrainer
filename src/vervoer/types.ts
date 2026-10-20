export type Categorie =
  | 'auto'
  | 'motorfiets'
  | 'elektrisch'
  | 'trein'
  | 'schip'
  | 'helikopter'
  | 'lucht-techniek'
  | 'lucht-regels'
  | 'lucht-praktijk'
  | 'lucht-meteo'

export const CATEGORIEEN: { id: Categorie; titel: string; kort: string; intro: string }[] = [
  { id: 'auto', titel: "Auto's", kort: 'Motor en aandrijflijn', intro: 'Van verbrandingsmotor tot wielophanging: hoe brandstof, lucht en vonk beweging worden, en hoe die beweging bij de wielen komt.' },
  { id: 'motorfiets', titel: 'Motorfietsen', kort: 'Twee wielen', intro: 'Wat een motorfiets technisch anders maakt: tweetakt, eindaandrijving, en hoe je door een bocht stuurt.' },
  { id: 'elektrisch', titel: 'Elektrisch rijden', kort: 'Accu, laden, waterstof', intro: 'Accu’s, elektromotoren, laden en regeneratief remmen — en waar waterstof in het verhaal past.' },
  { id: 'trein', titel: 'Treinen en spoor', kort: 'Bovenleiding en beveiliging', intro: 'Hoe een trein zijn stroom krijgt, waarom hij niet kan uitwijken, en hoe seinen, ATB en ERTMS botsingen voorkomen.' },
  { id: 'schip', titel: 'Schepen en varen', kort: 'Voortstuwing en vaarregels', intro: 'Drijven, voortstuwen en sturen, en de regels op het water: van stuurboord tot sluis.' },
  { id: 'helikopter', titel: 'Helikopters', kort: 'Rotor en besturing', intro: 'Hoe een rotor lift maakt, wat cyclic, collective en pedalen doen, en waarom een helikopter een staartrotor nodig heeft.' },
  { id: 'lucht-techniek', titel: 'Vliegtuigtechniek', kort: 'Lift, motoren, instrumenten', intro: 'Waarom een vliegtuig vliegt, hoe zuiger- en straalmotoren werken, en wat de zes basisinstrumenten je vertellen.' },
  { id: 'lucht-regels', titel: 'Luchtruim en regels', kort: 'VFR, IFR, klassen', intro: 'Hoe het luchtruim is ingedeeld, wanneer je toestemming nodig hebt, en de regels voor zicht, hoogte en voorrang.' },
  { id: 'lucht-praktijk', titel: 'Vliegen in de praktijk', kort: 'Naderingen, PAPI, ATC', intro: 'Wat je in de sim (en in het echt) doet: circuits, ILS-naderingen, PAPI, baanmarkeringen en de taal van de verkeersleiding.' },
  { id: 'lucht-meteo', titel: 'Meteo en navigatie', kort: 'METAR, wind, VOR', intro: 'Weerberichten lezen, wind en zicht beoordelen, de hoogtemeter goed zetten en navigeren met VOR, NDB en GPS.' },
]

// Illustraties die als SVG of interactief onderdeel getekend worden (zie beelden.tsx).
export type BeeldId = 'papi' | 'viertakt' | 'ils' | 'vleugel' | 'rotor' | 'circuit' | 'baan'

export type LesVraag = {
  vraag: string
  opties: string[]
  goed: number
  uitleg: string
}

export type Les = {
  id: string
  categorie: Categorie
  titel: string
  kern: string
  uitleg: string[]
  feiten?: string[]
  formules?: { formule: string; betekenis: string }[]
  beeld?: BeeldId
  letOp?: string
  vragen: LesVraag[]
}
