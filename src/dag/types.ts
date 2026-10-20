import type { Foto } from '../ui/Fotos'
import type { SchemaId } from '../elektronica/types'
import type { BeeldId } from '../vervoer/types'
import type { Hand } from '../bridge/dagcursus-types'

// Wat er op een leerkaart of bij een toetsvraag getoond kan worden.
export type Beeld =
  | { soort: 'img'; src: string; alt: string; vorm?: 'foto' | 'object' }
  | { soort: 'fotos'; fotos: Foto[] }
  | { soort: 'groot'; tekst: string }
  | { soort: 'seinvlag'; letter: string }
  | { soort: 'land'; mapId: string; latlng: [number, number]; area: number }
  | { soort: 'hand'; hand: Hand }
  | { soort: 'schema'; id: SchemaId }
  | { soort: 'vt'; id: BeeldId }

export type Blok =
  | { soort: 'tekst'; tekst: string }
  | { soort: 'regel'; tekst: string } // uitgelicht: dit moet je onthouden
  | { soort: 'feiten'; rijen: [string, string][] }
  | { soort: 'lijst'; items: string[] }
  | { soort: 'beeld'; beeld: Beeld; bijschrift?: string }
  | { soort: 'let'; tekst: string } // waarschuwing of veelgemaakte fout
  | { soort: 'formule'; formule: string; betekenis: string }
  | { soort: 'serie'; stappen: { wie: string; bod: string }[]; uitleg: string }
  | { soort: 'tabel'; kop?: [string, string]; rijen: [string, string][] }

export type Kaart = {
  kop: string
  ondertitel?: string
  beeld?: Beeld
  blokken: Blok[]
  geluid?: string
}

export type Toets = {
  vraag: string
  beeld?: Beeld
  opties: string[]
  goed: number
  uitleg?: string
}

// Eén leereenheid: een land, een gebeurtenis, een les …
export type Eenheid = {
  id: string
  hoofdstuk: string
  naam: string
  kaarten: Kaart[]
  // toetsvragen; `alle` = de hele leerlijn, voor geloofwaardige foute opties
  toetsen: (alle: Eenheid[]) => Toets[]
}

export type Leerstof = {
  moduleId: string
  perDag: number // nieuwe eenheden per les
  maxHerhaal: number
  enkelvoud: string
  meervoud: string
  // stapsgewijs: pas een nieuwe eenheid als de vorige gehaald is (cursussen)
  stapsgewijs?: boolean
  laad: () => Promise<Eenheid[]>
}
