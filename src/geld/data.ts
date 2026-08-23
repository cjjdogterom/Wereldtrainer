// Nederlandse geldbenamingen uit het gulden-tijdperk (tot de euro in 2002).
// Veel bijnamen komen uit het Bargoens, met sterke Jiddisch/Hebreeuwse invloed.

export type Geld = {
  bijnaam: string
  waarde: string // weergave, bv. 'ƒ 10' of '25 cent'
  waardeCent: number | null // voor quiz/sortering; null = geld in het algemeen
  groep: 'Munten' | 'Biljetten & bijnamen' | 'Geld in het algemeen'
  herkomst: string
}

export const GELD: Geld[] = [
  // ── Munten ──
  {
    bijnaam: 'Stuiver',
    waarde: '5 cent',
    waardeCent: 5,
    groep: 'Munten',
    herkomst: 'Eeuwenoude muntnaam; een gulden telde vroeger 20 stuivers.',
  },
  {
    bijnaam: 'Dubbeltje',
    waarde: '10 cent',
    waardeCent: 10,
    groep: 'Munten',
    herkomst: 'Van "dubbele stuiver": 2 stuivers is 10 cent.',
  },
  {
    bijnaam: 'Kwartje',
    waarde: '25 cent',
    waardeCent: 25,
    groep: 'Munten',
    herkomst: 'Een kwart gulden (100 cent ÷ 4).',
  },
  {
    bijnaam: 'Heitje',
    waarde: '25 cent',
    waardeCent: 25,
    groep: 'Munten',
    herkomst: 'Bargoens voor het kwartje, van de Hebreeuwse letter "he" (waarde 5): 5 stuivers. Bekend van "een heitje voor een karweitje".',
  },
  {
    bijnaam: 'Piek',
    waarde: 'ƒ 1',
    waardeCent: 100,
    groep: 'Munten',
    herkomst: 'Bargoense bijnaam voor de gulden.',
  },
  {
    bijnaam: 'Pop',
    waarde: 'ƒ 1',
    waardeCent: 100,
    groep: 'Munten',
    herkomst: 'Informele naam voor de gulden ("dat kost tien pop").',
  },
  {
    bijnaam: 'Knaak',
    waarde: 'ƒ 2,50',
    waardeCent: 250,
    groep: 'Munten',
    herkomst: 'Bargoense bijnaam voor de rijksdaalder (2½ gulden).',
  },
  {
    bijnaam: 'Riks',
    waarde: 'ƒ 2,50',
    waardeCent: 250,
    groep: 'Munten',
    herkomst: 'Verkorting van "rijksdaalder".',
  },

  // ── Biljetten & bijnamen ──
  {
    bijnaam: 'Joet',
    waarde: 'ƒ 10',
    waardeCent: 1000,
    groep: 'Biljetten & bijnamen',
    herkomst: 'Naar de Hebreeuwse letter "jod", de 10e letter met getalswaarde 10.',
  },
  {
    bijnaam: 'Geeltje',
    waarde: 'ƒ 25',
    waardeCent: 2500,
    groep: 'Biljetten & bijnamen',
    herkomst: 'Het 25-guldenbiljet was lange tijd overwegend geel.',
  },
  {
    bijnaam: 'Meier',
    waarde: 'ƒ 100',
    waardeCent: 10000,
    groep: 'Biljetten & bijnamen',
    herkomst: 'Van het Hebreeuwse "me’a" (honderd), via het Bargoens.',
  },
  {
    bijnaam: 'Snip',
    waarde: 'ƒ 100',
    waardeCent: 10000,
    groep: 'Biljetten & bijnamen',
    herkomst: 'Het oude 100-guldenbiljet toonde een watersnip.',
  },
  {
    bijnaam: 'Rooie rug',
    waarde: 'ƒ 1000',
    waardeCent: 100000,
    groep: 'Biljetten & bijnamen',
    herkomst: 'Het 1000-guldenbiljet had een opvallend rode achterkant; kortweg ook "een rug".',
  },

  // ── Geld in het algemeen ──
  {
    bijnaam: 'Poen',
    waarde: 'geld',
    waardeCent: null,
    groep: 'Geld in het algemeen',
    herkomst: 'Algemeen Bargoens/informeel woord voor geld.',
  },
  {
    bijnaam: 'Pegels',
    waarde: 'geld',
    waardeCent: null,
    groep: 'Geld in het algemeen',
    herkomst: 'Bargoens voor (munt)geld.',
  },
  {
    bijnaam: 'Doekoe',
    waarde: 'geld',
    waardeCent: null,
    groep: 'Geld in het algemeen',
    herkomst: 'Uit het Sranantongo; via de straattaal in het Nederlands.',
  },
  {
    bijnaam: 'Spie',
    waarde: 'geld',
    waardeCent: null,
    groep: 'Geld in het algemeen',
    herkomst: 'Bargoens voor geld of een geldstuk.',
  },
  {
    bijnaam: 'Flappen',
    waarde: 'geld',
    waardeCent: null,
    groep: 'Geld in het algemeen',
    herkomst: 'Slang voor bankbiljetten ("flappentap" = geldautomaat).',
  },
]
