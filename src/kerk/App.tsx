import { useState } from 'react'
import LeerShell from '../leer/LeerShell'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { distractors, pickRandom, shuffle } from '../leer/match'
import { ALLE_POSITIES, LADDER, SECTIES, type Positie } from './data'
import './kerk.css'

const ACCENT = '#6b3a5b'

type QuizSoort = 'wie-hoger' | 'positie-taak' | 'taak-positie' | 'wapen' | 'mix'

const QUIZZEN: { id: QuizSoort; titel: string; uitleg: string }[] = [
  { id: 'wie-hoger', titel: 'Wie staat hoger?', uitleg: 'Kies van twee posities de hoogste in de hiërarchie.' },
  { id: 'positie-taak', titel: 'Positie → rol', uitleg: 'Wat doet deze positie?' },
  { id: 'taak-positie', titel: 'Rol → positie', uitleg: 'Welke positie hoort bij deze rol?' },
  { id: 'wapen', titel: 'Wapen → positie', uitleg: 'Herken de positie aan het kerkelijke wapen.' },
  { id: 'mix', titel: 'Mix', uitleg: 'Alle vraagsoorten door elkaar.' },
]

const MET_WAPEN = SECTIES.flatMap((s) => s.posities).filter((p) => p.wapen)

function vraagWieHoger(): Vraag {
  const a = pickRandom(LADDER)
  let b = pickRandom(LADDER)
  while (b.id === a.id) b = pickRandom(LADDER)
  const paar = shuffle([a, b])
  const hoogste = a.rang! < b.rang! ? a : b
  return {
    prompt: <>Wie staat <strong>hoger</strong> in de hiërarchie?</>,
    options: paar.map((p) => p.naam),
    correct: paar.findIndex((p) => p.id === hoogste.id),
    explain: `${hoogste.naam} staat hoger: ${hoogste.omschrijving}`,
  }
}

function vraagPositieTaak(p: Positie): Vraag {
  const opts = shuffle([p, ...distractors(ALLE_POSITIES, p, 3, (x) => x.id)])
  return {
    prompt: <>Wat is de rol van een <strong>{p.naam.toLowerCase()}</strong>?</>,
    options: opts.map((x) => x.omschrijving),
    correct: opts.findIndex((x) => x.id === p.id),
  }
}

function vraagTaakPositie(p: Positie): Vraag {
  const opts = shuffle([p, ...distractors(ALLE_POSITIES, p, 3, (x) => x.id)])
  return {
    prompt: <>Welke positie hoort hierbij: <em>{p.omschrijving}</em></>,
    options: opts.map((x) => x.naam),
    correct: opts.findIndex((x) => x.id === p.id),
  }
}

function vraagWapen(): Vraag {
  const p = pickRandom(MET_WAPEN)
  const opts = shuffle([p, ...distractors(MET_WAPEN, p, 3, (x) => x.naam)])
  return {
    prompt: (
      <div className="rk-vraagwapen">
        <img src={`/kerk/${p.wapen}`} alt="Kerkelijk wapen" />
        <span>Bij welke positie hoort dit wapen?</span>
      </div>
    ),
    options: opts.map((x) => x.naam),
    correct: opts.findIndex((x) => x.naam === p.naam),
    explain: p.wapenUitleg ? `${p.naam}: ${p.wapenUitleg.toLowerCase()}.` : p.naam,
  }
}

function maakQuiz(soort: QuizSoort): Vraag[] {
  return Array.from({ length: 15 }, () => {
    const s = soort === 'mix' ? pickRandom(['wie-hoger', 'positie-taak', 'taak-positie', 'wapen'] as const) : soort
    if (s === 'wie-hoger') return vraagWieHoger()
    if (s === 'wapen') return vraagWapen()
    const p = pickRandom(ALLE_POSITIES)
    return s === 'positie-taak' ? vraagPositieTaak(p) : vraagTaakPositie(p)
  })
}

export default function KerkApp() {
  const [tab, setTab] = useState('leren')
  const [quiz, setQuiz] = useState<QuizSoort | null>(null)

  return (
    <LeerShell
      mark="RK"
      accent={ACCENT}
      title="Kerkelijke hiërarchie"
      subtitle="Posities in de Rooms-Katholieke Kerk"
      tabs={[{ id: 'leren', label: 'Leren' }, { id: 'overhoren', label: 'Overhoren' }]}
      active={tab}
      onSelect={(id) => { setTab(id); setQuiz(null) }}
      footnote={
        <p>
          Structuur en wapens overgenomen (beknopt) van <a href="https://nl.wikipedia.org/wiki/Hi%C3%ABrarchie_van_de_Rooms-Katholieke_Kerk" target="_blank" rel="noreferrer">Wikipedia: Hiërarchie van de Rooms-Katholieke Kerk</a> · afbeeldingen via Wikimedia Commons.
        </p>
      }
    >
      {tab === 'leren' && (
        <article className="rk-artikel">
          <div className="km-page-head">
            <p className="km-eyebrow">Leren</p>
            <h1>Hiërarchie van de Rooms-Katholieke Kerk</h1>
          </div>

          <figure className="rk-paus-figuur">
            <img src="/kerk/paus-foto.png" alt="Paus Leo XIV" loading="lazy" />
            <figcaption>De paus — hoofd van de wereldkerk (paus Leo XIV).</figcaption>
          </figure>

          <p className="gs-alinea">
            De katholieke kerk kent twee hiërarchieën die vaak door elkaar worden gehaald. De <strong>wijdingshiërarchie</strong> is
            sacramenteel: er bestaan maar drie wijdingen (diaken, priester, bisschop). De <strong>ambtelijke hiërarchie</strong> gaat
            over besturen: wie leidt welk gebied — van de wereldkerk tot de parochie. Daarnaast zijn er vervangende functies,
            pauselijke eretitels en de eigen rangorde van kloosterordes. Elke positie heeft een eigen kerkelijk wapen: aan de
            kleur van de galero (pelgrimshoed) en het aantal kwasten lees je de rang af.
          </p>

          <section className="rk-groep">
            <h2>Zo past het in elkaar: van wereldkerk tot parochie</h2>
            <div className="rk-boom">
              {[
                { niveau: 'Wereldkerk', leider: 'Paus', extra: 'bisschop van Rome' },
                { niveau: 'Patriarchaat', leider: 'Patriarch', extra: 'groep kerkprovincies met eigen traditie' },
                { niveau: 'Kerkprovincie (metropool)', leider: 'Aartsbisschop (metropoliet)', extra: 'in Nederland: kerkprovincie Utrecht' },
                { niveau: 'Bisdom', leider: 'Bisschop', extra: 'Nederland telt 7 bisdommen' },
                { niveau: 'Decanaat', leider: 'Deken', extra: 'groep parochies' },
                { niveau: 'Parochie', leider: 'Pastoor', extra: 'bijgestaan door kapelaan en diaken' },
              ].map((n, i) => (
                <div className="rk-tak" style={{ marginLeft: `${i * 1.6}rem` }} key={n.niveau}>
                  <div className="rk-knoop">
                    <span className="rk-niveau">{n.niveau}</span>
                    <strong>{n.leider}</strong>
                    <span className="rk-extra">{n.extra}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {SECTIES.map((sectie) => (
            <section key={sectie.titel} className="rk-groep">
              <h2>{sectie.titel}</h2>
              <p className="rk-groep-uitleg">{sectie.uitleg}</p>
              <div className="rk-posities">
                {sectie.posities.map((p) => (
                  <div className="rk-positie" key={p.id}>
                    <div className="rk-positie-wapen">
                      {p.wapen ? <img src={`/kerk/${p.wapen}`} alt={`Wapen: ${p.naam}`} loading="lazy" /> : <span className="rk-geen-wapen" aria-hidden="true">—</span>}
                    </div>
                    <div>
                      <strong>{p.naam}</strong>
                      <p>{p.omschrijving}</p>
                      {p.wapenUitleg && <p className="rk-wapen-uitleg">Wapen: {p.wapenUitleg.toLowerCase()}.</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </article>
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
