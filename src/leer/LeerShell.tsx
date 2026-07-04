import { Link } from 'react-router-dom'
import type { CSSProperties, ReactNode } from 'react'
import './km.css'

export type LeerTab = { id: string; label: string }

// Gedeelde schil voor alle kennismodules: kop met embleem, tabs en voetnoot.
export default function LeerShell({
  mark,
  accent,
  title,
  subtitle,
  tabs,
  active,
  onSelect,
  footnote,
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
  children: ReactNode
}) {
  return (
    <div className="km-app" style={{ '--km-accent': accent } as CSSProperties}>
      <header className="km-header">
        <div className="km-header-inner">
          <div className="km-brand">
            <span className="km-mark" aria-hidden="true">{mark}</span>
            <div>
              <span className="km-title">{title}</span>
              <span className="km-subtitle">{subtitle}</span>
            </div>
          </div>
          <nav className="km-nav" aria-label="Onderdelen">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`km-tab${tab.id === active ? ' active' : ''}`}
                onClick={() => onSelect(tab.id)}
              >
                {tab.label}
              </button>
            ))}
            <span className="km-nav-sep" aria-hidden="true" />
            <Link to="/" className="km-tab km-tab-quiet">Leerapp</Link>
          </nav>
        </div>
      </header>
      <main className="km-main">{children}</main>
      {footnote && <footer className="km-footer">{footnote}</footer>}
    </div>
  )
}
