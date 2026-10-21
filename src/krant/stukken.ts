import type { Foto } from '../ui/Fotos'

// Lange krantenartikelen, per rubriek in src/krant/stukken/<rubriek>[-deel].json.

export type FotoBron = { wiki: string; taal: string; bijschrift: string }

export type Sectie = {
  tussenkop?: string
  alineas: string[]
  foto?: number
  lesFoto?: string
  schema?: string
  vt?: string
  kader?: { titel: string; punten: string[] }
  citaat?: string
}

export type Stuk = {
  id: string
  kop: string
  intro: string
  hoofdstuk?: string
  basis?: string[]
  fotos: FotoBron[]
  secties: Sectie[]
}

const BESTANDEN = import.meta.glob<Stuk[]>('./stukken/*.json', { import: 'default' })

const cache = new Map<string, Promise<Stuk[]>>()

export function laadStukken(rubriek: string): Promise<Stuk[]> {
  let p = cache.get(rubriek)
  if (!p) {
    const paden = Object.keys(BESTANDEN)
      .filter((pad) => {
        const naam = pad.split('/').pop()!.replace(/\.json$/, '')
        return naam === rubriek || naam.startsWith(`${rubriek}-`)
      })
      .sort()
    p = Promise.all(paden.map((pad) => BESTANDEN[pad]())).then((delen) => delen.flat().sort((a, b) => a.id.localeCompare(b.id)))
    cache.set(rubriek, p)
  }
  return p
}

export function woorden(s: Stuk): number {
  return s.secties.reduce((t, x) => t + x.alineas.reduce((u, a) => u + a.split(/\s+/).length, 0), 0)
}

export function leestijd(s: Stuk): number {
  return Math.max(1, Math.round(woorden(s) / 220))
}

// Gedownloade foto's van alle artikelen, op volgorde van het bronbestand.
let fotoCache: Promise<Record<string, Foto[]>> | null = null
export function laadKrantFotos(): Promise<Record<string, Foto[]>> {
  fotoCache ??= import('./fotos').then((m) => m.FOTOS)
  return fotoCache
}

// Een foto uit de bronlijst opzoeken; het bijschrift is de sleutel, zodat een
// mislukte download niet alle volgende foto's verschuift.
export function fotoVan(s: Stuk, i: number, fotos: Record<string, Foto[]>): Foto | undefined {
  const bron = s.fotos[i]
  if (!bron) return undefined
  return fotos[s.id]?.find((f) => f.bijschrift === bron.bijschrift)
}

// Bestaande foto's van lessen (elektronica, vervoer, klussen) hergebruiken.
const LES_FOTOS: Record<string, () => Promise<Record<string, Foto[]>>> = {
  elektronica: () => import('../elektronica/fotos').then((m) => m.FOTOS),
  vervoer: () => import('../vervoer/fotos').then((m) => m.FOTOS),
  klussen: () => import('../klussen/fotos').then((m) => m.FOTOS),
}

export function laadLesFotos(rubriek: string): Promise<Record<string, Foto[]>> {
  return LES_FOTOS[rubriek]?.() ?? Promise.resolve({})
}
