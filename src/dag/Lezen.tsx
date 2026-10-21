import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react'
import TopBalk from '../ui/TopBalk'
import StukView from '../krant/StukView'
import KrantArtikel from './KrantArtikel'
import { RUBRIEK, useKrant } from './krant'
import { useGeheugen } from './useLeer'
import './krant.css'
import './lezen.css'

export default function Lezen() {
  const { nr } = useParams()
  const i = Number(nr)
  const navigate = useNavigate()
  const { g, vandaag, wijzigKrant, reeks } = useGeheugen()
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
      <TopBalk reeks={reeks} />
      <nav className="lz-nav">
        <Link to="/vandaag">
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
                navigate(volgendeNr >= 0 ? `/vandaag/lees/${volgendeNr}` : '/vandaag')
              }}
            >
              <Check size={18} strokeWidth={3} /> Gelezen{volgendeNr >= 0 ? ', volgend artikel' : ', terug naar de krant'}
            </button>
          )}
          {a.gelezen && volgendeNr >= 0 && (
            <Link to={`/vandaag/lees/${volgendeNr}`} className="lz-knop stil">
              Volgend artikel <ArrowRight size={15} />
            </Link>
          )}
          <Link to="/vandaag" className="lz-terug">
            Terug naar de krant
          </Link>
        </footer>
      )}
    </div>
  )
}
