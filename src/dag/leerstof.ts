import type { Blok, Eenheid, Kaart, Leerstof, Toets } from './types'
import type { Foto } from '../ui/Fotos'

// ─── hulpjes ───

function schud<T>(xs: T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Meerkeuze: het goede antwoord plus drie verschillende foute uit `kandidaten`.
function mc(vraag: string, goed: string, kandidaten: string[], extra: Partial<Toets> = {}): Toets {
  const fout = schud([...new Set(kandidaten.filter((k) => k && k !== goed))]).slice(0, 3)
  const opties = schud([goed, ...fout])
  return { vraag, opties, goed: opties.indexOf(goed), ...extra }
}

// Buren in de leerlijn (voor foute opties uit dezelfde hoek).
function buren<T>(xs: T[], i: number, straal = 6): T[] {
  return xs.slice(Math.max(0, i - straal), i).concat(xs.slice(i + 1, i + 1 + straal))
}

function eersteZin(t: string): [string, string] {
  const z = t.match(/^.+?[.!?](\s|$)/)?.[0].trim() ?? t
  return [z, t.slice(z.length).trim()]
}

function verberg(tekst: string, naam: string): string {
  return tekst.replace(new RegExp(naam.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '…')
}

const fmt = new Intl.NumberFormat('nl-NL')

// Zelfde sleutel als in de fotos-bron.json-bestanden.
const slug = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)

const fotoBlok = (fotos: Foto[] | undefined): Blok[] => (fotos?.length ? [{ soort: 'beeld', beeld: { soort: 'fotos', fotos } }] : [])

// ─── Topografie ───

const CONTINENT_VOLGORDE = ['Europa', 'Azie', 'Afrika', 'Noord-Amerika', 'Zuid-Amerika', 'Oceanie']
// Van dichtbij naar ver weg: eerst de buren van Nederland.
const REGIO_VOLGORDE = [
  'Western Europe', 'Northern Europe', 'Southern Europe', 'Central Europe', 'Southeast Europe', 'Eastern Europe',
  'Western Asia', 'Southern Asia', 'Eastern Asia', 'South-Eastern Asia', 'Central Asia',
  'Northern Africa', 'Western Africa', 'Middle Africa', 'Eastern Africa', 'Southern Africa',
  'North America', 'Central America', 'Caribbean', 'South America',
  'Australia and New Zealand', 'Melanesia', 'Micronesia', 'Polynesia',
]
const regioRang = (r: string) => {
  const i = REGIO_VOLGORDE.indexOf(r)
  return i < 0 ? 99 : i
}
const CONTINENT_NAAM: Record<string, string> = {
  Europa: 'Europa',
  Azie: 'Azië',
  Afrika: 'Afrika',
  'Noord-Amerika': 'Noord-Amerika',
  'Zuid-Amerika': 'Zuid-Amerika',
  Oceanie: 'Oceanië',
}
const SUBREGIO: Record<string, string> = {
  'Western Africa': 'West-Afrika',
  'Eastern Africa': 'Oost-Afrika',
  'Northern Africa': 'Noord-Afrika',
  'Southern Africa': 'Zuidelijk Afrika',
  'Middle Africa': 'Centraal-Afrika',
  'Western Europe': 'West-Europa',
  'Eastern Europe': 'Oost-Europa',
  'Northern Europe': 'Noord-Europa',
  'Southern Europe': 'Zuid-Europa',
  'Central Europe': 'Centraal-Europa',
  'Southeast Europe': 'Zuidoost-Europa',
  'Western Asia': 'West-Azië',
  'Central Asia': 'Centraal-Azië',
  'Southern Asia': 'Zuid-Azië',
  'Eastern Asia': 'Oost-Azië',
  'South-Eastern Asia': 'Zuidoost-Azië',
  Caribbean: 'Caribisch gebied',
  'Central America': 'Midden-Amerika',
  'South America': 'Zuid-Amerika',
  'North America': 'Noord-Amerika',
  'Australia and New Zealand': 'Australië en Nieuw-Zeeland',
  Melanesia: 'Melanesië',
  Micronesia: 'Micronesië',
  Polynesia: 'Polynesië',
}

function afstand(a: [number, number], b: [number, number]) {
  const r = Math.PI / 180
  const dLat = (b[0] - a[0]) * r
  const dLon = (b[1] - a[1]) * r
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLon / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}

const topografie: Leerstof = {
  moduleId: 'topografie',
  perDag: 5,
  maxHerhaal: 6,
  enkelvoud: 'land',
  meervoud: 'landen',
  laad: async () => {
    const { countries } = await import('../data/countries')
    const alle = countries.filter((c) => c.capital && c.continent)
    const regio = (c: (typeof alle)[number]) => SUBREGIO[c.subregion] ?? c.subregion
    const geordend = [...alle].sort(
      (a, b) =>
        CONTINENT_VOLGORDE.indexOf(a.continent) - CONTINENT_VOLGORDE.indexOf(b.continent) ||
        regioRang(a.subregion) - regioRang(b.subregion) ||
        regio(a).localeCompare(regio(b), 'nl') ||
        b.area - a.area,
    )
    return geordend.map((c) => {
      const dichtbij = alle
        .filter((x) => x.id !== c.id)
        .sort((x, y) => afstand(c.latlng, x.latlng) - afstand(c.latlng, y.latlng))
        .slice(0, 4)
        .map((x) => x.name)
      const kaart: Kaart = {
        kop: `${c.flag} ${c.name}`,
        ondertitel: `${CONTINENT_NAAM[c.continent]} · ${regio(c)}`,
        beeld: { soort: 'land', mapId: c.mapId, latlng: c.latlng, area: c.area },
        blokken: [
          { soort: 'regel', tekst: `Hoofdstad: ${c.capital}` },
          {
            soort: 'feiten',
            rijen: [
              ['Werelddeel', CONTINENT_NAAM[c.continent]],
              ['Regio', regio(c)],
              ['Oppervlakte', `${fmt.format(Math.round(c.area))} km² (Nederland: 41.543 km²)`],
              ['In de buurt', dichtbij.join(', ')],
            ],
          },
        ],
      }
      return {
        id: c.id,
        hoofdstuk: `${CONTINENT_NAAM[c.continent]} — ${regio(c)}`,
        naam: c.name,
        kaarten: [kaart],
        toetsen: () => {
          const zelfdeRegio = alle.filter((x) => x.subregion === c.subregion && x.id !== c.id)
          const pool = zelfdeRegio.length >= 3 ? zelfdeRegio : alle.filter((x) => x.continent === c.continent && x.id !== c.id)
          return [
            mc(
              'Welk land is hier gemarkeerd?',
              c.name,
              pool.map((x) => x.name),
              { beeld: { soort: 'land', mapId: c.mapId, latlng: c.latlng, area: c.area }, uitleg: `Dit is ${c.name}, in ${regio(c)}.` },
            ),
            mc(`Wat is de hoofdstad van ${c.name}?`, c.capital, pool.map((x) => x.capital), { uitleg: `De hoofdstad van ${c.name} is ${c.capital}.` }),
          ]
        },
      }
    })
  },
}

// ─── Geschiedenis van Nederland ───

const geschiedenis: Leerstof = {
  moduleId: 'geschiedenis',
  perDag: 4,
  maxHerhaal: 6,
  enkelvoud: 'gebeurtenis',
  meervoud: 'gebeurtenissen en personen',
  laad: async () => {
    const [{ GESORTEERD, jaarLabel }, { FOTOS }] = await Promise.all([import('../geschiedenis/data'), import('../geschiedenis/fotos')])
    return GESORTEERD.map((h, i) => ({
      id: `${h.jaar}-${h.titel}`,
      hoofdstuk: h.periode,
      naam: h.titel,
      kaarten: [
        {
          kop: h.titel,
          ondertitel: `${jaarLabel(h)} · ${h.periode}`,
          beeld: { soort: 'groot', tekst: jaarLabel(h) },
          blokken: [...fotoBlok(FOTOS[slug(h.titel)]), { soort: 'tekst', tekst: h.uitleg }],
        },
      ],
      toetsen: () => [
        mc(
          h.soort === 'persoon' ? `Wanneer leefde ${h.titel}?` : `Wanneer was dit: ${h.titel}?`,
          jaarLabel(h),
          buren(GESORTEERD, i, 8).map(jaarLabel),
          { uitleg: `${h.titel}: ${jaarLabel(h)}.` },
        ),
        mc(
          `Waar gaat dit over? „${verberg(eersteZin(h.uitleg)[0], h.titel)}”`,
          h.titel,
          buren(GESORTEERD, i, 6).map((x) => x.titel),
        ),
      ],
    }))
  },
}

// ─── Europa ───

const europa: Leerstof = {
  moduleId: 'europa',
  perDag: 3,
  maxHerhaal: 6,
  enkelvoud: 'macht',
  meervoud: 'machten',
  laad: async () => {
    const [{ MACHTEN }, { FOTOS }] = await Promise.all([import('../europa/data'), import('../europa/fotos')])
    const lijst = [...MACHTEN].sort((a, b) => a.start - b.start)
    return lijst.map((m, i) => ({
      id: m.id,
      hoofdstuk: m.tijdvak,
      naam: m.macht,
      kaarten: [
        {
          kop: m.macht,
          ondertitel: `${m.periode} · ${m.gebied}`,
          blokken: [
            { soort: 'regel', tekst: `${m.periode}: ${m.macht} heerst over ${m.gebied}.` },
            ...fotoBlok(FOTOS[m.id]),
            { soort: 'tekst', tekst: m.uitleg },
          ],
        },
      ],
      toetsen: () => [mc(`Wie had de macht in ${m.gebied}, ${m.periode}?`, m.macht, buren(lijst, i, 5).map((x) => x.macht), { uitleg: m.uitleg })],
    }))
  },
}

// ─── Kerk ───

const kerk: Leerstof = {
  moduleId: 'kerk',
  perDag: 3,
  maxHerhaal: 6,
  enkelvoud: 'positie',
  meervoud: 'posities',
  laad: async () => {
    const { ALLE_POSITIES } = await import('../kerk/data')
    return ALLE_POSITIES.map((p, i) => ({
      id: p.id,
      hoofdstuk: p.rang ? 'De gezagsladder' : 'Titels en ordes',
      naam: p.naam,
      kaarten: [
        {
          kop: p.naam,
          ondertitel: p.rang ? `Plaats ${p.rang} in de gezagsladder` : undefined,
          beeld: p.wapen ? { soort: 'img', src: `/kerk/${p.wapen}`, alt: `Wapen: ${p.naam}`, vorm: 'object' } : undefined,
          blokken: [{ soort: 'tekst', tekst: p.omschrijving }, ...(p.wapenUitleg ? [{ soort: 'tekst', tekst: `Wapen: ${p.wapenUitleg}` } as Blok] : [])],
        },
      ],
      toetsen: () => [mc(`Wie of wat is dit? „${verberg(eersteZin(p.omschrijving)[0], p.naam)}”`, p.naam, buren(ALLE_POSITIES, i, 6).map((x) => x.naam))],
    }))
  },
}

// ─── Rangen ───

const rangen: Leerstof = {
  moduleId: 'rangen',
  perDag: 5,
  maxHerhaal: 6,
  enkelvoud: 'rang',
  meervoud: 'rangen',
  laad: async () => {
    const [{ ONDERDELEN }, { INSIGNES }] = await Promise.all([import('../rangen/data'), import('../rangen/insignes')])
    return ONDERDELEN.flatMap((o) =>
      o.rangen.map((r, i) => {
        const file = INSIGNES[`${o.id}|${r.naam}`]
        const beeld = file ? ({ soort: 'img', src: `/rangen/${file}`, alt: 'Onderscheidingsteken', vorm: 'object' } as const) : undefined
        return {
          id: `${o.id}|${r.naam}`,
          hoofdstuk: o.naam,
          naam: r.naam,
          kaarten: [
            {
              kop: r.naam,
              ondertitel: `${o.naam} · ${r.cluster}`,
              beeld,
              blokken: [
                {
                  soort: 'feiten',
                  rijen: [
                    ['Onderdeel', o.naam],
                    ['Groep', r.cluster],
                    ['Plaats', `${i + 1} van ${o.rangen.length} (van hoog naar laag)`],
                    ...(r.detail ? ([['Bijzonderheid', r.detail]] as [string, string][]) : []),
                    ...(i > 0 ? ([['Eén hoger', o.rangen[i - 1].naam]] as [string, string][]) : []),
                    ...(i < o.rangen.length - 1 ? ([['Eén lager', o.rangen[i + 1].naam]] as [string, string][]) : []),
                  ],
                },
              ],
            },
          ],
          toetsen: () => [
            mc(beeld ? `${o.naam}: welke rang hoort bij dit teken?` : `${o.naam}: welke rang komt direct ${i > 0 ? `onder ${o.rangen[i - 1].naam}` : 'bovenaan'}?`, r.naam, buren(o.rangen, i, 4).map((x) => x.naam), {
              beeld,
            }),
          ],
        }
      }),
    )
  },
}

// ─── Vogels ───

const vogels: Leerstof = {
  moduleId: 'vogels',
  perDag: 4,
  maxHerhaal: 6,
  enkelvoud: 'vogel',
  meervoud: 'vogels',
  laad: async () => {
    const { VOGELS, CATEGORIEEN } = await import('../vogels/data')
    const lijst = [...VOGELS].filter((v) => v.foto).sort((a, b) => CATEGORIEEN.indexOf(a.categorie) - CATEGORIEEN.indexOf(b.categorie))
    return lijst.map((v) => ({
      id: v.id,
      hoofdstuk: v.categorie,
      naam: v.naam,
      kaarten: [
        {
          kop: v.naam,
          ondertitel: `${v.latijn} · ${v.categorie}`,
          beeld: { soort: 'img', src: `/vogels/${v.foto}`, alt: v.naam, vorm: 'foto' },
          geluid: v.geluidUrl,
          blokken: [
            { soort: 'feiten', rijen: [['Uiterlijk', v.uiterlijk], ['Geluid', v.geluid]] },
          ],
        },
      ],
      toetsen: () => [
        mc('Welke vogel is dit?', v.naam, lijst.filter((x) => x.categorie === v.categorie).map((x) => x.naam), {
          beeld: { soort: 'img', src: `/vogels/${v.foto}`, alt: 'Welke vogel is dit?', vorm: 'foto' },
        }),
      ],
    }))
  },
}

// ─── Planten ───

const planten: Leerstof = {
  moduleId: 'planten',
  perDag: 4,
  maxHerhaal: 6,
  enkelvoud: 'soort',
  meervoud: 'soorten',
  laad: async () => {
    const [{ PLANTEN }, { FOTO }, { GROEP_TITEL }] = await Promise.all([import('../planten/data'), import('../planten/media'), import('../planten/types')])
    const volgorde = ['boom', 'struik', 'wild']
    const lijst = [...PLANTEN].sort((a, b) => volgorde.indexOf(a.groep) - volgorde.indexOf(b.groep))
    return lijst.map((p) => {
      const foto = FOTO[p.id] ? ({ soort: 'img', src: `/planten/${FOTO[p.id].bestand}`, alt: p.naam, vorm: 'foto' } as const) : undefined
      const rijen = (
        [
          ['Blad', p.blad],
          ['Bloem', p.bloem],
          ['Vrucht', p.vrucht],
          ['Schors', p.schors],
          ['Bloeit', p.bloeitijd],
          ['Hoogte', p.hoogte],
          ['Waar', p.waar],
        ] as [string, string | undefined][]
      ).filter((r): r is [string, string] => Boolean(r[1]))
      const blokken: Blok[] = [{ soort: 'regel', tekst: p.herkennen }, { soort: 'feiten', rijen }, { soort: 'tekst', tekst: p.wetenswaard }]
      if (p.eetbaar) blokken.push({ soort: 'tekst', tekst: `Eetbaar: ${p.eetbaar}` })
      if (p.giftig) blokken.push({ soort: 'let', tekst: `Giftig: ${p.giftig}` })
      if (p.verwisseling) blokken.push({ soort: 'let', tekst: `Niet verwisselen: ${p.verwisseling}` })
      return {
        id: p.id,
        hoofdstuk: GROEP_TITEL[p.groep],
        naam: p.naam,
        kaarten: [{ kop: p.naam, ondertitel: `${p.latijn} · ${p.familie}`, beeld: foto, blokken }],
        toetsen: () => [mc('Welke soort is dit?', p.naam, lijst.filter((x) => x.groep === p.groep).map((x) => x.naam), { beeld: foto, uitleg: p.herkennen })],
      }
    })
  },
}

// ─── Knopen ───

const knopen: Leerstof = {
  moduleId: 'knopen',
  perDag: 2,
  maxHerhaal: 4,
  enkelvoud: 'knoop',
  meervoud: 'knopen',
  laad: async () => {
    const { KNOPEN } = await import('../knopen/data')
    return KNOPEN.map((k) => ({
      id: k.id,
      hoofdstuk: 'Knopen en steken',
      naam: k.naam,
      kaarten: [
        {
          kop: k.naam,
          ondertitel: k.engels,
          beeld: { soort: 'img', src: k.afbeelding, alt: k.naam, vorm: 'foto' },
          blokken: [
            { soort: 'regel', tekst: k.doel },
            { soort: 'tekst', tekst: k.uitleg },
            ...(k.onthoud ? [{ soort: 'tekst', tekst: `Onthoud: ${k.onthoud}` } as Blok] : []),
          ],
        },
      ],
      toetsen: () => [
        mc('Welke knoop is dit?', k.naam, KNOPEN.map((x) => x.naam), { beeld: { soort: 'img', src: k.afbeelding, alt: 'Welke knoop?', vorm: 'foto' } }),
        mc(`Waarvoor gebruik je de ${k.naam.toLowerCase()}?`, k.doel, KNOPEN.map((x) => x.doel)),
      ],
    }))
  },
}

// ─── Seinen ───

const seinen: Leerstof = {
  moduleId: 'seinen',
  perDag: 4,
  maxHerhaal: 6,
  enkelvoud: 'vlag',
  meervoud: 'seinvlaggen',
  laad: async () => {
    const { SEINEN } = await import('../seinen/data')
    return SEINEN.map((s, i) => ({
      id: s.letter,
      hoofdstuk: 'Seinvlaggen A–Z',
      naam: `${s.letter} — ${s.navo}`,
      kaarten: [
        {
          kop: `${s.letter} — ${s.navo}`,
          beeld: { soort: 'seinvlag', letter: s.letter },
          blokken: [
            { soort: 'regel', tekst: s.betekenis },
            { soort: 'feiten', rijen: [['Spelalfabet', s.navo], ['Morse', s.morse]] },
          ],
        },
      ],
      toetsen: () => [
        mc('Welke letter is deze vlag?', `${s.letter} — ${s.navo}`, buren(SEINEN, i, 6).map((x) => `${x.letter} — ${x.navo}`), { beeld: { soort: 'seinvlag', letter: s.letter } }),
        mc(`Welke vlag hijs je voor: „${s.betekenis}”?`, s.letter, SEINEN.map((x) => x.letter)),
      ],
    }))
  },
}

// ─── Klaverjassen ───

const klaverjas: Leerstof = {
  moduleId: 'klaverjas',
  perDag: 3,
  maxHerhaal: 5,
  enkelvoud: 'spelregel',
  meervoud: 'spelregels',
  laad: async () => {
    const { REGEL_VRAGEN } = await import('../klaverjas/data')
    return REGEL_VRAGEN.map((q, i) => ({
      id: `regel-${i}`,
      hoofdstuk: 'Spelregels (Amsterdams)',
      naam: `Spelregel ${i + 1}`,
      kaarten: [
        {
          kop: `Spelregel ${i + 1}`,
          blokken: [
            { soort: 'tekst', tekst: q.situatie },
            { soort: 'regel', tekst: q.opties[q.goed] },
            { soort: 'tekst', tekst: q.uitleg },
          ],
        },
      ],
      toetsen: () => {
        const opties = schud(q.opties)
        return [{ vraag: q.situatie, opties, goed: opties.indexOf(q.opties[q.goed]), uitleg: q.uitleg }]
      },
    }))
  },
}

// ─── Voetbal ───

const voetbal: Leerstof = {
  moduleId: 'voetbal',
  perDag: 5,
  maxHerhaal: 6,
  enkelvoud: 'seizoen',
  meervoud: 'seizoenen',
  laad: async () => {
    const { datasets } = await import('../voetbal/data/datasets')
    return datasets.flatMap((d) => {
      const lijst = [...d.champions].filter((c) => c.winner).sort((a, b) => a.year - b.year)
      return lijst.map((c, i) => ({
        id: `${d.id}-${c.id}`,
        hoofdstuk: d.title,
        naam: `${d.shortTitle} ${c.season}`,
        kaarten: [
          {
            kop: `${d.shortTitle} ${c.season}`,
            ondertitel: d.title,
            beeld: { soort: 'groot', tekst: c.season },
            blokken: [
              { soort: 'regel', tekst: `${d.winnerNoun[0].toUpperCase()}${d.winnerNoun.slice(1)}: ${c.winner}` },
              {
                soort: 'feiten',
                rijen: [
                  ...(c.location ? ([[d.locationColumnLabel, c.location]] as [string, string][]) : []),
                  ...(c.extra ? ([['Ook', c.extra]] as [string, string][]) : []),
                  ...(c.note ? ([['Noot', c.note]] as [string, string][]) : []),
                ],
              },
            ],
          },
        ],
        toetsen: () => [mc(d.questionWinner(c.season), c.winner!, buren(lijst, i, 8).map((x) => x.winner!), { uitleg: `${c.season}: ${c.winner}.` })],
      }))
    })
  },
}

// ─── Weetjes ───

const weetjes: Leerstof = {
  moduleId: 'weetjes',
  perDag: 2,
  maxHerhaal: 4,
  enkelvoud: 'weetje',
  meervoud: 'weetjes',
  laad: async () => {
    const [{ WEETJES }, { FOTOS }] = await Promise.all([import('../weetjes/data'), import('../weetjes/fotos')])
    return WEETJES.map((w) => {
      const [kern] = eersteZin(w.uitleg)
      return {
        id: String(w.id),
        hoofdstuk: w.categorie,
        naam: w.vraag,
        kaarten: [
          {
            kop: w.categorie,
            blokken: [
              { soort: 'regel', tekst: w.vraag },
              ...(() => {
                const f = FOTOS[slug(w.categorie)] ?? []
                return fotoBlok(f.length ? [f[w.id % f.length]] : [])
              })(),
              ...w.uitleg.split(/(?<=[.!?])\s+(?=[A-Z])/).reduce<Blok[]>((acc, zin, i) => {
                // twee zinnen per alinea
                if (i % 2 === 0) acc.push({ soort: 'tekst', tekst: zin })
                else (acc[acc.length - 1] as { tekst: string }).tekst += ' ' + zin
                return acc
              }, []),
            ],
          },
        ],
        toetsen: () => [
          mc(`Welke verklaring hoort hierbij? ${w.vraag}`, kern, WEETJES.filter((x) => x.categorie === w.categorie && x.id !== w.id).map((x) => eersteZin(x.uitleg)[0])),
        ],
      }
    })
  },
}

// ─── Geld ───

const geld: Leerstof = {
  moduleId: 'geld',
  perDag: 4,
  maxHerhaal: 6,
  enkelvoud: 'bijnaam',
  meervoud: 'bijnamen',
  laad: async () => {
    const { GELD } = await import('../geld/data')
    return GELD.map((g) => ({
      id: g.bijnaam,
      hoofdstuk: g.groep,
      naam: g.bijnaam,
      kaarten: [
        {
          kop: g.bijnaam,
          ondertitel: g.groep,
          beeld: { soort: 'groot', tekst: g.waarde },
          blokken: [
            { soort: 'regel', tekst: `Een ${g.bijnaam} is ${g.waarde}.` },
            { soort: 'tekst', tekst: g.herkomst },
          ],
        },
      ],
      toetsen: () => [mc(`Wat betekent „${g.bijnaam}”?`, g.waarde, GELD.filter((x) => x.groep === g.groep).map((x) => x.waarde), { uitleg: g.herkomst })],
    }))
  },
}

// ─── Lessen (Elektronica, Voertuigtechniek) ───

type LesLike = {
  id: string
  categorie: string
  titel: string
  kern: string
  uitleg: string[]
  feiten?: string[]
  formules?: { formule: string; betekenis: string }[]
  letOp?: string
  vragen: { vraag: string; opties: string[]; goed: number; uitleg: string }[]
}

function lesNaarEenheid(l: LesLike, hoofdstuk: string, beelden: Blok[]): Eenheid {
  const tweede: Blok[] = [
    ...(l.formules ?? []).map((f) => ({ soort: 'formule', formule: f.formule, betekenis: f.betekenis }) as Blok),
    ...(l.feiten && l.feiten.length ? [{ soort: 'lijst', items: l.feiten } as Blok] : []),
    ...(l.letOp ? [{ soort: 'let', tekst: l.letOp } as Blok] : []),
  ]
  const kaarten: Kaart[] = [
    {
      kop: l.titel,
      ondertitel: hoofdstuk,
      blokken: [{ soort: 'regel', tekst: l.kern }, ...beelden, ...l.uitleg.map((t) => ({ soort: 'tekst', tekst: t }) as Blok)],
    },
  ]
  if (tweede.length) kaarten.push({ kop: `${l.titel}: om te onthouden`, blokken: tweede })
  return {
    id: l.id,
    hoofdstuk,
    naam: l.titel,
    kaarten,
    toetsen: () =>
      l.vragen.map((v) => {
        const opties = schud(v.opties)
        return { vraag: v.vraag, opties, goed: opties.indexOf(v.opties[v.goed]), uitleg: v.uitleg }
      }),
  }
}

const elektronica: Leerstof = {
  moduleId: 'elektronica',
  perDag: 1,
  maxHerhaal: 2,
  enkelvoud: 'les',
  meervoud: 'lessen',
  stapsgewijs: true,
  laad: async () => {
    const [{ LESSEN }, { CATEGORIEEN }, { FOTOS }] = await Promise.all([import('../elektronica/lessen'), import('../elektronica/types'), import('../elektronica/fotos')])
    return LESSEN.map((l) =>
      lesNaarEenheid(l, CATEGORIEEN.find((c) => c.id === l.categorie)?.titel ?? l.categorie, [
        ...(FOTOS[l.id]?.length ? [{ soort: 'beeld', beeld: { soort: 'fotos', fotos: FOTOS[l.id] } } as Blok] : []),
        ...(l.schema ? [{ soort: 'beeld', beeld: { soort: 'schema', id: l.schema } } as Blok] : []),
      ]),
    )
  },
}

const vervoer: Leerstof = {
  moduleId: 'vervoer',
  perDag: 1,
  maxHerhaal: 2,
  enkelvoud: 'les',
  meervoud: 'lessen',
  stapsgewijs: true,
  laad: async () => {
    const [{ LESSEN }, { CATEGORIEEN }, { FOTOS }] = await Promise.all([import('../vervoer/lessen'), import('../vervoer/types'), import('../vervoer/fotos')])
    return LESSEN.map((l) =>
      lesNaarEenheid(l, CATEGORIEEN.find((c) => c.id === l.categorie)?.titel ?? l.categorie, [
        ...(FOTOS[l.id]?.length ? [{ soort: 'beeld', beeld: { soort: 'fotos', fotos: FOTOS[l.id] } } as Blok] : []),
        ...(l.beeld ? [{ soort: 'beeld', beeld: { soort: 'vt', id: l.beeld } } as Blok] : []),
      ]),
    )
  },
}

// ─── Klussen: keuzehulp en storingen, per onderwerp ───

const klussen: Leerstof = {
  moduleId: 'klussen',
  perDag: 4,
  maxHerhaal: 6,
  enkelvoud: 'onderdeel',
  meervoud: 'onderdelen',
  laad: async () => {
    const [{ KEUZES, PROBLEMEN }, { ONDERWERPEN }, { FOTOS }] = await Promise.all([import('../klussen/data'), import('../klussen/types'), import('../klussen/fotos')])
    return ONDERWERPEN.flatMap((o) => {
      const keuzes = KEUZES.filter((k) => k.onderwerp === o.id)
      const problemen = PROBLEMEN.filter((p) => p.onderwerp === o.id)
      const fotoBlok = (id: string): Blok[] => (FOTOS[id]?.length ? [{ soort: 'beeld', beeld: { soort: 'fotos', fotos: FOTOS[id] } }] : [])
      const k: Eenheid[] = keuzes.map((k) => ({
        id: `keuze-${k.id}`,
        hoofdstuk: `${o.titel} — ${k.vraag}`,
        naam: k.keuze,
        kaarten: [
          {
            kop: k.vraag,
            ondertitel: o.titel,
            blokken: [
              { soort: 'tekst', tekst: `Situatie: ${k.situatie}` },
              ...fotoBlok(k.id),
              { soort: 'regel', tekst: k.keuze },
              { soort: 'tekst', tekst: k.waarom },
              ...(k.specs?.length ? [{ soort: 'lijst', items: k.specs } as Blok] : []),
              ...(k.nietGebruiken ? [{ soort: 'let', tekst: `Niet: ${k.nietGebruiken}` } as Blok] : []),
            ],
          },
        ],
        toetsen: () => [mc(`${k.vraag} ${k.situatie}`, k.keuze, keuzes.filter((x) => x.vraag === k.vraag).map((x) => x.keuze), { uitleg: k.waarom })],
      }))
      const p: Eenheid[] = problemen.map((p) => {
        const juist = p.oorzaken.find((x) => x.juist)?.oorzaak ?? ''
        return {
          id: `mis-${p.id}`,
          hoofdstuk: `${o.titel} — wat ging er mis?`,
          naam: p.symptoom,
          kaarten: [
            {
              kop: 'Wat ging er mis?',
              ondertitel: o.titel,
              blokken: [
                { soort: 'tekst', tekst: `Je ziet: ${p.symptoom}` },
                ...fotoBlok(p.id),
                { soort: 'regel', tekst: `Oorzaak: ${juist}` },
                { soort: 'tekst', tekst: p.uitleg },
                { soort: 'feiten', rijen: [['Herstellen', p.oplossing], ['Voorkomen', p.voorkomen]] },
              ],
            },
          ],
          toetsen: () => {
            const opties = schud(p.oorzaken.map((x) => x.oorzaak))
            return [{ vraag: `Wat is de oorzaak? ${p.symptoom}`, opties, goed: opties.indexOf(juist), uitleg: p.uitleg }]
          },
        }
      })
      return [...k, ...p]
    })
  },
}

// ─── Bridge: de dagcursus ───

const bridge: Leerstof = {
  moduleId: 'bridge',
  perDag: 1,
  maxHerhaal: 2,
  enkelvoud: 'les',
  meervoud: 'lessen',
  stapsgewijs: true,
  laad: async () => {
    const { DAGCURSUS } = await import('../bridge/dagcursus')
    return DAGCURSUS.map((l) => {
      // de blokken verdelen over kaarten van ongeveer drie blokken
      const kaarten: Kaart[] = []
      let huidig: Blok[] = [{ soort: 'regel', tekst: l.kern }]
      const sluit = () => {
        if (huidig.length) kaarten.push({ kop: l.titel, ondertitel: `${l.deel} · deel ${kaarten.length + 1}`, blokken: huidig })
        huidig = []
      }
      for (const b of l.blokken) {
        if (b.soort === 'hand') huidig.push({ soort: 'beeld', beeld: { soort: 'hand', hand: b.hand }, bijschrift: '' }, { soort: 'regel', tekst: b.titel }, { soort: 'tekst', tekst: b.uitleg })
        else if (b.soort === 'serie') huidig.push({ soort: 'serie', stappen: b.stappen, uitleg: b.uitleg })
        else huidig.push(b as Blok)
        if (huidig.length >= 4) sluit()
      }
      sluit()
      return {
        id: l.id,
        hoofdstuk: l.deel,
        naam: l.titel,
        kaarten,
        toetsen: () =>
          l.vragen.map((v) => {
            const opties = schud(v.opties)
            return { vraag: v.vraag, beeld: v.hand ? { soort: 'hand', hand: v.hand } : undefined, opties, goed: opties.indexOf(v.opties[v.goed]), uitleg: v.uitleg }
          }),
      }
    })
  },
}

export const LEERSTOF: Record<string, Leerstof> = Object.fromEntries(
  [topografie, geschiedenis, europa, kerk, rangen, vogels, planten, knopen, seinen, klaverjas, voetbal, weetjes, geld, elektronica, vervoer, klussen, bridge].map((l) => [l.moduleId, l]),
)

// Leerlijnen worden één keer per sessie geladen.
const cache = new Map<string, Promise<Eenheid[]>>()
export function laadLeerlijn(moduleId: string): Promise<Eenheid[]> {
  const l = LEERSTOF[moduleId]
  if (!l) return Promise.resolve([])
  let p = cache.get(moduleId)
  if (!p) {
    p = l.laad()
    cache.set(moduleId, p)
  }
  return p
}
