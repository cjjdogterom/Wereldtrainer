import type { CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Newspaper, Plus } from 'lucide-react'
import TopBalk, { datumTekst } from '../ui/TopBalk'
import { MODULE_BY_ID } from '../modules'
import { dagSleutel, type Geheugen } from './geheugen'
import { samenvatting } from './KrantArtikel'
import { useKrantFotos } from '../krant/StukView'
import { fotoVan, leestijd } from '../krant/stukken'
import type { Foto } from '../ui/Fotos'
import type { Artikel } from './geheugen'
import { RUBRIEK, RUBRIEKEN, useKrant, voortgangRubriek } from './krant'
import { DAGNAMEN, KRANT_ROOSTER, STAMP_MODULES, STAMP_ROOSTER, WEEKVOLGORDE, stampVoor } from './rooster'
import { useGeheugen, useLesPlan, usePoco } from './useLeer'
import './vandaag.css'
import './krant.css'

function jaargangNr(d = new Date()): number {
  return Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000)
}

export default function Vandaag() {
  const { g, vandaag, wijzig, wijzigKrant, reeks } = useGeheugen()
  const poco = usePoco(vandaag)
  const stamp = stampVoor()
  const krant = useKrant(g, vandaag, wijzigKrant)
  const [hoofd, ...overig] = krant.artikelen.slice(0, krant.basis)
  const extraArt = krant.artikelen.slice(krant.basis)
  const extraStamp = STAMP_MODULES.filter((m) => !stamp.includes(m))
  const fotos = useKrantFotos()
  const navigate = useNavigate()
  const minuten = krant.artikelen.slice(0, krant.basis).reduce((t, a) => t + (teaserVan(a, krant, fotos)?.minuten ?? 0), 0)

  return (
    <div className="kr">
      <TopBalk reeks={reeks} />

      <header className="kr-masthead">
        <p className="kr-mast-regel">
          <span>{datumTekst()}</span>
          <span>Nr. {jaargangNr()}</span>
          <span>{reeks > 0 ? `${reeks} ${reeks === 1 ? 'dag' : 'dagen'} op rij` : 'Elke dag een nieuwe editie'}</span>
        </p>
        <h1 className="kr-titel">De Wereldtrainer</h1>
        <p className="kr-motto">Dagblad voor de nieuwsgierige lezer</p>
      </header>

      <section className="kr-stamp" aria-labelledby="stamp-kop">
        <div className="kr-sectiekop">
          <h2 id="stamp-kop">Eerst stampen</h2>
          <p>Kort en interactief, met herhaling. Daarna kun je rustig de krant lezen.</p>
        </div>
        <div className="kr-stamp-rij">
          <SpaansKaart poco={poco} />
          {stamp.map((id) => (
            <StampKaart key={id} moduleId={id} g={g} vandaag={vandaag} wijzig={wijzig} />
          ))}
        </div>
      </section>

      <main className="kr-blad">
        <div className="kr-sectiekop krant">
          <h2>
            <Newspaper size={20} /> De krant van vandaag
          </h2>
          <p>
            {krant.basis === 0
              ? 'De krant wordt gedrukt…'
              : krant.klaar
                ? 'Alles gelezen. Morgen weer een nieuwe editie.'
                : `${krant.artikelen.slice(0, krant.basis).filter((x) => x.gelezen).length} van ${krant.basis} gelezen · ± ${minuten} minuten lezen`}
          </p>
        </div>

        {hoofd && <Teaser a={hoofd} i={0} krant={krant} fotos={fotos} groot />}

        <div className="kr-teasers">
          {overig.map((a, j) => (
            <Teaser key={j} a={a} i={j + 1} krant={krant} fotos={fotos} />
          ))}
        </div>

        {extraArt.length > 0 && (
          <div className="kr-teasers extra">
            {extraArt.map((a, j) => (
              <Teaser key={j} a={a} i={krant.basis + j} krant={krant} fotos={fotos} extra />
            ))}
          </div>
        )}

        <section className="kr-meer" aria-labelledby="meer-kop">
          <h2 id="meer-kop">Meer lezen</h2>
          <p>Nog zin in een stuk? Kies een rubriek en er komt een artikel bij.</p>
          <div className="kr-meer-lijst">
            {RUBRIEKEN.map((m) => {
              const mod = MODULE_BY_ID[m]
              const bron = krant.bronnen[m]
              const v = bron ? voortgangRubriek(m, bron, g.krant) : null
              return (
                <button key={m} type="button" className="kr-meer-item" style={{ '--mk': mod?.accent } as CSSProperties} onClick={() => krant.extra(m).then((nr) => nr !== null && navigate(`/vandaag/lees/${nr}`))}>
                  <span className="kr-meer-icoon">{mod?.icon}</span>
                  <span className="kr-meer-naam">
                    {RUBRIEK[m].naam}
                    <small>{v ? `${v.gelezen}/${v.totaal} ${v.soort} gelezen` : mod?.title}</small>
                  </span>
                  <Plus size={16} />
                </button>
              )
            })}
          </div>
        </section>

        <section className="kr-meer" aria-labelledby="stamp-meer">
          <h2 id="stamp-meer">Extra stampen</h2>
          <div className="kr-meer-lijst">
            {extraStamp.map((m) => {
              const mod = MODULE_BY_ID[m]
              return (
                <Link key={m} to={`/vandaag/${m}`} className="kr-meer-item" style={{ '--mk': mod?.accent } as CSSProperties}>
                  <span className="kr-meer-icoon">{mod?.icon}</span>
                  <span className="kr-meer-naam">{mod?.title}</span>
                  <ArrowRight size={16} />
                </Link>
              )
            })}
          </div>
        </section>

        <Weekrooster g={g} vandaag={vandaag} />
      </main>

      <footer className="vd-voet">Een dag telt mee voor je reeks als het stampwerk af is en de vijf artikelen gelezen zijn.</footer>
    </div>
  )
}

type Krant = ReturnType<typeof useKrant>

function teaserVan(a: Artikel, krant: Krant, fotos: Record<string, Foto[]>) {
  const inhoud = krant.inhoud(a)
  if (!inhoud) return null
  if (inhoud.stuk) {
    const s = inhoud.stuk
    return { kop: s.kop, intro: s.intro, hoofdstuk: s.hoofdstuk, foto: fotoVan(s, 0, fotos)?.src, minuten: leestijd(s) }
  }
  const units = inhoud.units ?? []
  const hoofdstukken = [...new Set(units.map((u) => u.hoofdstuk))]
  return { ...samenvatting(a.m, units), hoofdstuk: hoofdstukken.length === 1 ? hoofdstukken[0] : undefined }
}

function Teaser({ a, i, krant, fotos, groot, extra }: { a: Artikel; i: number; krant: Krant; fotos: Record<string, Foto[]>; groot?: boolean; extra?: boolean }) {
  const t = teaserVan(a, krant, fotos)
  if (!t) return <div className={`kr-teaser kr-skelet${groot ? ' groot' : ''}`} />
  return (
    <Link to={`/vandaag/lees/${i}`} className={`kr-teaser${groot ? ' groot' : ''}${a.gelezen ? ' gelezen' : ''}`}>
      {t.foto && (
        <span className="kr-teaser-foto">
          <img src={t.foto} alt="" loading={groot ? 'eager' : 'lazy'} />
        </span>
      )}
      <span className="kr-teaser-tekst">
        <span className="kr-rubriek">
          {extra && <span className="kr-extra-label">Extra</span>}
          <span>{RUBRIEK[a.m]?.naam ?? a.m}</span>
          {t.hoofdstuk && <span className="kr-hoofdstuk">{t.hoofdstuk}</span>}
        </span>
        <span className="kr-teaser-kop">{t.kop}</span>
        {t.intro && <span className="kr-teaser-intro">{t.intro}</span>}
        <span className="kr-teaser-meta">
          {a.gelezen ? (
            <span className="kr-teaser-gelezen">
              <Check size={14} strokeWidth={3} /> Gelezen
            </span>
          ) : (
            <>
              ± {t.minuten} min lezen <ArrowRight size={14} />
            </>
          )}
        </span>
      </span>
    </Link>
  )
}

function SpaansKaart({ poco }: { poco: { klaar: number; totaal: number } }) {
  const spaans = MODULE_BY_ID.spaans
  const klaar = Math.min(poco.klaar, poco.totaal)
  const af = poco.totaal > 0 && poco.klaar >= poco.totaal
  return (
    <Link to="/spaans" className={`kr-sk${af ? ' af' : ''}`} style={{ '--mk': spaans.accent } as CSSProperties}>
      <span className={`kr-sk-band lade-spaans`}>
        {spaans.icon}
        <span>Spaans</span>
        {af && <Check size={15} strokeWidth={3} className="kr-sk-vink" />}
      </span>
      <span className="kr-sk-body">
        <strong>Dertig woorden</strong>
        <span className="kr-sk-balk">
          <i style={{ width: `${poco.totaal ? (klaar / poco.totaal) * 100 : 0}%` }} />
        </span>
        <span className="kr-sk-meta tabular">
          {klaar}/{poco.totaal} · {poco.klaar === 0 ? 'begin' : af ? 'herhaal' : 'ga verder'} <ArrowRight size={14} />
        </span>
      </span>
    </Link>
  )
}

function StampKaart({
  moduleId,
  g,
  vandaag,
  wijzig,
}: {
  moduleId: string
  g: Geheugen
  vandaag: number
  wijzig: ReturnType<typeof useGeheugen>['wijzig']
}) {
  const m = MODULE_BY_ID[moduleId]
  const { leerstof, eenheden, les, voortgang } = useLesPlan(moduleId, g, vandaag, wijzig)
  if (!m || !leerstof) return null
  const naam = (id: string) => eenheden?.find((e) => e.id === id)?.naam ?? '…'
  const klaar = les?.klaar
  const titel = !les
    ? '…'
    : les.nieuw.length > 0
      ? leerstof.perDag === 1
        ? naam(les.nieuw[0])
        : `${les.nieuw.length} nieuwe ${leerstof.meervoud}`
      : les.herhaal.length > 0
        ? 'Herhalen'
        : 'Niets nieuws vandaag'
  return (
    <Link to={`/vandaag/${moduleId}`} className={`kr-sk${klaar ? ' af' : ''}`} style={{ '--mk': m.accent } as CSSProperties}>
      <span className={`kr-sk-band lade-${m.id}`}>
        {m.icon}
        <span>{m.title}</span>
        {klaar && (
          <span className="kr-sk-score">
            <Check size={13} strokeWidth={3} /> {klaar.goed}/{klaar.totaal}
          </span>
        )}
      </span>
      <span className="kr-sk-body">
        <strong>{titel}</strong>
        {les && les.herhaal.length > 0 && les.nieuw.length > 0 && <span className="kr-sk-sub">+ {les.herhaal.length} herhalen</span>}
        {voortgang && (
          <span className="kr-sk-balk">
            <i style={{ width: `${(voortgang.gekend / Math.max(voortgang.totaal, 1)) * 100}%` }} />
          </span>
        )}
        <span className="kr-sk-meta tabular">
          {voortgang ? `${voortgang.gekend}/${voortgang.totaal} ${leerstof.meervoud}` : ''} · {klaar ? 'bekijk' : 'begin'} <ArrowRight size={14} />
        </span>
      </span>
    </Link>
  )
}

function Weekrooster({ g, vandaag }: { g: Geheugen; vandaag: number }) {
  const vandaagDag = new Date().getDay()
  const offset = (vandaagDag + 6) % 7
  return (
    <section className="kr-week" aria-labelledby="week-kop">
      <h2 id="week-kop">Deze week</h2>
      <ol>
        {WEEKVOLGORDE.map((dag, i) => {
          const n = vandaag - offset + i
          const d = g.dagen[dagSleutel(n)]
          const vol = !!d && d.gepland.length > 0 && d.gepland.every((m) => d.klaar.includes(m))
          return (
            <li key={dag} className={`${dag === vandaagDag ? 'nu' : ''}${n < vandaag ? ' voorbij' : ''}${vol ? ' vol' : ''}`}>
              <span className="kr-week-dag">
                {DAGNAMEN[dag].slice(0, 2)}
                {vol && <Check size={12} strokeWidth={3} />}
              </span>
              <span className="kr-week-stamp">
                {STAMP_ROOSTER[dag].map((id) => (
                  <span key={id} title={MODULE_BY_ID[id]?.title} style={{ '--mk': MODULE_BY_ID[id]?.accent } as CSSProperties}>
                    {MODULE_BY_ID[id]?.icon}
                  </span>
                ))}
              </span>
              <span className="kr-week-krant">{RUBRIEK[KRANT_ROOSTER[dag][0]]?.naam}</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
