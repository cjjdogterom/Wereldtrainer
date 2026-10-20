export type PlantGroep = 'boom' | 'struik' | 'wild'

export const GROEP_TITEL: Record<PlantGroep, string> = {
  boom: 'Bomen',
  struik: 'Struiken & heesters',
  wild: 'Wilde planten & bloemen',
}

export type Plant = {
  id: string // kebab-case, ook bestandsnaam van de foto
  naam: string // Nederlandse naam
  latijn: string
  familie: string // Nederlandse familienaam, bijv. 'Napjesdragersfamilie'
  groep: PlantGroep
  herkennen: string // één zin: waaraan herken je hem in één oogopslag
  blad?: string
  bloem?: string
  vrucht?: string
  schors?: string // vooral bij bomen
  bloeitijd?: string // bijv. 'april–mei'
  hoogte?: string // bijv. '20–40 m'
  waar: string // standplaats in Nederland
  wetenswaard: string // één opvallend, goed onderbouwd feit
  wiki: string // titel van het Nederlandstalige Wikipedia-artikel (voor de foto)
  eetbaar?: string // welk deel, hoe, en met welk voorbehoud
  giftig?: string // welke delen, hoe ernstig, symptomen
  verwisseling?: string // gevaarlijke dubbelganger en het onderscheid
}
