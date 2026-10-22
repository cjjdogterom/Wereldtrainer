import { useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BarChart3, Flame, LibraryBig, Newspaper, Sun } from 'lucide-react'
import { useGeheugen } from '../dag/useLeer'
import './navigatie.css'

const TABS = [
  { to: '/', label: 'Vandaag', icoon: <Sun size={22} />, eind: true },
  { to: '/krant', label: 'Krant', icoon: <Newspaper size={22} /> },
  { to: '/vakken', label: 'Vakken', icoon: <LibraryBig size={22} /> },
  { to: '/voortgang', label: 'Voortgang', icoon: <BarChart3 size={22} /> },
]

// Vaste navigatie: op de telefoon een tabbalk onderin, op een groot scherm
// een balk bovenin. Tijdens de dagsessie verdwijnt hij (focus).
export default function Navigatie() {
  const { pathname } = useLocation()
  const { reeks } = useGeheugen()
  const verborgen = pathname.startsWith('/sessie')

  useEffect(() => {
    document.body.classList.toggle('zonder-nav', verborgen)
  }, [verborgen])

  if (verborgen) return null
  return (
    <nav className="nv" aria-label="Hoofdmenu">
      <Link to="/" className="nv-merk" aria-label="Wereldtrainer, naar vandaag">
        <span className="nv-merk-teken" aria-hidden="true">
          W
        </span>
        <span className="nv-merk-naam">Wereldtrainer</span>
      </Link>
      <ul className="nv-tabs">
        {TABS.map((t) => (
          <li key={t.to}>
            <NavLink to={t.to} end={t.eind} className={({ isActive }: { isActive: boolean }) => (isActive || (t.to === '/vakken' && /^\/(vakken|lezen)/.test(pathname)) ? 'aan' : '')}>
              {t.icoon}
              <span>{t.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <span className={`nv-reeks${reeks > 0 ? ' aan' : ''}`} title="Dagen op rij">
        <Flame size={15} /> <span className="tabular">{reeks}</span>
      </span>
    </nav>
  )
}
