import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarCheck } from 'lucide-react'
import './spaans.css'

// Poco a Poco draait als zelfstandige app uit public/poco; hier alleen de schil
// met de weg terug naar de Wereldtrainer en de dagtrainer.
export default function SpaansApp() {
  return (
    <div className="sp-schil">
      <nav className="sp-balk lade-spaans" aria-label="Wereldtrainer">
        <Link to="/" className="sp-terug">
          <ArrowLeft size={17} /> Wereldtrainer
        </Link>
        <Link to="/vandaag" className="sp-terug">
          <CalendarCheck size={17} /> Vandaag
        </Link>
      </nav>
      <iframe className="sp-frame" src="/poco/index.html" title="Poco a Poco — Spaans leren" />
    </div>
  )
}
