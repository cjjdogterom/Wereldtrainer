import { useMemo, useState } from 'react'
import LeerShell from '../leer/LeerShell'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { shuffle } from '../leer/match'
import { ALLE_WOORDEN, THEMAS, type Woord } from './woorden'
import { gewicht, isGekend, laadVoortgang, registreer, type Voortgang } from './voortgang'
import './spaans.css'

const ACCENT = '#b3541e'

type QuizSoort = 'nl-es' | 'es-nl' | 'mc' | 'zwak' | 'mix'

const QUIZZEN: { id: QuizSoort; titel: string; uitleg: string }[] = [
  { id: 'nl-es', titel: 'Nederlands → Spaans', uitleg: 'Typ het Spaanse woord (accenten mogen weg).' },
  { id: 'es-nl', titel: 'Spaans → Nederlands', uitleg: 'Typ de Nederlandse betekenis.' },
  { id: 'mc', titel: 'Meerkeuze', uitleg: 'Kies de juiste betekenis.' },
  { id: 'zwak', titel: 'Zwakke woorden', uitleg: 'Alleen woorden die je nog niet kent of vaak fout doet.' },
  { id: 'mix', titel: 'Mix', uitleg: 'Alles door elkaar, gewogen naar je voortgang.' },
]

type WoordMetThema = Woord & { thema: string }

function woordId(w: WoordMetThema): string {
  return `${w.thema}|${w.es}`
}

// Extra geaccepteerde varianten voor NL-antwoorden ("de vader" → ook "vader").
function nlVarianten(nl: string): string[] {
  const zonderHaakjes = nl.replace(/\s*\([^)]*\)/g, '').trim()
  const delen = zonderHaakjes.split('/').map((d) => d.trim())
  const zonderLidwoord = delen.map((d) => d.replace(/^(de|het|een|los|las|el|la)\s+/i, ''))
  return [...new Set([nl, zonderHaakjes, ...delen, ...zonderLidwoord])].filter(Boolean)
}

function gewogenPick(pool: WoordMetThema[], voortgang: Voortgang): WoordMetThema {
  const gewichten = pool.map((w) => gewicht(voortgang[woordId(w)]))
  const totaal = gewichten.reduce((s, g) => s + g, 0)
  let cursor = Math.random() * totaal
  for (let i = 0; i < pool.length; i += 1) {
    cursor -= gewichten[i]
    if (cursor <= 0) return pool[i]
  }
  return pool[0]
}

function vraagNlEs(w: WoordMetThema): Vraag {
  return {
    id: woordId(w),
    prompt: <>Wat is <strong>{w.nl}</strong> in het Spaans?</>,
    accepted: [w.es, ...(w.alt ?? [])],
    antwoordLabel: 'In het Spaans',
    explain: <><strong>{w.es}</strong>{w.alt ? ` (ook goed: ${w.alt.join(', ')})` : ''}</>,
  }
}

function vraagEsNl(w: WoordMetThema): Vraag {
  return {
    id: woordId(w),
    prompt: <>Wat betekent <strong lang="es">{w.es}</strong>?</>,
    accepted: nlVarianten(w.nl),
    antwoordLabel: 'In het Nederlands',
    explain: <><strong>{w.es}</strong> = {w.nl}</>,
  }
}

function vraagMc(w: WoordMetThema, pool: WoordMetThema[]): Vraag {
  const afleiders = shuffle(pool.filter((x) => x.nl !== w.nl && x.es !== w.es)).slice(0, 3)
  const opts = shuffle([w, ...afleiders])
  return {
    id: woordId(w),
    prompt: <>Wat betekent <strong lang="es">{w.es}</strong>?</>,
    options: opts.map((x) => x.nl),
    correct: opts.findIndex((x) => x === w),
    explain: <><strong>{w.es}</strong> = {w.nl}</>,
  }
}

function maakQuiz(soort: QuizSoort, voortgang: Voortgang, themaId: string | null): Vraag[] {
  let pool = themaId ? ALLE_WOORDEN.filter((w) => w.thema === themaId) : ALLE_WOORDEN
  if (soort === 'zwak') {
    const zwak = pool.filter((w) => !isGekend(voortgang[woordId(w)]))
    if (zwak.length >= 4) pool = zwak
  }
  const n = Math.min(15, Math.max(6, pool.length))
  const gekozen = new Set<string>()
  const vragen: Vraag[] = []
  let poging = 0
  while (vragen.length < n && poging < 200) {
    poging += 1
    const w = gewogenPick(pool, voortgang)
    const id = woordId(w)
    if (gekozen.has(id)) continue
    gekozen.add(id)
    const s = soort === 'mix' || soort === 'zwak' ? (['nl-es', 'es-nl', 'mc'] as const)[Math.floor(Math.random() * 3)] : soort
    if (s === 'nl-es') vragen.push(vraagNlEs(w))
    else if (s === 'es-nl') vragen.push(vraagEsNl(w))
    else vragen.push(vraagMc(w, ALLE_WOORDEN))
  }
  return vragen
}

export default function SpaansApp() {
  const [tab, setTab] = useState('themas')
  const [themaId, setThemaId] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<QuizSoort | null>(null)
  const [quizThema, setQuizThema] = useState<string | null>(null)
  const [voortgang, setVoortgang] = useState<Voortgang>(() => laadVoortgang())

  const totaal = ALLE_WOORDEN.length
  const gekend = useMemo(() => ALLE_WOORDEN.filter((w) => isGekend(voortgang[woordId(w)])).length, [voortgang])

  const thema = THEMAS.find((t) => t.id === themaId) ?? null

  function themaVoortgang(id: string): number {
    const woorden = ALLE_WOORDEN.filter((w) => w.thema === id)
    const g = woorden.filter((w) => isGekend(voortgang[woordId(w)])).length
    return Math.round((g / woorden.length) * 100)
  }

  return (
    <LeerShell
      mark="ES"
      accent={ACCENT}
      title="Spaans"
      subtitle={`${totaal} woorden en zinnen · ${gekend} gekend`}
      tabs={[{ id: 'themas', label: "Thema's" }, { id: 'overhoren', label: 'Overhoren' }]}
      active={tab}
      onSelect={(id) => { setTab(id); setQuiz(null); setThemaId(null); setQuizThema(null) }}
      footnote={<p>Je voortgang wordt automatisch op dit apparaat bewaard.</p>}
    >
      {tab === 'themas' && thema === null && (
        <>
          <div className="km-page-head">
            <p className="km-eyebrow">Leren</p>
            <h1>Kies een thema</h1>
            <p>Per thema leer je de woorden en overhoor je jezelf. De balk laat zien hoeveel woorden je al kent (2× goed beantwoord).</p>
          </div>
          <div className="km-grid es-themas">
            {THEMAS.map((t) => {
              const pct = themaVoortgang(t.id)
              return (
                <button key={t.id} type="button" className="km-card es-thema" onClick={() => setThemaId(t.id)}>
                  <h3>{t.titel}</h3>
                  <p>{t.woorden.length} woorden</p>
                  <div className="es-balk"><div className="es-balk-vulling" style={{ width: `${pct}%` }} /></div>
                  <span className="es-pct km-num">{pct}%</span>
                </button>
              )
            })}
          </div>
        </>
      )}

      {tab === 'themas' && thema !== null && (
        <>
          <div className="km-back-row">
            <button type="button" className="km-btn km-btn-secondary" onClick={() => setThemaId(null)}>← Alle thema's</button>
            <button
              type="button"
              className="km-btn km-btn-primary"
              onClick={() => { setQuizThema(thema.id); setQuiz('mix'); setTab('overhoren') }}
            >
              Overhoor dit thema
            </button>
          </div>
          <div className="km-page-head">
            <p className="km-eyebrow">Thema</p>
            <h1>{thema.titel}</h1>
          </div>
          <div className="km-table-wrap es-tabel">
            <table className="km-table">
              <thead>
                <tr><th>Nederlands</th><th>Spaans</th><th>Status</th></tr>
              </thead>
              <tbody>
                {thema.woorden.map((w) => {
                  const stat = voortgang[`${thema.id}|${w.es}`]
                  return (
                    <tr key={w.es + w.nl}>
                      <td>{w.nl}</td>
                      <td><strong lang="es">{w.es}</strong>{w.alt ? <span className="es-alt"> · {w.alt.join(', ')}</span> : null}</td>
                      <td>
                        {isGekend(stat)
                          ? <span className="es-status es-status-goed">gekend</span>
                          : stat
                            ? <span className="es-status es-status-bezig">{stat.goed}× goed, {stat.fout}× fout</span>
                            : <span className="es-status">nieuw</span>}
                      </td>
                    </tr>
                  )
                })}
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
            <p>Vragen worden gewogen: woorden die je niet kent of vaak fout doet, komen vaker terug.</p>
          </div>
          <div className="km-quiz-menu">
            {QUIZZEN.map((q) => (
              <button key={q.id} type="button" className="km-card" onClick={() => { setQuizThema(null); setQuiz(q.id) }}>
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
            <button type="button" className="km-btn km-btn-secondary" onClick={() => { setQuiz(null); setQuizThema(null) }}>← Andere overhoring</button>
            {quizThema && <span className="es-quiz-thema">Thema: {THEMAS.find((t) => t.id === quizThema)?.titel}</span>}
          </div>
          <QuizRunner
            maak={() => maakQuiz(quiz, voortgang, quizThema)}
            onUitslag={(vraag, goed) => {
              if (vraag.id) setVoortgang((v) => registreer(v, vraag.id!, goed))
            }}
          />
        </>
      )}
    </LeerShell>
  )
}
