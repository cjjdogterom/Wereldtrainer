import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Flame, MessageCircle, Newspaper, RotateCcw } from 'lucide-react'
import { datumTekst } from '../ui/TopBalk'
import { MODULE_BY_ID } from '../modules'
import { herhaalLijst, type Geheugen } from './geheugen'
import { dagStappen, volgendeStap, type Stap } from './dagplan'
import { useKrant } from './krant'
import { STAMP_MODULES } from './rooster'
import { useGeheugen, useLesPlan, usePoco } from './useLeer'
import './dag.css'

function begroeting(): string {
  const h = new Date().getHours()
  if (h < 6) return 'Nog wakker'
  if (h < 12) return 'Goedemorgen'
  if (h < 18) return 'Goedemiddag'
  return 'Goedenavond'
}

type Rij = { icoon: ReactNode; kleur: string; titel: string; sub: string; minuten: number }

// Het startscherm: je dag als één route van vier stappen, met één knop.
export default function Dag() {
  const { g, vandaag, wijzig, wijzigKrant, reeks } = useGeheugen()
  const poco = usePoco(vandaag)
  const krant = useKrant(g, vandaag, wijzigKrant)
  const stappen = dagStappen(g, vandaag, poco)
  const nu = volgendeStap(stappen)
  const af = stappen.filter((s) => s.klaar).length
  const gelezen = krant.artikelen.slice(0, krant.basis).filter((a) => a.gelezen).length
  const nHerhaal = herhaalLijst(g, STAMP_MODULES, vandaag).length

  return (
    <div className="dg">
      <header className="dg-kop">
        <p className="dg-datum">
          {begroeting()} · {datumTekst()}
        </p>
        <h1>{!nu ? 'Je dag zit erop.' : af === 0 ? 'Je dag' : 'Ga verder waar je was'}</h1>
        <div className="dg-meta">
          <span className={`dg-reeks${reeks > 0 ? ' aan' : ''}`}>
            <Flame size={15} /> {reeks} {reeks === 1 ? 'dag' : 'dagen'} op rij
          </span>
          <span className="tabular">
            {af} van {stappen.length} stappen
          </span>
        </div>
        <div className="dg-balk" aria-hidden="true">
          {stappen.map((s) => (
            <i key={s.id} className={s.klaar ? 'af' : s === nu ? 'nu' : ''} />
          ))}
        </div>
      </header>

      <ol className="dg-stappen">
        {stappen.map((s, i) => (
          <StapRij key={s.id} stap={s} nr={i + 1} nu={s === nu} g={g} vandaag={vandaag} wijzig={wijzig} nHerhaal={nHerhaal} poco={poco} krant={{ gelezen, basis: krant.basis }} />
        ))}
      </ol>

      <div className="dg-actie">
        {nu ? (
          <Link to={nu.soort === 'krant' ? '/krant' : '/sessie'} className="dg-knop">
            {af === 0 ? 'Begin je dag' : 'Ga verder'} <ArrowRight size={20} />
          </Link>
        ) : (
          <>
            <p>Alles af voor vandaag. Morgen staat er weer een nieuwe dag klaar.</p>
            <div className="dg-extra">
              <Link to="/krant" className="dg-knop stil">
                <Newspaper size={18} /> Nog wat lezen
              </Link>
              <Link to="/vakken" className="dg-knop stil">
                Vrij oefenen in de vakken <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function StapRij({
  stap,
  nr,
  nu,
  g,
  vandaag,
  wijzig,
  nHerhaal,
  poco,
  krant,
}: {
  stap: Stap
  nr: number
  nu: boolean
  g: Geheugen
  vandaag: number
  wijzig: ReturnType<typeof useGeheugen>['wijzig']
  nHerhaal: number
  poco: { klaar: number; totaal: number }
  krant: { gelezen: number; basis: number }
}) {
  let rij: Rij
  if (stap.soort === 'nieuw') return <NieuwRij stap={stap} nr={nr} nu={nu} g={g} vandaag={vandaag} wijzig={wijzig} />
  if (stap.soort === 'herhalen')
    rij = {
      icoon: <RotateCcw size={20} />,
      kleur: '#5b6b82',
      titel: 'Herhalen',
      sub: nHerhaal ? `${nHerhaal} vragen door elkaar, uit alle vakken` : 'Niets te herhalen vandaag',
      minuten: Math.max(1, Math.round(nHerhaal * 0.3)),
    }
  else if (stap.soort === 'spaans')
    rij = {
      icoon: <MessageCircle size={20} />,
      kleur: MODULE_BY_ID.spaans.accent,
      titel: 'Spaans',
      sub: `${Math.min(poco.klaar, poco.totaal)} van ${poco.totaal} woorden van vandaag`,
      minuten: 15,
    }
  else
    rij = {
      icoon: <Newspaper size={20} />,
      kleur: '#1c1a17',
      titel: 'De krant',
      sub: krant.basis ? `${krant.gelezen} van ${krant.basis} artikelen gelezen` : 'Vijf artikelen om rustig te lezen',
      minuten: 30,
    }
  return <RijView stap={stap} nr={nr} nu={nu} rij={rij} />
}

function NieuwRij({ stap, nr, nu, g, vandaag, wijzig }: { stap: Stap; nr: number; nu: boolean; g: Geheugen; vandaag: number; wijzig: ReturnType<typeof useGeheugen>['wijzig'] }) {
  const m = MODULE_BY_ID[stap.id]
  const { leerstof, eenheden, les } = useLesPlan(stap.id, g, vandaag, wijzig)
  const naam = (id: string) => eenheden?.find((e) => e.id === id)?.naam ?? '…'
  const sub = !les || !leerstof
    ? '…'
    : les.klaar
      ? `${les.klaar.goed} van ${les.klaar.totaal} goed`
      : les.nieuw.length === 0
        ? 'Vandaag niets nieuws'
        : leerstof.perDag === 1
          ? `Nieuw: ${naam(les.nieuw[0])}`
          : `Nieuw: ${les.nieuw.map(naam).join(', ')}`
  return <RijView stap={stap} nr={nr} nu={nu} rij={{ icoon: m?.icon, kleur: m?.accent ?? '#22406f', titel: m?.title ?? stap.id, sub, minuten: 8 }} />
}

function RijView({ stap, nr, nu, rij }: { stap: Stap; nr: number; nu: boolean; rij: Rij }) {
  const doel = stap.soort === 'krant' ? '/krant' : `/sessie?stap=${stap.id}`
  return (
    <li className={`dg-stap${stap.klaar ? ' af' : ''}${nu ? ' nu' : ''}`} style={{ '--sk': rij.kleur } as CSSProperties}>
      <Link to={doel}>
        <span className="dg-nr">{stap.klaar ? <Check size={16} strokeWidth={3} /> : nr}</span>
        <span className="dg-icoon">{rij.icoon}</span>
        <span className="dg-tekst">
          <strong>{rij.titel}</strong>
          <small>{rij.sub}</small>
        </span>
        <span className="dg-min tabular">{stap.klaar ? 'klaar' : `± ${rij.minuten} min`}</span>
      </Link>
    </li>
  )
}
