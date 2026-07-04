import { useEffect, useMemo, useState } from 'react'
import LeerShell from '../leer/LeerShell'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { pickRandom, shuffle } from '../leer/match'
import { ALLES, GESORTEERD, jaarLabel, type HistItem } from './data'
import { STATEN } from './staten'
import './geschiedenis.css'

const ACCENT = '#7a4a1f'
const BLOK_GROOTTE = 10

const GEBEURTENISSEN = ALLES.filter((i) => i.soort === 'gebeurtenis')
const PERSONEN = ALLES.filter((i) => i.soort === 'persoon')

type QuizSoort = 'jaar-titel' | 'titel-jaar' | 'omschrijving-titel' | 'wie-was' | 'wat-eerder' | 'mix'

const QUIZZEN: { id: QuizSoort; titel: string; uitleg: string }[] = [
  { id: 'jaar-titel', titel: 'Jaar → gebeurtenis', uitleg: 'Wat gebeurde er in dit jaar?' },
  { id: 'titel-jaar', titel: 'Gebeurtenis → jaar', uitleg: 'Wanneer gebeurde dit?' },
  { id: 'omschrijving-titel', titel: 'Verhaal → gebeurtenis', uitleg: 'Herken de gebeurtenis aan de omschrijving.' },
  { id: 'wie-was', titel: 'Wie was het?', uitleg: 'Herken de persoon aan de omschrijving.' },
  { id: 'wat-eerder', titel: 'Wat kwam eerder?', uitleg: 'Zet twee gebeurtenissen in de juiste volgorde.' },
  { id: 'mix', titel: 'Mix', uitleg: 'Twintig vragen, alles door elkaar.' },
]

// n afleiders met een uniek jaarlabel/titel
function metAfleiders(pool: HistItem[], item: HistItem, key: (i: HistItem) => string): HistItem[] {
  const gezien = new Set([key(item)])
  const rest = shuffle(pool).filter((i) => {
    if (gezien.has(key(i))) return false
    gezien.add(key(i))
    return true
  })
  return shuffle([item, ...rest.slice(0, 3)])
}

function vraagJaarTitel(pool: HistItem[]): Vraag {
  const item = pickRandom(pool)
  const opts = metAfleiders(pool, item, (i) => i.titel)
  return {
    prompt: <>Wat gebeurde er in <strong>{jaarLabel(item)}</strong>?</>,
    options: opts.map((i) => i.titel),
    correct: opts.findIndex((i) => i === item),
    explain: `${jaarLabel(item)} — ${item.titel}: ${item.uitleg}`,
  }
}

function vraagTitelJaar(pool: HistItem[]): Vraag {
  const item = pickRandom(pool)
  const opts = metAfleiders(pool, item, (i) => jaarLabel(i))
  return {
    prompt: <>In welk jaar: <strong>{item.titel}</strong>?</>,
    options: opts.map((i) => jaarLabel(i)),
    correct: opts.findIndex((i) => i === item),
    explain: `${item.titel}: ${jaarLabel(item)}. ${item.uitleg}`,
  }
}

function vraagOmschrijvingTitel(pool: HistItem[]): Vraag {
  const item = pickRandom(pool)
  const opts = metAfleiders(pool, item, (i) => i.titel)
  return {
    prompt: <><em>{item.uitleg}</em><br />Welke gebeurtenis is dit?</>,
    options: opts.map((i) => i.titel),
    correct: opts.findIndex((i) => i === item),
    explain: `${item.titel} (${jaarLabel(item)})`,
  }
}

function vraagWieWas(): Vraag {
  const item = pickRandom(PERSONEN)
  const opts = metAfleiders(PERSONEN, item, (i) => i.titel)
  return {
    prompt: <><em>{item.uitleg}</em><br />Over wie gaat dit?</>,
    options: opts.map((i) => i.titel),
    correct: opts.findIndex((i) => i === item),
    explain: `${item.titel} (${jaarLabel(item)})`,
  }
}

function vraagWatEerder(pool: HistItem[]): Vraag {
  const a = pickRandom(pool)
  let b = pickRandom(pool)
  let poging = 0
  while ((b === a || Math.abs(b.jaar - a.jaar) < 8) && poging < 25) {
    b = pickRandom(pool)
    poging += 1
  }
  const paar = shuffle([a, b])
  const eerste = a.jaar < b.jaar ? a : b
  const tweede = eerste === a ? b : a
  return {
    prompt: <>Wat kwam <strong>eerder</strong>?</>,
    options: paar.map((i) => i.titel),
    correct: paar.findIndex((i) => i === eerste),
    explain: `${eerste.titel} (${jaarLabel(eerste)}) kwam vóór ${tweede.titel} (${jaarLabel(tweede)}).`,
  }
}

function maakQuiz(soort: QuizSoort): Vraag[] {
  const n = soort === 'mix' ? 20 : 15
  return Array.from({ length: n }, () => {
    const s = soort === 'mix' ? pickRandom(['jaar-titel', 'titel-jaar', 'omschrijving-titel', 'wie-was', 'wat-eerder'] as const) : soort
    switch (s) {
      case 'jaar-titel': return vraagJaarTitel(GEBEURTENISSEN)
      case 'titel-jaar': return vraagTitelJaar(GEBEURTENISSEN)
      case 'omschrijving-titel': return vraagOmschrijvingTitel(GEBEURTENISSEN)
      case 'wie-was': return vraagWieWas()
      default: return vraagWatEerder(GEBEURTENISSEN)
    }
  })
}

// Blok-quiz: vragen alleen over de tien items van dit blok
function maakBlokQuiz(blok: HistItem[]): Vraag[] {
  return shuffle(blok).map((item) => {
    const opts = metAfleiders(ALLES, item, (i) => jaarLabel(i))
    return {
      prompt: <>In welk jaar{item.soort === 'persoon' ? ' leefde' : ''}: <strong>{item.titel}</strong>?</>,
      options: opts.map((i) => jaarLabel(i)),
      correct: opts.findIndex((i) => i === item),
      explain: `${item.titel}: ${jaarLabel(item)}. ${item.uitleg}`,
    }
  })
}

export default function GeschiedenisApp() {
  const [tab, setTab] = useState('tijdlijn')
  const [quiz, setQuiz] = useState<QuizSoort | null>(null)
  const [blokIdx, setBlokIdx] = useState(0)
  const [blokQuiz, setBlokQuiz] = useState(false)
  const [actiefAnker, setActiefAnker] = useState(STATEN[0].anker)

  const blokken = useMemo(() => {
    const out: HistItem[][] = []
    for (let i = 0; i < GESORTEERD.length; i += BLOK_GROOTTE) out.push(GESORTEERD.slice(i, i + BLOK_GROOTTE))
    return out
  }, [])

  const blok = blokken[blokIdx]

  // Scrollspy: markeer in de zij-tijdlijn de sectie die in beeld is.
  useEffect(() => {
    if (tab !== 'tijdlijn') return
    const secties = STATEN.map((s) => document.getElementById(`sectie-${s.anker}`)).filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver(
      (entries) => {
        const zichtbaar = entries.filter((e) => e.isIntersecting)
        if (zichtbaar.length > 0) {
          setActiefAnker(zichtbaar[0].target.id.replace('sectie-', ''))
        }
      },
      { rootMargin: '-15% 0px -70% 0px' },
    )
    secties.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [tab])

  function scrollNaar(anker: string) {
    setActiefAnker(anker)
    document.getElementById(`sectie-${anker}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <LeerShell
      mark="NL"
      accent={ACCENT}
      title="Geschiedenis van Nederland"
      subtitle={`${ALLES.length} gebeurtenissen en personen sinds 1300`}
      tabs={[
        { id: 'tijdlijn', label: 'Artikel' },
        { id: 'personen', label: 'Personen' },
        { id: 'leren', label: 'Leren in blokken' },
        { id: 'overhoren', label: 'Overhoren' },
      ]}
      active={tab}
      onSelect={(id) => { setTab(id); setQuiz(null); setBlokQuiz(false) }}
      footnote={<p>Selectie op hoofdlijnen; indeling naar de tijdvakken van de <a href="https://nl.wikipedia.org/wiki/Tijdlijn_van_de_Nederlandse_geschiedenis" target="_blank" rel="noreferrer">Wikipedia-tijdlijn van de Nederlandse geschiedenis</a> · kaarten en afbeeldingen via Wikimedia Commons.</p>}
    >
      {tab === 'tijdlijn' && (
        <div className="gs-artikel-layout">
          <nav className="gs-zijlijn" aria-label="Tijdvakken">
            <p className="gs-zijlijn-kop">Tijdlijn</p>
            {STATEN.map((s) => (
              <button
                key={s.anker}
                type="button"
                className={`gs-zijlijn-item${actiefAnker === s.anker ? ' active' : ''}`}
                onClick={() => scrollNaar(s.anker)}
              >
                <span className="gs-zijlijn-jaren km-num">{s.jaren}</span>
                <span className="gs-zijlijn-staat">{s.staat}</span>
              </button>
            ))}
          </nav>

          <article className="gs-artikel">
            <div className="km-page-head">
              <p className="km-eyebrow">Geschiedenis van Nederland</p>
              <h1>Van gewesten tot koninkrijk</h1>
              <p>Acht tijdvakken: welk rijk was "Nederland" toen, hoe kwam dat zo — en wat gebeurde er.</p>
            </div>

            {STATEN.map((s) => (
              <section key={s.anker} id={`sectie-${s.anker}`} className="gs-sectie">
                <h2>{s.periode}</h2>

                <aside className="gs-infobox">
                  {s.kaart && (
                    <figure>
                      <img src={`/geschiedenis/${s.kaart.file}`} alt={s.kaart.caption} loading="lazy" />
                      <figcaption>{s.kaart.caption}</figcaption>
                    </figure>
                  )}
                  <dl>
                    <dt>Staat</dt>
                    <dd>{s.staat}</dd>
                    <dt>Jaren</dt>
                    <dd>{s.jaren}</dd>
                    <dt>Staatsvorm</dt>
                    <dd>{s.staatsvorm}</dd>
                  </dl>
                </aside>

                {s.verhaal.map((alinea, i) => (
                  <p className="gs-alinea" key={i}>{alinea}</p>
                ))}

                {s.extra && (
                  <figure className="gs-figuur">
                    <img src={`/geschiedenis/${s.extra.file}`} alt={s.extra.caption} loading="lazy" />
                    <figcaption>{s.extra.caption}</figcaption>
                  </figure>
                )}
              </section>
            ))}
          </article>
        </div>
      )}

      {tab === 'personen' && (
        <>
          <div className="km-page-head">
            <p className="km-eyebrow">Personen</p>
            <h1>Wie moet je kennen?</h1>
          </div>
          <div className="km-grid">
            {[...PERSONEN].sort((a, b) => a.jaar - b.jaar).map((p) => (
              <div className="km-card" key={p.titel}>
                <span className="km-card-sub">{jaarLabel(p)}</span>
                <h3>{p.titel}</h3>
                <p>{p.uitleg}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'leren' && !blokQuiz && (
        <>
          <div className="km-page-head">
            <p className="km-eyebrow">Leren in blokken</p>
            <h1>Blok {blokIdx + 1} van {blokken.length}</h1>
            <p>Neem deze {blok.length} items door en overhoor jezelf daarna over precies dit blok.</p>
          </div>
          <div className="gs-blok-nav">
            <button type="button" className="km-btn km-btn-secondary" disabled={blokIdx === 0} onClick={() => setBlokIdx((i) => i - 1)}>← Vorig blok</button>
            <button type="button" className="km-btn km-btn-primary" onClick={() => setBlokQuiz(true)}>Overhoor dit blok</button>
            <button type="button" className="km-btn km-btn-secondary" disabled={blokIdx === blokken.length - 1} onClick={() => setBlokIdx((i) => i + 1)}>Volgend blok →</button>
          </div>
          <div className="gs-lijst">
            {blok.map((item) => (
              <article className={`gs-item${item.soort === 'persoon' ? ' gs-persoon' : ''}`} key={`${item.jaar}-${item.titel}`}>
                <span className="gs-jaar km-num">{jaarLabel(item)}</span>
                <div>
                  <strong>{item.titel}</strong>
                  {item.soort === 'persoon' && <span className="gs-tag">persoon</span>}
                  <p>{item.uitleg}</p>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {tab === 'leren' && blokQuiz && (
        <>
          <div className="km-back-row">
            <button type="button" className="km-btn km-btn-secondary" onClick={() => setBlokQuiz(false)}>← Terug naar blok {blokIdx + 1}</button>
          </div>
          <QuizRunner maak={() => maakBlokQuiz(blok)} herstartLabel="Blok opnieuw" />
        </>
      )}

      {tab === 'overhoren' && quiz === null && (
        <>
          <div className="km-page-head">
            <p className="km-eyebrow">Overhoren</p>
            <h1>Kies een overhoring</h1>
          </div>
          <div className="km-quiz-menu">
            {QUIZZEN.map((q) => (
              <button key={q.id} type="button" className="km-card" onClick={() => setQuiz(q.id)}>
                <h3>{q.titel}</h3>
                <p>{q.uitleg}</p>
              </button>
            ))}
          </div>
        </>
      )}

      {tab === 'overhoren' && quiz !== null && (
        <>
          <div className="km-back-row">
            <button type="button" className="km-btn km-btn-secondary" onClick={() => setQuiz(null)}>← Andere overhoring</button>
          </div>
          <QuizRunner maak={() => maakQuiz(quiz)} />
        </>
      )}
    </LeerShell>
  )
}
