import { useEffect, useState } from 'react'
import LeerShell from '../leer/LeerShell'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { distractors, pickRandom, shuffle } from '../leer/match'
import { MACHTEN, type Macht } from './data'
import { LANDEN } from './kaarten'
import { ARTIKEL } from './artikel'
import './europa.css'

const ACCENT = '#245c8f'

type QuizSoort = 'macht-periode' | 'macht-gebied' | 'wat-eerder' | 'omschrijving-macht' | 'land-ontstaan' | 'mix'

const QUIZZEN: { id: QuizSoort; titel: string; uitleg: string }[] = [
  { id: 'omschrijving-macht', titel: 'Omschrijving → macht', uitleg: 'Herken de macht aan de omschrijving.' },
  { id: 'macht-periode', titel: 'Macht → periode', uitleg: 'Wanneer had deze macht de overhand?' },
  { id: 'macht-gebied', titel: 'Macht → gebied', uitleg: 'Waar regeerde deze macht?' },
  { id: 'wat-eerder', titel: 'Wat kwam eerder?', uitleg: 'Zet twee machten in de juiste volgorde.' },
  { id: 'land-ontstaan', titel: 'Ontstaan van landen', uitleg: 'Wanneer en hoe ontstonden de huidige landen?' },
  { id: 'mix', titel: 'Mix', uitleg: 'Alle vraagsoorten door elkaar.' },
]

function vraagMachtPeriode(m: Macht): Vraag {
  const opts = shuffle([m, ...distractors(MACHTEN, m, 3, (x) => x.id)])
  return {
    prompt: <>In welke periode hoort <strong>{m.macht}</strong>?</>,
    options: opts.map((x) => x.periode),
    correct: opts.findIndex((x) => x.id === m.id),
    explain: `${m.macht} (${m.periode}): ${m.uitleg}`,
  }
}

function vraagMachtGebied(m: Macht): Vraag {
  const opts = shuffle([m, ...distractors(MACHTEN, m, 3, (x) => x.id)])
  return {
    prompt: <>Waar had <strong>{m.macht}</strong> de macht?</>,
    options: opts.map((x) => x.gebied),
    correct: opts.findIndex((x) => x.id === m.id),
    explain: m.uitleg,
  }
}

function vraagOmschrijvingMacht(m: Macht): Vraag {
  const opts = shuffle([m, ...distractors(MACHTEN, m, 3, (x) => x.id)])
  return {
    prompt: <><em>{m.uitleg}</em><br />Over wie of wat gaat dit?</>,
    options: opts.map((x) => x.macht),
    correct: opts.findIndex((x) => x.id === m.id),
    explain: `${m.macht} — ${m.periode}, ${m.gebied.toLowerCase()}.`,
  }
}

function vraagWatEerder(): Vraag {
  const a = pickRandom(MACHTEN)
  let b = pickRandom(MACHTEN)
  while (Math.abs(b.start - a.start) < 30) b = pickRandom(MACHTEN)
  const paar = shuffle([a, b])
  const eerste = a.start < b.start ? a : b
  return {
    prompt: <>Wat kwam <strong>eerder</strong>?</>,
    options: paar.map((m) => `${m.macht}`),
    correct: paar.findIndex((m) => m.id === eerste.id),
    explain: `${eerste.macht} (${eerste.periode}) kwam vóór ${(eerste.id === a.id ? b : a).macht} (${(eerste.id === a.id ? b : a).periode}).`,
  }
}

function vraagLandOntstaan(): Vraag {
  const land = pickRandom(LANDEN)
  const opts = shuffle([land, ...distractors(LANDEN, land, 3, (l) => l.land)])
  if (Math.random() < 0.5) {
    return {
      prompt: <>Wanneer ontstond <strong>{land.land}</strong> (in zijn huidige vorm)?</>,
      options: opts.map((l) => l.jaar),
      correct: opts.findIndex((l) => l.land === land.land),
      explain: `${land.land} (${land.jaar}): ${land.hoe}`,
    }
  }
  return {
    prompt: <><em>{land.hoe}</em><br />Over welk land gaat dit?</>,
    options: opts.map((l) => l.land),
    correct: opts.findIndex((l) => l.land === land.land),
    explain: `${land.land} — ${land.jaar}.`,
  }
}

function maakQuiz(soort: QuizSoort): Vraag[] {
  return Array.from({ length: 15 }, () => {
    const s = soort === 'mix' ? pickRandom(['macht-periode', 'macht-gebied', 'wat-eerder', 'omschrijving-macht', 'land-ontstaan'] as const) : soort
    if (s === 'wat-eerder') return vraagWatEerder()
    if (s === 'land-ontstaan') return vraagLandOntstaan()
    const m = pickRandom(MACHTEN)
    if (s === 'macht-periode') return vraagMachtPeriode(m)
    if (s === 'macht-gebied') return vraagMachtGebied(m)
    return vraagOmschrijvingMacht(m)
  })
}

export default function EuropaApp() {
  const [tab, setTab] = useState('leren')
  const [quiz, setQuiz] = useState<QuizSoort | null>(null)
  const [actiefAnker, setActiefAnker] = useState(ARTIKEL[0].anker)

  // Scrollspy voor de zij-tijdlijn
  useEffect(() => {
    if (tab !== 'leren') return
    const secties = ARTIKEL.map((s) => document.getElementById(`eu-${s.anker}`)).filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver(
      (entries) => {
        const zichtbaar = entries.filter((e) => e.isIntersecting)
        if (zichtbaar.length > 0) setActiefAnker(zichtbaar[0].target.id.replace('eu-', ''))
      },
      { rootMargin: '-15% 0px -70% 0px' },
    )
    secties.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [tab])

  function scrollNaar(anker: string) {
    setActiefAnker(anker)
    document.getElementById(`eu-${anker}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <LeerShell
      mark="EU"
      accent={ACCENT}
      title="Europa in vogelvlucht"
      subtitle="Wie had wanneer de macht, en waar"
      tabs={[{ id: 'leren', label: 'Artikel' }, { id: 'landen', label: 'Ontstaan van landen' }, { id: 'overhoren', label: 'Overhoren' }]}
      active={tab}
      onSelect={(id) => { setTab(id); setQuiz(null) }}
      footnote={<p>Bewust beknopt: de grote lijnen van de Europese machtsgeschiedenis · kaarten via Wikimedia Commons.</p>}
    >
      {tab === 'leren' && (
        <div className="gs-artikel-layout">
          <nav className="gs-zijlijn" aria-label="Tijdvakken">
            <p className="gs-zijlijn-kop">Tijdlijn</p>
            {ARTIKEL.map((s) => (
              <button
                key={s.anker}
                type="button"
                className={`gs-zijlijn-item${actiefAnker === s.anker ? ' active' : ''}`}
                onClick={() => scrollNaar(s.anker)}
              >
                <span className="gs-zijlijn-jaren km-num">{s.jaren}</span>
                <span className="gs-zijlijn-staat">{s.titel}</span>
              </button>
            ))}
          </nav>

          <article className="gs-artikel">
            <div className="km-page-head">
              <p className="km-eyebrow">Geschiedenis van Europa</p>
              <h1>Van Minoërs tot Europese Unie</h1>
              <p>Hoe de grond van Europa telkens opnieuw verdeeld werd — verteld per tijdvak, met de kaart erbij.</p>
            </div>

            {ARTIKEL.map((s) => (
              <section key={s.anker} id={`eu-${s.anker}`} className="gs-sectie">
                <h2>{s.titel} <span className="eu-sectie-jaren km-num">({s.jaren})</span></h2>
                {s.alineas.map((alinea, i) => (
                  <p className="gs-alinea" key={i}>{alinea}</p>
                ))}
                {s.kaarten.length > 0 && (
                  <div className="eu-kaarten">
                    {s.kaarten.map((k) => (
                      <figure className="eu-kaart" key={k.file}>
                        <img src={`/europa/${k.file}`} alt={k.titel} loading="lazy" />
                        <figcaption>
                          <strong>{k.titel}</strong>
                          <p>{k.uitleg}</p>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </article>
        </div>
      )}

      {tab === 'landen' && (
        <>
          <div className="km-page-head">
            <p className="km-eyebrow">Ontstaan van landen</p>
            <h1>Wanneer ontstonden de landen van Europa?</h1>
            <p>Van Portugal (1143) tot Kosovo (2008): de momenten waarop de huidige staten hun vorm kregen.</p>
          </div>
          <div className="km-table-wrap">
            <table className="km-table">
              <thead>
                <tr><th>Land</th><th>Ontstaan</th><th>Hoe</th></tr>
              </thead>
              <tbody>
                {[...LANDEN].sort((a, b) => a.sorteer - b.sorteer).map((l) => (
                  <tr key={l.land}>
                    <td><strong>{l.land}</strong></td>
                    <td className="km-num">{l.jaar}</td>
                    <td>{l.hoe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
