import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react'
import StukView from '../krant/StukView'
import { laadStukken, type Stuk } from '../krant/stukken'
import KrantArtikel from './KrantArtikel'
import { RUBRIEK, stukSleutel, useKrant } from './krant'
import { useGeheugen } from './useLeer'
import './krant.css'
import './lezen.css'

export default function Lezen() {
  const { nr } = useParams()
  const i = Number(nr)
  const navigate = useNavigate()
  const { g, vandaag, wijzigKrant } = useGeheugen()
  const krant = useKrant(g, vandaag, wijzigKrant)
  const a = krant.artikelen[i]
  const inhoud = a ? krant.inhoud(a) : null
  const volgendeNr = krant.artikelen.findIndex((x, j) => j !== i && !x.gelezen)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [i])

  const rubriekNaam = a ? (RUBRIEK[a.m]?.naam ?? a.m) : ''

  return (
    <div className="kr lz">
      <nav className="lz-nav">
        <Link to="/krant">
          <ArrowLeft size={16} /> De krant
        </Link>
        {krant.artikelen.length > 0 && (
          <span className="tabular">
            Artikel {i + 1} van {krant.artikelen.length}
          </span>
        )}
      </nav>

      {!a || !inhoud ? (
        <div className="lz-laden">{krant.artikelen.length && !a ? 'Dit artikel staat niet in de krant van vandaag.' : 'De krant wordt gedrukt…'}</div>
      ) : inhoud.stuk ? (
        <StukView stuk={inhoud.stuk} rubriek={a.m} rubriekNaam={rubriekNaam} />
      ) : (
        <div className="lz-kort">
          <KrantArtikel m={a.m} units={inhoud.units ?? []} voorpagina gelezen={false} onGelezen={() => {}} zonderAfvinken />
        </div>
      )}

      {a && inhoud && (
        <footer className="lz-einde">
          {a.gelezen ? (
            <>
              <p className="lz-gelezen">
                <Check size={18} strokeWidth={3} /> Gelezen
              </p>
              <button type="button" className="lz-knop stil" onClick={() => krant.zetGelezen(i, false)}>
                <RotateCcw size={15} /> Toch nog niet
              </button>
            </>
          ) : (
            <button
              type="button"
              className="lz-knop"
              onClick={() => {
                krant.zetGelezen(i, true)
                navigate(volgendeNr >= 0 ? `/krant/${volgendeNr}` : '/krant')
              }}
            >
              <Check size={18} strokeWidth={3} /> Gelezen{volgendeNr >= 0 ? ', volgend artikel' : ', terug naar de krant'}
            </button>
          )}
          {a.gelezen && volgendeNr >= 0 && (
            <Link to={`/krant/${volgendeNr}`} className="lz-knop stil">
              Volgend artikel <ArrowRight size={15} />
            </Link>
          )}
          <Link to="/krant" className="lz-terug">
            Terug naar de krant
          </Link>
        </footer>
      )}
    </div>
  )
}

// Een lang artikel direct uit het leerpad van een vak lezen.
export function LeesStuk() {
  const { m = '', id = '' } = useParams()
  const { g, vandaag, wijzigKrant } = useGeheugen()
  const krant = useKrant(g, vandaag, wijzigKrant)
  const [stuk, setStuk] = useState<Stuk | null | undefined>(undefined)
  const gelezen = !!g.krant?.gelezen[stukSleutel(m, id)]

  useEffect(() => {
    laadStukken(m).then((l) => setStuk(l.find((s) => s.id === id) ?? null))
    window.scrollTo(0, 0)
  }, [m, id])

  return (
    <div className="kr lz">
      <nav className="lz-nav">
        <Link to={`/vakken/${m}`}>
          <ArrowLeft size={16} /> {RUBRIEK[m]?.naam ?? m}
        </Link>
      </nav>
      {stuk === undefined ? (
        <div className="lz-laden">Artikel wordt geladen…</div>
      ) : stuk === null ? (
        <div className="lz-laden">Dit artikel bestaat niet (meer).</div>
      ) : (
        <>
          <StukView stuk={stuk} rubriek={m} rubriekNaam={RUBRIEK[m]?.naam ?? m} />
          <footer className="lz-einde">
            {gelezen ? (
              <>
                <p className="lz-gelezen">
                  <Check size={18} strokeWidth={3} /> Gelezen
                </p>
                <button type="button" className="lz-knop stil" onClick={() => krant.zetStuk(m, id, false)}>
                  <RotateCcw size={15} /> Toch nog niet
                </button>
              </>
            ) : (
              <Link to={`/vakken/${m}`} className="lz-knop" onClick={() => krant.zetStuk(m, id, true)}>
                <Check size={18} strokeWidth={3} /> Gelezen, terug naar het leerpad
              </Link>
            )}
          </footer>
        </>
      )}
    </div>
  )
}
