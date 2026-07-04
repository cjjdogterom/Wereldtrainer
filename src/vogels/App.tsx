import { useEffect, useRef, useState } from 'react'
import LeerShell from '../leer/LeerShell'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { distractors, pickRandom, shuffle } from '../leer/match'
import { CATEGORIEEN, VOGELS, type Categorie, type Vogel } from './data'
import './vogels.css'

const ACCENT = '#3a6b35'

const MET_FOTO = VOGELS.filter((v) => v.foto)
const MET_GELUID = VOGELS.filter((v) => v.geluidUrl)

type QuizSoort = 'foto-naam' | 'geluid-naam' | 'kenmerk-naam' | 'mix'

const QUIZZEN: { id: QuizSoort; titel: string; uitleg: string }[] = [
  { id: 'foto-naam', titel: 'Foto → naam', uitleg: 'Herken de vogel op de foto.' },
  { id: 'geluid-naam', titel: 'Geluid → naam', uitleg: 'Luister naar de opname en kies de vogel.' },
  { id: 'kenmerk-naam', titel: 'Kenmerk → naam', uitleg: 'Herken de vogel aan uiterlijk of zang.' },
  { id: 'mix', titel: 'Mix', uitleg: 'Foto\'s, geluiden en kenmerken door elkaar.' },
]

// Kleine audiospeler; stopt vanzelf als een andere start.
function Speler({ url, compact }: { url: string; compact?: boolean }) {
  const ref = useRef<HTMLAudioElement>(null)
  const [speelt, setSpeelt] = useState(false)

  useEffect(() => () => ref.current?.pause(), [])

  function toggle() {
    const audio = ref.current
    if (!audio) return
    if (speelt) {
      audio.pause()
    } else {
      document.querySelectorAll('audio').forEach((a) => { if (a !== audio) a.pause() })
      void audio.play()
    }
  }

  return (
    <span className={`vg-speler${compact ? ' vg-speler-compact' : ''}`}>
      <audio ref={ref} src={url} preload="none" onPlay={() => setSpeelt(true)} onPause={() => setSpeelt(false)} onEnded={() => setSpeelt(false)} />
      <button type="button" className="vg-play" onClick={toggle} aria-label={speelt ? 'Pauzeer geluid' : 'Speel geluid af'}>
        {speelt ? '⏸' : '▶'}
      </button>
      {!compact && <span className="vg-speler-label">{speelt ? 'Speelt…' : 'Luister'}</span>}
    </span>
  )
}

function opties(vogel: Vogel): Vogel[] {
  return shuffle([vogel, ...distractors(VOGELS, vogel, 3, (v) => v.id)])
}

function vraagFotoNaam(): Vraag {
  const vogel = pickRandom(MET_FOTO)
  const opts = opties(vogel)
  return {
    prompt: (
      <div className="vg-vraag">
        <img className="vg-vraagfoto" src={`/vogels/${vogel.foto}`} alt="Welke vogel is dit?" />
        <span>Welke vogel is dit?</span>
      </div>
    ),
    options: opts.map((v) => v.naam),
    correct: opts.findIndex((v) => v.id === vogel.id),
    explain: `${vogel.naam} (${vogel.latijn}): ${vogel.uiterlijk}`,
  }
}

function vraagGeluidNaam(): Vraag {
  const vogel = pickRandom(MET_GELUID)
  const opts = opties(vogel)
  return {
    prompt: (
      <div className="vg-vraag">
        <Speler url={vogel.geluidUrl!} />
        <span>Welke vogel hoor je?</span>
      </div>
    ),
    options: opts.map((v) => v.naam),
    correct: opts.findIndex((v) => v.id === vogel.id),
    explain: `${vogel.naam}: ${vogel.geluid}`,
  }
}

function vraagKenmerkNaam(): Vraag {
  const vogel = pickRandom(VOGELS)
  const opts = opties(vogel)
  const overUiterlijk = Math.random() < 0.5
  return {
    prompt: <><em>{overUiterlijk ? vogel.uiterlijk : vogel.geluid}</em><br />Welke vogel is dit?</>,
    options: opts.map((v) => v.naam),
    correct: opts.findIndex((v) => v.id === vogel.id),
    explain: `${vogel.naam} (${vogel.latijn})`,
  }
}

function maakQuiz(soort: QuizSoort): Vraag[] {
  return Array.from({ length: 15 }, () => {
    const s = soort === 'mix' ? pickRandom(['foto-naam', 'geluid-naam', 'kenmerk-naam'] as const) : soort
    if (s === 'foto-naam') return vraagFotoNaam()
    if (s === 'geluid-naam') return vraagGeluidNaam()
    return vraagKenmerkNaam()
  })
}

export default function VogelsApp() {
  const [tab, setTab] = useState('leren')
  const [categorie, setCategorie] = useState<Categorie | 'alles'>('alles')
  const [quiz, setQuiz] = useState<QuizSoort | null>(null)

  return (
    <LeerShell
      mark="VG"
      accent={ACCENT}
      title="Vogels van Nederland"
      subtitle={`${VOGELS.length} soorten herkennen op zicht en geluid`}
      tabs={[{ id: 'leren', label: 'Leren' }, { id: 'overhoren', label: 'Overhoren' }]}
      active={tab}
      onSelect={(id) => { setTab(id); setQuiz(null) }}
      footnote={
        <p>
          Foto's via Wikipedia; geluidsopnames via <a href="https://commons.wikimedia.org" target="_blank" rel="noreferrer">Wikimedia Commons</a> (vrije licenties, gestreamd).
        </p>
      }
    >
      {tab === 'leren' && (
        <>
          <div className="km-page-head">
            <p className="km-eyebrow">Leren</p>
            <h1>Ken je vogels</h1>
            <p>Bekijk de foto, lees de kenmerken en luister naar het geluid.</p>
          </div>
          <div className="km-filters">
            <button type="button" className={`km-chip${categorie === 'alles' ? ' active' : ''}`} onClick={() => setCategorie('alles')}>Alles</button>
            {CATEGORIEEN.map((c) => (
              <button key={c} type="button" className={`km-chip${categorie === c ? ' active' : ''}`} onClick={() => setCategorie(c)}>{c}</button>
            ))}
          </div>
          <div className="vg-grid">
            {VOGELS.filter((v) => categorie === 'alles' || v.categorie === categorie).map((v) => (
              <article className="km-card vg-kaart" key={v.id}>
                {v.foto && (
                  <div className="vg-foto">
                    <img src={`/vogels/${v.foto}`} alt={v.naam} loading="lazy" />
                  </div>
                )}
                <span className="km-card-sub">{v.latijn}</span>
                <div className="vg-kaart-kop">
                  <h3>{v.naam}</h3>
                  {v.geluidUrl && <Speler url={v.geluidUrl} compact />}
                </div>
                <p>{v.uiterlijk}</p>
                <p className="vg-geluidtekst">♪ {v.geluid}</p>
              </article>
            ))}
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
