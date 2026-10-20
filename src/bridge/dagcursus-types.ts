// Formaat van de bridgecursus voor de dagtrainer: één les per keer, eerst
// uitleg met voorbeeldhanden, dan oefenvragen.

// Een hand als tekst per kleur, bijv. s: 'A V 8 4' (rangen A H V B 10 9 … 2), leeg = renonce.
export type Hand = { s: string; h: string; d: string; c: string }

export type Blok =
  | { soort: 'tekst'; tekst: string } // een alinea
  | { soort: 'regel'; tekst: string } // een belangrijke regel om te onthouden, uitgelicht
  | { soort: 'hand'; hand: Hand; titel: string; uitleg: string } // voorbeeldhand met conclusie
  | { soort: 'serie'; stappen: { wie: 'N' | 'O' | 'Z' | 'W'; bod: string }[]; uitleg: string } // een biedverloop
  | { soort: 'tabel'; kop?: [string, string]; rijen: [string, string][] } // bijv. bod → betekenis

export type BridgeVraag = {
  vraag: string
  hand?: Hand
  opties: string[]
  goed: number
  uitleg: string
}

export type BridgeLes = {
  id: string
  deel: string // hoofdstuk, bijv. 'De basis', 'Openen', 'Antwoorden', 'Tweede ronde', 'Spelen'
  titel: string
  kern: string // één zin
  blokken: Blok[]
  vragen: BridgeVraag[]
}
