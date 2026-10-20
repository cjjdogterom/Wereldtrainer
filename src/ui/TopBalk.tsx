import { Link } from 'react-router-dom'
import { Flame } from 'lucide-react'
import './topbalk.css'

const DAGEN = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag']
const MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december']

export function datumTekst(d = new Date()): string {
  return `${DAGEN[d.getDay()]} ${d.getDate()} ${MAANDEN[d.getMonth()]}`
}

export default function TopBalk({ reeks }: { reeks: number }) {
  return (
    <header className="tb">
      <Link to="/" className="tb-merk" aria-label="Wereldtrainer, naar het overzicht">
        <span className="tb-merk-teken" aria-hidden="true">W</span>
        <span className="tb-merk-naam">Wereldtrainer</span>
      </Link>
      <div className="tb-rechts">
        <span className="tb-datum">{datumTekst()}</span>
        <span className={`tb-reeks${reeks > 0 ? ' aan' : ''}`} title="Dagen op rij met minstens zes onderdelen af">
          <Flame size={15} aria-hidden="true" />
          <span className="tabular">{reeks}</span>
          <span className="tb-reeks-lbl">{reeks === 1 ? 'dag' : 'dagen'}</span>
        </span>
      </div>
    </header>
  )
}
