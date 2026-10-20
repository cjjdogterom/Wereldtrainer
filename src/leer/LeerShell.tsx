import { Link } from 'react-router-dom'
import type { CSSProperties, ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import './km.css'

export type LeerTab = { id: string; label: string }

// Gedeelde schil voor de kennismodules. Met `wereld` (het module-id) krijgt de
// kop het materiaal van die module, zoals op de homepage.
export default function LeerShell({
  mark,
  accent,
  title,
  subtitle,
  tabs,
  active,
  onSelect,
  footnote,
  wereld,
  children,
}: {
  mark: string
  accent: string
  title: string
  subtitle: string
  tabs: LeerTab[]
  active: string
  onSelect: (id: string) => void
  footnote?: ReactNode
  wereld?: string
  children: ReactNode
}) {
  const nav = (
    <nav className="km-nav" aria-label="Onderdelen">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`km-tab${tab.id === active ? ' active' : ''}`}
          aria-current={tab.id === active ? 'page' : undefined}
          onClick={() => onSelect(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )

  return (
    <div className={`km-app${wereld ? ` km-met-wereld km-wereld-${wereld}` : ''}`} style={{ '--km-accent': accent } as CSSProperties}>
      {wereld ? (
        <>
          <header className={`km-wereld lade-${wereld}`}>
            <div className="km-wereld-binnen">
              <Link to="/" className="km-terug">
                <ArrowLeft size={16} /> Wereldtrainer
              </Link>
              <h1 className="km-wereld-titel">{title}</h1>
              <p className="km-wereld-sub">{subtitle}</p>
            </div>
          </header>
          <div className="km-tabbalk">
            <div className="km-tabbalk-binnen">{nav}</div>
          </div>
        </>
      ) : (
        <header className="km-header">
          <div className="km-header-inner">
            <div className="km-brand">
              <span className="km-mark" aria-hidden="true">{mark}</span>
              <div>
                <span className="km-title">{title}</span>
                <span className="km-subtitle">{subtitle}</span>
              </div>
            </div>
            <div className="km-nav-rij">
              {nav}
              <span className="km-nav-sep" aria-hidden="true" />
              <Link to="/" className="km-tab km-tab-quiet">Wereldtrainer</Link>
            </div>
          </div>
        </header>
      )}
      <main className="km-main">{children}</main>
      {footnote && <footer className="km-footer">{footnote}</footer>}
    </div>
  )
}
