// Per module: hoe je de items laadt en hoe één item als dagkaart oogt.
// Data wordt pas geladen als de dagtrainer opent (dynamische imports).

export type Beeld =
  | { soort: 'img'; src: string; alt: string; vorm?: 'foto' | 'object' }
  | { soort: 'groot'; tekst: string }
  | { soort: 'seinvlag'; letter: string }
  | { soort: 'hand'; kleuren: { symbool: string; rood: boolean; kaarten: string }[]; punten: number }

export type DagItem = {
  id: string
  label: string // korte titel, ook zichtbaar in het overzicht
  vraag: string
  beeld?: Beeld
  antwoord: string
  extra?: string
  geluid?: string
}

export type Bron = {
  moduleId: string
  laad: () => Promise<DagItem[]>
}

// Kleine, deterministische PRNG: zelfde volgorde op elk apparaat.
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Per ronde een nieuwe schudvolgorde; binnen een ronde komt elk item één keer.
export function kiesVanDag<T>(items: T[], sleutel: string, dag: number): T {
  const n = items.length
  const ronde = Math.floor(dag / n)
  const plek = ((dag % n) + n) % n
  const rnd = mulberry32(hash(`${sleutel}#${ronde}`))
  const volgorde = items.map((_, i) => i)
  for (let i = n - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1))
    ;[volgorde[i], volgorde[j]] = [volgorde[j], volgorde[i]]
  }
  return items[volgorde[plek]]
}

function splitsEersteZin(tekst: string): [string, string | undefined] {
  const eerste = tekst.match(/^.+?[.!?](\s|$)/)?.[0].trim() ?? tekst
  const rest = tekst.slice(eerste.length).trim()
  return [eerste, rest || undefined]
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

const CONTINENT: Record<string, string> = {
  Afrika: 'Afrika',
  Azie: 'Azië',
  Europa: 'Europa',
  'Noord-Amerika': 'Noord-Amerika',
  'Zuid-Amerika': 'Zuid-Amerika',
  Oceanie: 'Oceanië',
}

export const BRONNEN: Bron[] = [
  {
    moduleId: 'topografie',
    laad: async () => {
      const { countries } = await import('../data/countries')
      return countries
        .filter((c) => c.capital)
        .map((c) => ({
          id: c.id,
          label: c.name,
          vraag: `Wat is de hoofdstad van ${c.name}, en waar ligt het?`,
          beeld: { soort: 'groot' as const, tekst: c.flag },
          antwoord: c.capitals.length > 1 ? c.capitals.join(' / ') : c.capital,
          extra: [CONTINENT[c.continent] ?? c.continent, SUBREGIO[c.subregion] ?? c.subregion].filter(Boolean).join(' · '),
        }))
    },
  },
  {
    moduleId: 'europa',
    laad: async () => {
      const { MACHTEN } = await import('../europa/data')
      return MACHTEN.map((m) => ({
        id: m.id,
        label: m.periode,
        vraag: `Wie had de macht in ${m.gebied}, ${m.periode}?`,
        antwoord: m.macht,
        extra: m.uitleg,
      }))
    },
  },
  {
    moduleId: 'geschiedenis',
    laad: async () => {
      const { ALLES, jaarLabel } = await import('../geschiedenis/data')
      return ALLES.map((h, i) => ({
        id: `${h.jaar}-${i}`,
        label: h.titel,
        vraag: h.soort === 'persoon' ? `${h.titel} — wie was dit, en wanneer leefde hij of zij?` : `${h.titel} — wanneer was dit, en wat gebeurde er?`,
        antwoord: jaarLabel(h),
        extra: h.uitleg,
      }))
    },
  },
  {
    moduleId: 'kerk',
    laad: async () => {
      const { ALLE_POSITIES } = await import('../kerk/data')
      return ALLE_POSITIES.map((p) => {
        const [antwoord, extra] = splitsEersteZin(p.omschrijving)
        return {
          id: p.id,
          label: p.naam,
          vraag: `Wat is een ${p.naam.toLowerCase()}, en waar staat die in de hiërarchie?`,
          beeld: p.wapen ? { soort: 'img' as const, src: `/kerk/${p.wapen}`, alt: `Wapen: ${p.naam}`, vorm: 'object' as const } : undefined,
          antwoord,
          extra,
        }
      })
    },
  },
  {
    moduleId: 'rangen',
    laad: async () => {
      const [{ ONDERDELEN }, { INSIGNES }] = await Promise.all([import('../rangen/data'), import('../rangen/insignes')])
      return ONDERDELEN.flatMap((o) =>
        o.rangen.map((r, i) => {
          const file = INSIGNES[`${o.id}|${r.naam}`]
          return {
            id: `${o.id}|${r.naam}`,
            label: r.naam,
            vraag: `Bij de ${o.naam.toLowerCase()}: welke rang hoort bij dit onderscheidingsteken?`,
            beeld: file ? { soort: 'img' as const, src: `/rangen/${file}`, alt: 'Onderscheidingsteken', vorm: 'object' as const } : undefined,
            antwoord: r.naam,
            extra: `${o.naam} · ${r.cluster} · nummer ${i + 1} van ${o.rangen.length} van hoog naar laag${r.detail ? ` · ${r.detail}` : ''}`,
          }
        }),
      ).filter((x) => x.beeld)
    },
  },
  {
    moduleId: 'vogels',
    laad: async () => {
      const { VOGELS } = await import('../vogels/data')
      return VOGELS.filter((v) => v.foto).map((v) => ({
        id: v.id,
        label: v.naam,
        vraag: 'Welke vogel is dit?',
        beeld: { soort: 'img' as const, src: `/vogels/${v.foto}`, alt: 'Welke vogel is dit?', vorm: 'foto' as const },
        antwoord: `${v.naam} (${v.latijn})`,
        extra: `${v.uiterlijk} Geluid: ${v.geluid}`,
        geluid: v.geluidUrl,
      }))
    },
  },
  {
    moduleId: 'knopen',
    laad: async () => {
      const { KNOPEN } = await import('../knopen/data')
      return KNOPEN.map((k) => ({
        id: k.id,
        label: k.naam,
        vraag: 'Welke knoop is dit, en waarvoor gebruik je hem?',
        beeld: { soort: 'img' as const, src: k.afbeelding, alt: 'Welke knoop is dit?', vorm: 'foto' as const },
        antwoord: `${k.naam} (${k.engels})`,
        extra: `${k.doel}. ${k.onthoud ?? k.uitleg}`,
      }))
    },
  },
  {
    moduleId: 'seinen',
    laad: async () => {
      const { SEINEN } = await import('../seinen/data')
      return SEINEN.map((s) => ({
        id: s.letter,
        label: `Vlag ${s.letter}`,
        vraag: 'Welke letter is deze seinvlag, en wat betekent hij alleen gehesen?',
        beeld: { soort: 'seinvlag' as const, letter: s.letter },
        antwoord: `${s.letter} — ${s.navo}`,
        extra: `${s.betekenis} Morse: ${s.morse}`,
      }))
    },
  },
  {
    moduleId: 'bridge',
    laad: async () => {
      const { KLEUREN, KLEUR_SYMBOOL, hcp, openingsbod, legUitOpening, rangLabel } = await import('../bridge/kaarten')
      // 120 vaste oefenhanden; de volgorde rouleert net als bij de andere modules
      const handen = [] as DagItem[]
      for (let n = 0; handen.length < 120 && n < 2000; n += 1) {
        const rnd = mulberry32(hash(`bridge-hand-${n}`))
        const dek: { k: (typeof KLEUREN)[number]; r: number }[] = []
        for (const k of KLEUREN) for (let r = 2; r <= 14; r += 1) dek.push({ k, r })
        for (let i = dek.length - 1; i > 0; i -= 1) {
          const j = Math.floor(rnd() * (i + 1))
          ;[dek[i], dek[j]] = [dek[j], dek[i]]
        }
        const hand = { S: [] as number[], H: [] as number[], D: [] as number[], C: [] as number[] }
        for (const c of dek.slice(0, 13)) hand[c.k].push(c.r)
        for (const k of KLEUREN) hand[k].sort((a, b) => b - a)
        const bod = openingsbod(hand)
        if (!bod) continue
        handen.push({
          id: `hand-${n}`,
          label: `Hand ${handen.length + 1}`,
          vraag: 'Je bent gever. Wat open je?',
          beeld: {
            soort: 'hand',
            punten: hcp(hand),
            kleuren: KLEUREN.map((k) => ({
              symbool: KLEUR_SYMBOOL[k],
              rood: k === 'H' || k === 'D',
              kaarten: hand[k].map(rangLabel).join(' ') || '—',
            })),
          },
          antwoord: bod === 'pas' ? 'Pas' : bod,
          extra: legUitOpening(hand, bod),
        })
      }
      return handen
    },
  },
  {
    moduleId: 'klaverjas',
    laad: async () => {
      const { REGEL_VRAGEN } = await import('../klaverjas/data')
      return REGEL_VRAGEN.map((q, i) => ({
        id: `regel-${i}`,
        label: `Spelregel ${i + 1}`,
        vraag: q.situatie,
        antwoord: q.opties[q.goed],
        extra: q.uitleg,
      }))
    },
  },
  {
    moduleId: 'voetbal',
    laad: async () => {
      const { datasets } = await import('../voetbal/data/datasets')
      return datasets.flatMap((d) =>
        d.champions
          .filter((c) => c.winner)
          .map((c) => ({
            id: `${d.id}-${c.id}`,
            label: `${d.shortTitle} ${c.season}`,
            vraag: d.questionWinner(c.season),
            beeld: { soort: 'groot' as const, tekst: c.season },
            antwoord: c.winner!,
            extra: [d.title, c.location, c.extra, c.note].filter(Boolean).join(' · '),
          })),
      )
    },
  },
  {
    moduleId: 'weetjes',
    laad: async () => {
      const { WEETJES } = await import('../weetjes/data')
      return WEETJES.map((w) => {
        const [antwoord, extra] = splitsEersteZin(w.uitleg)
        return { id: String(w.id), label: w.categorie, vraag: w.vraag, antwoord, extra }
      })
    },
  },
  {
    moduleId: 'geld',
    laad: async () => {
      const { GELD } = await import('../geld/data')
      return GELD.map((g) => ({
        id: g.bijnaam,
        label: g.bijnaam,
        vraag: `Wat betekent „${g.bijnaam}”?`,
        beeld: { soort: 'groot' as const, tekst: g.bijnaam },
        antwoord: g.waarde,
        extra: `${g.groep}. ${g.herkomst}`,
      }))
    },
  },
]
