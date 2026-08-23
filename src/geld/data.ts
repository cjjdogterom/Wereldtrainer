// Nederlandse geldbenamingen: gulden-tijdperk (tot de euro in 2002), euro-slang
// en algemene geldwoorden. Veel namen komen uit het Bargoens (dieventaal met
// sterke Jiddisch/Hebreeuwse invloed) of de latere straattaal.

export type Geld = {
  bijnaam: string
  waarde: string // weergave, bv. 'ƒ 10', '€ 100' of '25 cent'
  waardeCent: number | null // voor quiz/sortering; null = geld in het algemeen
  groep: 'Munten (gulden)' | 'Biljetten & bijnamen (gulden)' | 'Euro (informeel & straattaal)' | 'Geld in het algemeen'
  herkomst: string
}

export const GELD: Geld[] = [
  // ── Munten (gulden) ──
  {
    bijnaam: 'Stuiver',
    waarde: '5 cent',
    waardeCent: 5,
    groep: 'Munten (gulden)',
    herkomst: 'Eeuwenoude muntnaam; een gulden telde vroeger 20 stuivers.',
  },
  {
    bijnaam: 'Dubbeltje',
    waarde: '10 cent',
    waardeCent: 10,
    groep: 'Munten (gulden)',
    herkomst: 'Van "dubbele stuiver": 2 stuivers is 10 cent.',
  },
  {
    bijnaam: 'Kwartje',
    waarde: '25 cent',
    waardeCent: 25,
    groep: 'Munten (gulden)',
    herkomst: 'Een kwart gulden (100 cent ÷ 4).',
  },
  {
    bijnaam: 'Heitje',
    waarde: '25 cent',
    waardeCent: 25,
    groep: 'Munten (gulden)',
    herkomst: 'Bargoens voor het kwartje, van de Hebreeuwse letter "he" (waarde 5): 5 stuivers. Bekend van "een heitje voor een karweitje".',
  },
  {
    bijnaam: 'Piek',
    waarde: 'ƒ 1',
    waardeCent: 100,
    groep: 'Munten (gulden)',
    herkomst: 'Bargoense bijnaam voor de gulden.',
  },
  {
    bijnaam: 'Pop',
    waarde: 'ƒ 1',
    waardeCent: 100,
    groep: 'Munten (gulden)',
    herkomst: 'Informele naam voor de gulden ("dat kost tien pop").',
  },
  {
    bijnaam: 'Daalder',
    waarde: 'ƒ 1,50',
    waardeCent: 150,
    groep: 'Munten (gulden)',
    herkomst: 'Historische zilveren munt van 30 stuivers (1½ gulden); de naam is verwant aan "thaler" en "dollar".',
  },
  {
    bijnaam: 'Knaak',
    waarde: 'ƒ 2,50',
    waardeCent: 250,
    groep: 'Munten (gulden)',
    herkomst: 'Bargoense bijnaam voor de rijksdaalder (2½ gulden).',
  },
  {
    bijnaam: 'Riks',
    waarde: 'ƒ 2,50',
    waardeCent: 250,
    groep: 'Munten (gulden)',
    herkomst: 'Verkorting van "rijksdaalder".',
  },

  // ── Biljetten & bijnamen (gulden) ──
  {
    bijnaam: 'Vijfje',
    waarde: 'ƒ 5',
    waardeCent: 500,
    groep: 'Biljetten & bijnamen (gulden)',
    herkomst: 'Het briefje van vijf gulden.',
  },
  {
    bijnaam: 'Joet',
    waarde: 'ƒ 10',
    waardeCent: 1000,
    groep: 'Biljetten & bijnamen (gulden)',
    herkomst: 'Naar de Hebreeuwse letter "jod", de 10e letter met getalswaarde 10.',
  },
  {
    bijnaam: 'Geeltje',
    waarde: 'ƒ 25',
    waardeCent: 2500,
    groep: 'Biljetten & bijnamen (gulden)',
    herkomst: 'Het 25-guldenbiljet was lange tijd overwegend geel.',
  },
  {
    bijnaam: 'Meier',
    waarde: 'ƒ 100',
    waardeCent: 10000,
    groep: 'Biljetten & bijnamen (gulden)',
    herkomst: 'Van het Hebreeuwse "me’a" (honderd), via het Bargoens; wordt ook nu nog voor honderd euro gebruikt.',
  },
  {
    bijnaam: 'Snip',
    waarde: 'ƒ 100',
    waardeCent: 10000,
    groep: 'Biljetten & bijnamen (gulden)',
    herkomst: 'Het oude 100-guldenbiljet toonde een watersnip.',
  },
  {
    bijnaam: 'Rooie rug',
    waarde: 'ƒ 1000',
    waardeCent: 100000,
    groep: 'Biljetten & bijnamen (gulden)',
    herkomst: 'Het 1000-guldenbiljet had een opvallend rode achterkant; kortweg ook "een rug".',
  },

  // ── Euro (informeel & straattaal) ──
  {
    bijnaam: 'Tientje',
    waarde: '€ 10',
    waardeCent: 1000,
    groep: 'Euro (informeel & straattaal)',
    herkomst: 'Gewone informele naam voor tien euro, net als vroeger voor tien gulden.',
  },
  {
    bijnaam: 'Barkie',
    waarde: '€ 100',
    waardeCent: 10000,
    groep: 'Euro (informeel & straattaal)',
    herkomst: 'Straattaal voor honderd euro, breed bekend geworden via de hiphop.',
  },
  {
    bijnaam: 'Bakkie',
    waarde: '€ 100',
    waardeCent: 10000,
    groep: 'Euro (informeel & straattaal)',
    herkomst: 'Straattaal voor honderd euro (los van "een bakkie" voor een kop koffie).',
  },
  {
    bijnaam: 'Mille',
    waarde: '€ 1.000',
    waardeCent: 100000,
    groep: 'Euro (informeel & straattaal)',
    herkomst: 'Van het Franse "mille" (duizend): duizend euro.',
  },
  {
    bijnaam: 'Ki',
    waarde: '€ 1.000',
    waardeCent: 100000,
    groep: 'Euro (informeel & straattaal)',
    herkomst: 'Van "kilo" (duizend) uit de straattaal: duizend euro.',
  },
  {
    bijnaam: 'Meloen',
    waarde: '€ 1.000.000',
    waardeCent: 100_000_000,
    groep: 'Euro (informeel & straattaal)',
    herkomst: 'Spreektaal voor een miljoen; al in het gulden-tijdperk gebruikt, nu voor euro’s.',
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
    bijnaam: 'Poet',
    waarde: 'geld',
    waardeCent: null,
    groep: 'Geld in het algemeen',
    herkomst: 'Bargoens voor geld of buit ("de poet binnenhalen").',
  },
  {
    bijnaam: 'Pegels',
    waarde: 'geld',
    waardeCent: null,
    groep: 'Geld in het algemeen',
    herkomst: 'Bargoens voor (munt)geld.',
  },
  {
    bijnaam: 'Spie',
    waarde: 'geld',
    waardeCent: null,
    groep: 'Geld in het algemeen',
    herkomst: 'Bargoens voor geld of een geldstuk.',
  },
  {
    bijnaam: 'Duiten',
    waarde: 'geld',
    waardeCent: null,
    groep: 'Geld in het algemeen',
    herkomst: 'Naar de duit, een oude koperen munt van een achtste stuiver; nu spreektaal voor geld.',
  },
  {
    bijnaam: 'Flappen',
    waarde: 'geld',
    waardeCent: null,
    groep: 'Geld in het algemeen',
    herkomst: 'Slang voor bankbiljetten ("flappentap" = geldautomaat).',
  },
  {
    bijnaam: 'Doekoe',
    waarde: 'geld',
    waardeCent: null,
    groep: 'Geld in het algemeen',
    herkomst: 'Uit het Sranantongo; via de straattaal in het Nederlands.',
  },
]
