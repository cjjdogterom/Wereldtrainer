import { useState } from 'react'
import LeerShell from '../leer/LeerShell'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { pickRandom, shuffle } from '../leer/match'
import {
  NIET_TROEF_PUNTEN, NIET_TROEF_VOLGORDE, RANG_NAMEN, REGEL_VRAGEN, ROEM_VRAGEN,
  SLAG_SCENARIOS, TROEF_PUNTEN, TROEF_VOLGORDE, type Kaart,
} from './data'
import Scorekaart from './Scorekaart'
import './klaverjas.css'

const ACCENT = '#20614d'

function KaartChip({ kaart }: { kaart: Kaart }) {
  const rood = kaart.kleur === '♥' || kaart.kleur === '♦'
  return (
    <span className={`kj-kaart${rood ? ' kj-rood' : ''}`}>
      {kaart.kleur}{kaart.rang}
    </span>
  )
}

type QuizSoort = 'waarden' | 'wie-wint' | 'regels' | 'roem' | 'mix'

const QUIZZEN: { id: QuizSoort; titel: string; uitleg: string }[] = [
  { id: 'waarden', titel: 'Kaartwaarden', uitleg: 'Hoeveel punten is deze kaart waard (troef of niet)?' },
  { id: 'wie-wint', titel: 'Wie wint de slag?', uitleg: 'Vier kaarten op tafel — wie pakt hem?' },
  { id: 'regels', titel: 'Mag ik / moet ik?', uitleg: 'De Amsterdamse regels in de praktijk.' },
  { id: 'roem', titel: 'Roem tellen', uitleg: 'Hoeveel roem zit er in deze slag?' },
  { id: 'mix', titel: 'Mix', uitleg: 'Alles door elkaar.' },
]

function vraagWaarde(): Vraag {
  const troef = Math.random() < 0.5
  const tabel = troef ? TROEF_PUNTEN : NIET_TROEF_PUNTEN
  const rang = pickRandom(Object.keys(tabel))
  const punten = tabel[rang]
  return {
    prompt: <>Hoeveel punten is de <strong>{RANG_NAMEN[rang]}</strong> waard {troef ? 'in troef' : 'buiten troef'}?</>,
    accepted: [String(punten)],
    antwoordLabel: 'Aantal punten',
    explain: `${RANG_NAMEN[rang]} ${troef ? 'in troef' : 'buiten troef'} = ${punten} punten.`,
  }
}

function vraagWieWint(): Vraag {
  const s = pickRandom(SLAG_SCENARIOS)
  const spelers = s.kaarten.map((k) => k.speler)
  return {
    prompt: (
      <div className="kj-slag">
        <span className="kj-troef">Troef: <KaartChip kaart={{ kleur: s.troef, rang: '' }} /></span>
        <div className="kj-slag-kaarten">
          {s.kaarten.map((k) => (
            <span className="kj-gespeeld" key={k.speler}>
              <span className="kj-speler">{k.speler}</span>
              <KaartChip kaart={k.kaart} />
            </span>
          ))}
        </div>
        <span>Wie wint deze slag?</span>
      </div>
    ),
    options: spelers,
    correct: spelers.indexOf(s.winnaar),
    explain: s.uitleg,
  }
}

function vraagRegel(): Vraag {
  const r = pickRandom(REGEL_VRAGEN)
  const opts = shuffle(r.opties.map((tekst, i) => ({ tekst, goed: i === r.goed })))
  return {
    prompt: <>{r.situatie}</>,
    options: opts.map((o) => o.tekst),
    correct: opts.findIndex((o) => o.goed),
    explain: r.uitleg,
  }
}

function vraagRoem(): Vraag {
  const r = pickRandom(ROEM_VRAGEN)
  return {
    prompt: <>{r.omschrijving} — hoeveel roem?</>,
    accepted: [String(r.punten)],
    antwoordLabel: 'Roem',
    explain: r.uitleg,
  }
}

function maakQuiz(soort: QuizSoort): Vraag[] {
  return Array.from({ length: 12 }, () => {
    const s = soort === 'mix' ? pickRandom(['waarden', 'wie-wint', 'regels', 'roem'] as const) : soort
    if (s === 'waarden') return vraagWaarde()
    if (s === 'wie-wint') return vraagWieWint()
    if (s === 'regels') return vraagRegel()
    return vraagRoem()
  })
}

export default function KlaverjasApp() {
  const [tab, setTab] = useState('cursus')
  const [quiz, setQuiz] = useState<QuizSoort | null>(null)

  return (
    <LeerShell
      mark="KJ"
      accent={ACCENT}
      title="Klaverjassen"
      subtitle="Amsterdams (verplicht) — cursus en trainer"
      tabs={[{ id: 'cursus', label: 'Cursus' }, { id: 'overhoren', label: 'Overhoren' }, { id: 'score', label: 'Scorekaart' }]}
      active={tab}
      onSelect={(id) => { setTab(id); setQuiz(null) }}
      footnote={<p>Regels volgens de Amsterdamse speelwijze ("verplicht"); huisregels kunnen iets afwijken.</p>}
    >
      {tab === 'cursus' && (
        <article className="gs-artikel kj-cursus">
          <div className="km-page-head">
            <p className="km-eyebrow">Cursus</p>
            <h1>Klaverjassen vanaf nul</h1>
            <p>Na deze cursus kun je aanschuiven: het spel, de kaartvolgorde, de Amsterdamse regels, roem en het tellen.</p>
          </div>

          <section className="gs-sectie">
            <h2>1 · Het spel</h2>
            <p className="gs-alinea">
              Klaverjassen speel je met z'n vieren, in twee teams: wie tegenover elkaar zit, is maat. Je gebruikt 32 kaarten
              (7 tot en met aas); iedere speler krijgt er 8, dus elk spel bestaat uit 8 slagen. Eén kleur is troef.
              De speler links van de deler komt uit in de eerste slag; daarna komt steeds de winnaar van de vorige slag uit.
            </p>
            <p className="gs-alinea">
              Het team dat troef heeft gekozen is de <strong>spelende partij</strong> en moet meer dan de helft van de punten
              halen. In totaal zit er 162 in het spel: 152 aan kaartpunten plus 10 voor de laatste slag. De spelende partij
              moet dus minstens <strong>82 punten</strong> (plus de helft van eventuele roem) binnenhalen.
            </p>
          </section>

          <section className="gs-sectie">
            <h2>2 · Troef kiezen: Amsterdams verplicht</h2>
            <p className="gs-alinea">
              Bij de Amsterdamse speelwijze "verplicht" is er geen pasronde: de speler links van de deler <strong>moet</strong> een
              troefkleur kiezen (vaak met behulp van een opgedraaide kaart) en zijn team wordt automatisch de spelende partij.
              Je kunt dus niet ontsnappen aan een slechte hand — dat maakt het spel snel en spannend.
            </p>
          </section>

          <section className="gs-sectie">
            <h2>3 · Kaartvolgorde en punten</h2>
            <p className="gs-alinea">
              Het hart van het spel: in de troefkleur geldt een ándere volgorde én telling dan daarbuiten. De troefboer heet
              de <strong>jas</strong> (20 punten, hoogste kaart van het spel), de troefnegen heet de <strong>nel</strong> (14 punten, tweede).
            </p>
            <div className="km-table-wrap kj-tabel">
              <table className="km-table">
                <thead>
                  <tr><th>Sterkte</th><th>Troef</th><th>Punten</th><th>Niet-troef</th><th>Punten</th></tr>
                </thead>
                <tbody>
                  {TROEF_VOLGORDE.map((rang, i) => (
                    <tr key={rang}>
                      <td className="km-num">{i + 1}</td>
                      <td><strong>{RANG_NAMEN[rang]}</strong>{rang === 'B' ? ' (jas)' : rang === '9' ? ' (nel)' : ''}</td>
                      <td className="km-num">{TROEF_PUNTEN[rang]}</td>
                      <td>{RANG_NAMEN[NIET_TROEF_VOLGORDE[i]]}</td>
                      <td className="km-num">{NIET_TROEF_PUNTEN[NIET_TROEF_VOLGORDE[i]]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="gs-alinea">
              Onthoud vooral: buiten troef is de volgorde A, 10, H, V, B — de tien staat dus bóven de heer. In troef geldt:
              jas, nel, aas, tien, heer, vrouw, acht, zeven.
            </p>
          </section>

          <section className="gs-sectie">
            <h2>4 · De regels tijdens het spelen (Amsterdams)</h2>
            <p className="gs-alinea">In volgorde van belangrijkheid:</p>
            <ol className="kj-regels">
              <li><strong>Kleur bekennen is altijd verplicht.</strong> Kun je de gevraagde kleur bijspelen, dan moet dat. (Niet doen heet "verzaken" en kost je partij het spel.)</li>
              <li><strong>Troef gevraagd? Overtroeven verplicht.</strong> Ligt er troef en heb jij hogere troef, dan moet je erover.</li>
              <li><strong>Niet kunnen bekennen terwijl een tegenstander aan slag is:</strong> verplicht introeven, en overtroeven als er al getroefd is en je dat kunt. Kun je alleen ondertroeven maar heb je ook andere kaarten, dan mag je een andere kaart bijgooien; heb je alléén troef, dan moet je ondertroeven.</li>
              <li><strong>Staat je maat aan slag</strong> en kun je niet bekennen? Dan hoef je bij Amsterdams níét te troeven: je mag vrij een kaart bijgooien (troeven mag wel). Dit is hét verschil met Rotterdams, waar troeven ook dan verplicht is.</li>
            </ol>
          </section>

          <section className="gs-sectie">
            <h2>5 · Roem</h2>
            <p className="gs-alinea">
              Roem zijn extra punten voor kaartcombinaties die samen in één slag op tafel liggen. Voor series telt de gewone
              volgorde 7-8-9-10-B-V-H-A (óók in troef). De roem gaat naar het team dat de slag wint.
            </p>
            <div className="km-table-wrap kj-tabel">
              <table className="km-table">
                <thead><tr><th>Combinatie</th><th>Roem</th></tr></thead>
                <tbody>
                  <tr><td>Drie opeenvolgende kaarten van één kleur (driekaart)</td><td className="km-num">20</td></tr>
                  <tr><td>Vier opeenvolgende kaarten van één kleur (vierkaart)</td><td className="km-num">50</td></tr>
                  <tr><td>Heer + vrouw van troef ("stuk")</td><td className="km-num">20</td></tr>
                  <tr><td>Driekaart mét stuk (bijv. troef B-V-H)</td><td className="km-num">40</td></tr>
                  <tr><td>Vier dezelfde plaatjes (azen, heren, vrouwen of tienen)</td><td className="km-num">100</td></tr>
                  <tr><td>Vier boeren</td><td className="km-num">200</td></tr>
                  <tr><td>Alle slagen winnen ("pit")</td><td className="km-num">100</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="gs-sectie">
            <h2>6 · Tellen, nat en pit</h2>
            <p className="gs-alinea">
              Na acht slagen tel je per team de kaartpunten plus roem (en +10 voor de laatste slag). Haalt de spelende partij
              niet meer dan de tegenpartij, dan is ze <strong>nat</strong>: álle 162 punten plus álle roem gaan naar de tegenstanders.
              Win je alle acht de slagen, dan heb je een <strong>pit</strong>: 100 roem extra.
            </p>
            <p className="gs-alinea">
              Een potje gaat meestal over 16 spellen (iedereen deelt vier keer); het team met de meeste punten wint.
            </p>
          </section>

          <section className="gs-sectie">
            <h2>7 · Eerste tactiek</h2>
            <p className="gs-alinea">
              Als spelende partij: trek eerst troef (speel je hoge troeven) zodat de tegenpartij niet meer kan introeven, en
              haal daarna je azen op. Als tegenpartij: houd je troeven vast om de tien of aas van de spelers af te troeven, en
              speel de kleur die je maat wil hebben. Gooi punten ("smeren", bijvoorbeeld een tien) in slagen die je maat wint —
              en nooit in slagen voor de tegenstander. Wie dit doorheeft, kan meteen meedoen.
            </p>
          </section>
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

      {tab === 'score' && <Scorekaart />}
    </LeerShell>
  )
}
