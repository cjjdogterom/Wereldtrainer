import type { CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Newspaper, Plus } from 'lucide-react'
import { datumTekst } from '../ui/TopBalk'
import { MODULE_BY_ID } from '../modules'
import { samenvatting } from './KrantArtikel'
import { useKrantFotos } from '../krant/StukView'
import { fotoVan, leestijd } from '../krant/stukken'
import type { Foto } from '../ui/Fotos'
import type { Artikel } from './geheugen'
import { RUBRIEK, RUBRIEKEN, useKrant, voortgangRubriek } from './krant'
import { useGeheugen } from './useLeer'
import './vandaag.css'
import './krant.css'

function jaargangNr(d = new Date()): number {
  return Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000)
}

export default function Krant() {
  const { g, vandaag, wijzigKrant, reeks } = useGeheugen()
  const krant = useKrant(g, vandaag, wijzigKrant)
  const [hoofd, ...overig] = krant.artikelen.slice(0, krant.basis)
  const extraArt = krant.artikelen.slice(krant.basis)
  const fotos = useKrantFotos()
  const navigate = useNavigate()
  const minuten = krant.artikelen.slice(0, krant.basis).reduce((t, a) => t + (teaserVan(a, krant, fotos)?.minuten ?? 0), 0)

  return (
    <div className="kr">
      <header className="kr-masthead">
        <p className="kr-mast-regel">
          <span>{datumTekst()}</span>
          <span>Nr. {jaargangNr()}</span>
          <span>{reeks > 0 ? `${reeks} ${reeks === 1 ? 'dag' : 'dagen'} op rij` : 'Elke dag een nieuwe editie'}</span>
        </p>
        <h1 className="kr-titel">De Wereldtrainer</h1>
        <p className="kr-motto">Dagblad voor de nieuwsgierige lezer</p>
      </header>

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
                <button key={m} type="button" className="kr-meer-item" style={{ '--mk': mod?.accent } as CSSProperties} onClick={() => krant.extra(m).then((nr) => nr !== null && navigate(`/krant/${nr}`))}>
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

      </main>

      <footer className="vd-voet">Gelezen artikelen tellen mee voor je dag. Morgen ligt er een nieuwe editie.</footer>
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
    <Link to={`/krant/${i}`} className={`kr-teaser${groot ? ' groot' : ''}${a.gelezen ? ' gelezen' : ''}`}>
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
