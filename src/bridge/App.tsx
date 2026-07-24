import { useState } from 'react'
import LeerShell from '../leer/LeerShell'
import QuizRunner, { type Vraag } from '../leer/QuizRunner'
import { pickRandom, shuffle } from '../leer/match'
import { ANTWOORD_SCENARIOS } from './antwoorden'
import { hcp, isSans, KLEUREN, KLEUR_SYMBOOL, legUitOpening, maakHand, openingsbod, rangLabel, type Bod, type Hand } from './kaarten'
import './bridge.css'

const ACCENT = '#3b5b34'

function HandView({ hand }: { hand: Hand }) {
  return (
    <div className="br-hand">
      {KLEUREN.map((kleur) => (
        <div className="br-kleur" key={kleur}>
          <span className={`br-symbool${kleur === 'H' || kleur === 'D' ? ' br-rood' : ''}`}>{KLEUR_SYMBOOL[kleur]}</span>
          <span className="br-kaarten">{hand[kleur].length > 0 ? hand[kleur].map(rangLabel).join(' ') : '—'}</span>
        </div>
      ))}
    </div>
  )
}

function TekstHand({ kaarten }: { kaarten: [string, string, string, string] }) {
  const symbolen = ['♠', '♥', '♦', '♣']
  return (
    <div className="br-hand">
      {kaarten.map((k, i) => (
        <div className="br-kleur" key={i}>
          <span className={`br-symbool${i === 1 || i === 2 ? ' br-rood' : ''}`}>{symbolen[i]}</span>
          <span className="br-kaarten">{k || '—'}</span>
        </div>
      ))}
    </div>
  )
}

type QuizSoort = 'hcp' | 'opening' | 'antwoord' | 'mix'

const QUIZZEN: { id: QuizSoort; titel: string; uitleg: string }[] = [
  { id: 'hcp', titel: 'Punten tellen', uitleg: 'Tel de honneurpunten van een willekeurige hand.' },
  { id: 'opening', titel: 'Wat open je?', uitleg: 'Krijg een hand en kies het juiste openingsbod (vijfkaart hoog).' },
  { id: 'antwoord', titel: 'Wat antwoord je?', uitleg: 'Partner opent — kies jouw bijbod.' },
  { id: 'mix', titel: 'Mix', uitleg: 'Alles door elkaar.' },
]

const ALLE_BODS: Bod[] = ['pas', '1♣', '1♦', '1♥', '1♠', '1SA', '2♣', '2SA']

function vraagHcp(): Vraag {
  const hand = maakHand()
  const punten = hcp(hand)
  return {
    prompt: (
      <div className="br-vraag">
        <HandView hand={hand} />
        <span>Hoeveel honneurpunten (HCP) telt deze hand?</span>
      </div>
    ),
    accepted: [String(punten)],
    antwoordLabel: 'Aantal punten',
    explain: `A=4, H=3, V=2, B=1 → deze hand telt ${punten} punten${isSans(hand) ? ' en heeft een sans-verdeling' : ''}.`,
  }
}

function vraagOpening(): Vraag {
  let hand = maakHand()
  let bod = openingsbod(hand)
  let poging = 0
  while (bod === null && poging < 50) {
    hand = maakHand()
    bod = openingsbod(hand)
    poging += 1
  }
  const goedBod = bod ?? 'pas'
  const opts = shuffle([goedBod, ...shuffle(ALLE_BODS.filter((b) => b !== goedBod)).slice(0, 3)])
  return {
    prompt: (
      <div className="br-vraag">
        <HandView hand={hand} />
        <span>Jij mag openen. Wat bied je?</span>
      </div>
    ),
    options: opts,
    correct: opts.indexOf(goedBod),
    explain: legUitOpening(hand, goedBod),
  }
}

function vraagAntwoord(): Vraag {
  const s = pickRandom(ANTWOORD_SCENARIOS)
  const opts = shuffle(s.opties.map((tekst, i) => ({ tekst, goed: i === s.goed })))
  return {
    prompt: (
      <div className="br-vraag">
        <span className="br-context">Partner opent <strong>{s.opening}</strong>. Jouw hand ({s.hcp} punten):</span>
        <TekstHand kaarten={s.hand} />
        <span>Wat bied je?</span>
      </div>
    ),
    options: opts.map((o) => o.tekst),
    correct: opts.findIndex((o) => o.goed),
    explain: s.uitleg,
  }
}

function maakQuiz(soort: QuizSoort): Vraag[] {
  return Array.from({ length: 10 }, () => {
    const s = soort === 'mix' ? pickRandom(['hcp', 'opening', 'antwoord'] as const) : soort
    if (s === 'hcp') return vraagHcp()
    if (s === 'opening') return vraagOpening()
    return vraagAntwoord()
  })
}

export default function BridgeApp() {
  const [tab, setTab] = useState('cursus')
  const [quiz, setQuiz] = useState<QuizSoort | null>(null)

  return (
    <LeerShell
      mark="BR"
      accent={ACCENT}
      title="Bridge"
      subtitle="Vijfkaart hoog — cursus en biedtrainer"
      tabs={[{ id: 'cursus', label: 'Cursus' }, { id: 'overhoren', label: 'Trainen' }]}
      active={tab}
      onSelect={(id) => { setTab(id); setQuiz(null) }}
      footnote={<p>Biedafspraken volgens het standaard Nederlandse beginnerssysteem (vijfkaart hoog, zwakke sans 15–17).</p>}
    >
      {tab === 'cursus' && (
        <article className="gs-artikel br-cursus">
          <div className="km-page-head">
            <p className="km-eyebrow">Cursus</p>
            <h1>Bridge vanaf nul</h1>
            <p>Negen korte hoofdstukken: na afloop kun je een avond meebridgen met het systeem vijfkaart hoog.</p>
          </div>

          <section className="gs-sectie">
            <h2>1 · Wat is bridge?</h2>
            <p className="gs-alinea">
              Bridge speel je met vier spelers in twee vaste paren: Noord–Zuid tegen Oost–West. Alle 52 kaarten worden
              verdeeld; iedereen krijgt er 13. Elk spel bestaat uit twee delen: eerst <strong>bieden</strong> jullie om te bepalen
              welk paar hoeveel slagen belooft te halen (het contract), daarna wordt er <strong>gespeeld</strong> in 13 slagen.
              Kaartvolgorde is gewoon A, H, V, B, 10 … 2.
            </p>
          </section>

          <section className="gs-sectie">
            <h2>2 · Slagen, de leider en de dummy</h2>
            <p className="gs-alinea">
              Een slag: iedere speler legt met de klok mee één kaart bij; je moet de gevraagde kleur <strong>bekennen</strong> als je
              kan. De hoogste kaart van de gevraagde kleur wint — tenzij er een troefkaart valt, want elke troef klopt elke
              niet-troefkaart. Wie de slag wint, komt uit voor de volgende.
            </p>
            <p className="gs-alinea">
              Bijzonder aan bridge: van het parenteam dat het contract speelt, doet er maar één echt mee — de <strong>leider</strong>.
              Zijn partner, de <strong>dummy</strong>, legt na de eerste uitkomst zijn hele hand open op tafel en de leider speelt
              beide handen. De tegenpartij begint: de speler links van de leider komt uit.
            </p>
          </section>

          <section className="gs-sectie">
            <h2>3 · Punten tellen</h2>
            <p className="gs-alinea">
              Je hand waardeer je met honneurpunten (HCP): <strong>aas = 4, heer = 3, vrouw = 2, boer = 1</strong>. In het hele spel
              zitten 40 punten; een gemiddelde hand heeft er 10. Vuistregel voor het bieden: met samen 25 punten kun je een
              manche aan; tel bij lange kleuren een lengtepunt bij voor elke kaart boven de vier.
            </p>
          </section>

          <section className="gs-sectie">
            <h2>4 · Het bieden: hoe werkt dat?</h2>
            <p className="gs-alinea">
              Een bod bestaat uit een niveau en een "kleur": 1♣ betekent "wij halen 6+1 = 7 slagen met klaveren als troef",
              3SA betekent "9 slagen zonder troef". Elk volgend bod moet hoger zijn; de kleurvolgorde van laag naar hoog is
              <strong> ♣ ♦ ♥ ♠ SA</strong>. Bieden gaat rond tot er drie keer achter elkaar gepast is; het laatste bod is het
              contract. Haal je je contract, dan scoor je; anders krijgt de tegenpartij punten per "downslag".
            </p>
          </section>

          <section className="gs-sectie">
            <h2>5 · Openen met vijfkaart hoog</h2>
            <p className="gs-alinea">Met minder dan 12 punten pas je. Vanaf 12 open je volgens dit rijtje:</p>
            <div className="km-table-wrap br-tabel">
              <table className="km-table">
                <thead><tr><th>Hand</th><th>Opening</th></tr></thead>
                <tbody>
                  <tr><td>12–19 punten, vijfkaart (of langer) ♥ of ♠</td><td><strong>1♥ / 1♠</strong> (langste; bij 5-5 de hoogste)</td></tr>
                  <tr><td>12–19 punten, géén vijfkaart hoog</td><td><strong>1♣ / 1♦</strong> (langste lage kleur; 3-3 → 1♣, 4-4 → 1♦)</td></tr>
                  <tr><td>15–17 punten, sans-verdeling*</td><td><strong>1SA</strong></td></tr>
                  <tr><td>20–21 punten, sans-verdeling</td><td><strong>2SA</strong></td></tr>
                  <tr><td>22+ punten</td><td><strong>2♣</strong> (kunstmatig en sterk)</td></tr>
                </tbody>
              </table>
            </div>
            <p className="gs-alinea">
              *Sans-verdeling = geen renonce of singleton en hooguit één doubleton (4-3-3-3, 4-4-3-2 of 5-3-3-2).
              De regel "vijfkaart hoog" betekent dus: 1♥ of 1♠ belooft altijd minstens vijf kaarten in die kleur —
              daarom kun je partner al met drie kaarten mee steunen.
            </p>
          </section>

          <section className="gs-sectie">
            <h2>6 · Antwoorden op 1♥ / 1♠ (en 1♣ / 1♦)</h2>
            <p className="gs-alinea">Met 0–5 punten pas je. Vanaf 6 punten antwoord je:</p>
            <div className="km-table-wrap br-tabel">
              <table className="km-table">
                <thead><tr><th>Jouw hand</th><th>Antwoord</th></tr></thead>
                <tbody>
                  <tr><td>6–9 punten, 3+ steun voor partners hoge kleur</td><td><strong>2♥ / 2♠</strong></td></tr>
                  <tr><td>10–11 punten, steun</td><td><strong>3♥ / 3♠</strong> (uitnodiging)</td></tr>
                  <tr><td>12+ punten, steun</td><td>eerst een nieuwe kleur, of meteen <strong>4♥ / 4♠</strong></td></tr>
                  <tr><td>6+ punten, eigen kleur op 1-niveau te bieden</td><td><strong>nieuwe kleur op 1-niveau</strong> (bijv. 1♠ na 1♥)</td></tr>
                  <tr><td>10+ punten, eigen kleur die alleen op 2-niveau kan</td><td><strong>nieuwe kleur op 2-niveau</strong></td></tr>
                  <tr><td>6–9 punten, geen steun en geen kleur op 1-niveau</td><td><strong>1SA</strong> (vangnet)</td></tr>
                </tbody>
              </table>
            </div>
            <p className="gs-alinea">
              Na 1♣ of 1♦ geldt hetzelfde idee: nieuwe kleuren van onderaf laten zien (met twee vierkaarten eerst de laagste),
              en steun in de lage kleur pas als er geen hoge kleur te melden valt.
            </p>
          </section>

          <section className="gs-sectie">
            <h2>7 · Antwoorden op 1SA</h2>
            <div className="km-table-wrap br-tabel">
              <table className="km-table">
                <thead><tr><th>Jouw punten</th><th>Antwoord</th></tr></thead>
                <tbody>
                  <tr><td>0–7</td><td><strong>pas</strong></td></tr>
                  <tr><td>8–9</td><td><strong>2SA</strong> (uitnodiging: partner biedt 3SA met 16–17)</td></tr>
                  <tr><td>10+</td><td><strong>3SA</strong></td></tr>
                </tbody>
              </table>
            </div>
            <p className="gs-alinea">
              Gevorderden gebruiken hier nog 2♣ ("Stayman") om naar vierkaarten hoog te vragen — handig om te kennen,
              niet nodig om te beginnen.
            </p>
          </section>

          <section className="gs-sectie">
            <h2>8 · Samen naar de manche</h2>
            <p className="gs-alinea">
              Waarom al dat geboden? Bepaalde contracten leveren een flinke premie op: de <strong>manches</strong> zijn 3SA (9 slagen),
              4♥/4♠ (10 slagen) en 5♣/5♦ (11 slagen). Vuistregel: bied manche met samen ±25 punten (voor 5♣/5♦ liever 28).
              Nog hoger zijn slem (12 slagen) en groot slem (13) — voor later. Als openaar tel je na partners antwoord simpel
              op: past het samen bij 25, dan stuur je naar de manche; zo niet, dan stop je zo laag mogelijk.
            </p>
          </section>

          <section className="gs-sectie">
            <h2>9 · Het spelen en de score</h2>
            <p className="gs-alinea">
              Uitkomen tegen een sans-contract: kies de <strong>vierde kaart van je langste kleur</strong>. Tegen een troefcontract is
              een kleur waarvan je A-H hebt of een singleton aantrekkelijk. Als leider in een troefcontract: <strong>trek eerst
              troef</strong> (speel troef tot de tegenpartij er geen meer heeft), tegen sans: ontwikkel je lange kleur. Een
              <strong> snit</strong> proberen (bijv. richting je V spelen in de hoop dat de heer "ervoor" zit) wint vaak een extra slag.
            </p>
            <p className="gs-alinea">
              De score hoef je niet uit je hoofd te kennen — die staat op elk biedbriefje. Onthoud alleen: contract gehaald =
              punten voor jullie (manche = veel extra), elke downslag = punten voor de tegenpartij, en "kwetsbaar" (na een
              eerder gewonnen manche in een robber) maakt alles duurder. Daarmee weet je genoeg om aan te schuiven —
              de rest leer je aan tafel.
            </p>
          </section>
        </article>
      )}

      {tab === 'overhoren' && quiz === null && (
        <>
          <div className="km-page-head">
            <p className="km-eyebrow">Trainen</p>
            <h1>Kies een trainer</h1>
            <p>De handen worden willekeurig gedeeld — elke ronde is anders.</p>
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
            <button type="button" className="km-btn km-btn-secondary" onClick={() => setQuiz(null)}>← Andere trainer</button>
          </div>
          <QuizRunner maak={() => maakQuiz(quiz)} />
        </>
      )}
    </LeerShell>
  )
}
