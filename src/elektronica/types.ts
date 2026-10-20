export type Categorie = 'installatie' | 'theorie' | 'micro' | 'meten'

export const CATEGORIEEN: { id: Categorie; titel: string; kort: string; intro: string }[] = [
  {
    id: 'installatie',
    titel: 'Huisinstallatie',
    kort: 'Groepenkast, fases, aarding',
    intro: 'Hoe de stroom je huis binnenkomt en verdeeld wordt: aansluiting, groepenkast, fases, aardlek, kabels en schakelingen — volgens NEN 1010.',
  },
  {
    id: 'theorie',
    titel: 'Theorie',
    kort: 'Spanning, stroom, vermogen',
    intro: 'De natuurkunde achter alles: lading, spanning, stroom, weerstand, vermogen, wisselstroom en magnetisme.',
  },
  {
    id: 'micro',
    titel: 'Micro-elektronica',
    kort: 'Componenten, chips, solderen',
    intro: 'De bouwstenen van printplaten: weerstanden, condensatoren, diodes, transistors, IC’s, microcontrollers en solderen.',
  },
  {
    id: 'meten',
    titel: 'Meten & schema’s',
    kort: 'Multimeter, symbolen, storingen',
    intro: 'Veilig meten met een multimeter, schema’s en symbolen lezen, en systematisch storingen zoeken.',
  },
]

// Schema's die als SVG getekend worden (zie schemas.tsx).
export type SchemaId =
  | 'serie'
  | 'parallel'
  | 'enkelpolig'
  | 'wissel'
  | 'kruis'
  | 'groepenkast'
  | 'driefase'
  | 'aardlek'
  | 'spanningsdeler'
  | 'led'
  | 'transistor'
  | 'brug'
  | 'rc'
  | 'meet-spanning'
  | 'meet-stroom'
  | 'sinus'

export type LesVraag = {
  vraag: string
  opties: string[]
  goed: number // index in opties
  uitleg: string
}

export type Les = {
  id: string
  categorie: Categorie
  titel: string
  kern: string // één zin: de kern die je moet onthouden
  uitleg: string[] // alinea's
  feiten?: string[] // korte, harde feiten (getallen, regels)
  formules?: { formule: string; betekenis: string }[]
  schema?: SchemaId
  letOp?: string // veiligheid of veelgemaakte fout
  vragen: LesVraag[]
}

// Schemasymbolen voor de symbolen-oefening.
export type SymboolId =
  | 'weerstand'
  | 'potmeter'
  | 'condensator'
  | 'elco'
  | 'spoel'
  | 'diode'
  | 'led'
  | 'zener'
  | 'npn'
  | 'pnp'
  | 'batterij'
  | 'lamp'
  | 'schakelaar'
  | 'drukknop'
  | 'zekering'
  | 'aarde'
  | 'transformator'
  | 'motor'
  | 'voltmeter'
  | 'ampèremeter'
  | 'wisselspanning'
  | 'stopcontact'
