import { useState } from 'react'
import LeerShell from '../leer/LeerShell'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { pickRandom, shuffle } from '../leer/match'
import { ONDERDELEN, type Onderdeel, type Rang } from './data'
import { INSIGNES } from './insignes'
import './rangen.css'

function insigneVan(o: Onderdeel, rang: Rang): string | undefined {
  return INSIGNES[`${o.id}|${rang.naam}`]
}

const ACCENT = '#455a64'

type QuizSoort = 'wie-hoger' | 'aanspreektitel' | 'cluster' | 'insigne' | 'mix'

const QUIZZEN: { id: QuizSoort; titel: string; uitleg: string }[] = [
  { id: 'insigne', titel: 'Insigne → rang', uitleg: 'Herken de rang aan het onderscheidingsteken.' },
  { id: 'wie-hoger', titel: 'Wie staat hoger?', uitleg: 'Kies van twee rangen de hoogste.' },
  { id: 'aanspreektitel', titel: 'Aanspreektitel', uitleg: 'Hoe spreek je deze rang aan?' },
  { id: 'cluster', titel: 'Rang → cluster', uitleg: 'Bij welk rangcluster hoort deze rang?' },
  { id: 'mix', titel: 'Mix', uitleg: 'Alles door elkaar.' },
]

function vraagWieHoger(o: Onderdeel): Vraag {
  const i = Math.floor(Math.random() * o.rangen.length)
  let j = Math.floor(Math.random() * o.rangen.length)
  let poging = 0
  while (Math.abs(j - i) < 1 && poging < 20) { j = Math.floor(Math.random() * o.rangen.length); poging += 1 }
  const a = o.rangen[i]
  const b = o.rangen[j]
  const paar = shuffle([a, b])
  const hoogste = i < j ? a : b
  return {
    prompt: <>Wie staat <strong>hoger</strong> bij de {o.kort.toLowerCase()}?</>,
    options: paar.map((r) => r.naam),
    correct: paar.findIndex((r) => r === hoogste),
    explain: `${hoogste.naam} (${hoogste.cluster}) staat hoger.`,
  }
}

function vraagAanspreektitel(o: Onderdeel): Vraag {
  const metTitel = o.rangen.filter((r) => r.detail?.includes('aanspreektitel:'))
  if (metTitel.length === 0) return vraagWieHoger(o)
  const rang = pickRandom(metTitel)
  const titel = rang.detail!.match(/aanspreektitel:\s*([^(]+)/)?.[1].trim() ?? ''
  return {
    prompt: <>Hoe spreek je een <strong>{rang.naam.toLowerCase()}</strong> aan?</>,
    accepted: [titel.split('/')[0].trim(), ...titel.split('/').map((t) => t.trim())],
    antwoordLabel: 'Aanspreektitel',
    explain: `${rang.naam} → "${titel}".`,
  }
}

function vraagCluster(o: Onderdeel): Vraag {
  const rang = pickRandom(o.rangen)
  const clusters = [...new Set(o.rangen.map((r) => r.cluster))]
  const opts = shuffle([rang.cluster, ...shuffle(clusters.filter((c) => c !== rang.cluster)).slice(0, 3)])
  return {
    prompt: <>Bij welk cluster hoort de rang <strong>{rang.naam.toLowerCase()}</strong>?</>,
    options: opts,
    correct: opts.indexOf(rang.cluster),
    explain: `${rang.naam} hoort bij: ${rang.cluster}.`,
  }
}

function vraagInsigne(o: Onderdeel): Vraag {
  const metInsigne = o.rangen.filter((r) => insigneVan(o, r))
  if (metInsigne.length < 4) return vraagWieHoger(o)
  const rang = pickRandom(metInsigne)
  const rest = shuffle(o.rangen.filter((r) => r.naam !== rang.naam)).slice(0, 3)
  const opts = shuffle([rang, ...rest])
  return {
    prompt: (
      <div className="rg-vraaginsigne">
        <img src={`/rangen/${insigneVan(o, rang)}`} alt="Rangonderscheidingsteken" />
        <span>Welke rang hoort bij dit onderscheidingsteken?</span>
      </div>
    ),
    options: opts.map((r) => r.naam),
    correct: opts.findIndex((r) => r.naam === rang.naam),
    explain: `${rang.naam} (${rang.cluster})`,
  }
}

function maakQuiz(o: Onderdeel, soort: QuizSoort): Vraag[] {
  return Array.from({ length: 12 }, () => {
    const s = soort === 'mix' ? pickRandom(['wie-hoger', 'aanspreektitel', 'cluster', 'insigne'] as const) : soort
    if (s === 'wie-hoger') return vraagWieHoger(o)
    if (s === 'aanspreektitel') return vraagAanspreektitel(o)
    if (s === 'insigne') return vraagInsigne(o)
    return vraagCluster(o)
  })
}

export default function RangenApp() {
  const [onderdeelId, setOnderdeelId] = useState<string | null>(null)
  const [tab, setTab] = useState('leren')
  const [quiz, setQuiz] = useState<QuizSoort | null>(null)

  const onderdeel = ONDERDELEN.find((o) => o.id === onderdeelId) ?? null

  // ── Keuzescherm: welk onderdeel? ──
  if (!onderdeel) {
    return (
      <LeerShell
        mark="RG"
        accent={ACCENT}
        title="Rangen en standen"
        subtitle="Krijgsmacht · politie · brandweer"
        tabs={[{ id: 'keuze', label: 'Onderdelen' }]}
        active="keuze"
        onSelect={() => {}}
        footnote={<p>Bronnen: brochure "Rangonderscheidingstekens van de krijgsmacht" (Ministerie van Defensie) en Wikipedia (politie en brandweer) · insigne-afbeeldingen via Wikimedia Commons.</p>}
      >
        <div className="km-page-head">
          <p className="km-eyebrow">Kies een onderdeel</p>
          <h1>Welke rangorde wil je leren?</h1>
        </div>
        <div className="km-quiz-menu rg-keuze">
          {ONDERDELEN.map((o) => (
            <button key={o.id} type="button" className="km-card rg-tegel" onClick={() => { setOnderdeelId(o.id); setTab('leren'); setQuiz(null) }}>
              <span className="rg-mark" aria-hidden="true" style={{ background: o.accent }}>{o.mark}</span>
              <h3>{o.naam}</h3>
              <p>{o.rangen.length} rangen</p>
            </button>
          ))}
        </div>
      </LeerShell>
    )
  }

  // ── Onderdeel gekozen ──
  return (
    <LeerShell
      mark={onderdeel.mark}
      accent={onderdeel.accent}
      title={onderdeel.naam}
      subtitle={`${onderdeel.rangen.length} rangen van hoog naar laag`}
      tabs={[{ id: 'leren', label: 'Rangorde' }, { id: 'overhoren', label: 'Overhoren' }]}
      active={tab}
      onSelect={(id) => { setTab(id); setQuiz(null) }}
      footnote={
        <p>
          Bron: {onderdeel.bron.url ? <a href={onderdeel.bron.url} target="_blank" rel="noreferrer">{onderdeel.bron.label}</a> : onderdeel.bron.label}
        </p>
      }
    >
      <div className="km-back-row">
        <button type="button" className="km-btn km-btn-secondary" onClick={() => setOnderdeelId(null)}>← Alle onderdelen</button>
      </div>

      {tab === 'leren' && (
        <>
          <div className="km-page-head">
            <p className="km-eyebrow">Rangorde</p>
            <h1>{onderdeel.naam}</h1>
            <p>{onderdeel.intro}</p>
          </div>
          <ol className="rg-ladder">
            {onderdeel.rangen.map((rang, i) => {
              const nieuwCluster = i === 0 || onderdeel.rangen[i - 1].cluster !== rang.cluster
              return (
                <li key={rang.naam}>
                  {nieuwCluster && <p className="rg-cluster">{rang.cluster}</p>}
                  <div className="rg-rang">
                    <span className="rg-nr km-num">{i + 1}</span>
                    {insigneVan(onderdeel, rang) ? (
                      <img className="rg-insigne" src={`/rangen/${insigneVan(onderdeel, rang)}`} alt={`Onderscheidingsteken ${rang.naam}`} loading="lazy" />
                    ) : (
                      <span className="rg-insigne rg-insigne-leeg" aria-hidden="true" />
                    )}
                    <div>
                      <strong>{rang.naam}</strong>
                      {rang.detail && <p>{rang.detail}</p>}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
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
          <QuizRunner maak={() => maakQuiz(onderdeel, quiz)} />
        </>
      )}
    </LeerShell>
  )
}
