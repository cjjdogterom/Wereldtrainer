import { Link, useLocation } from 'react-router-dom';
import type { CSSProperties, ReactNode } from 'react';
import { useDataset } from '../data/DatasetContext';
import { VOETBAL_BASE } from '../App';

interface LayoutProps {
  children: ReactNode;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const dataset = useDataset();
  const base = `${VOETBAL_BASE}/${dataset.id}`;

  const navItems = [
    { path: base, label: 'Home', icon: '🏠', exact: true },
    { path: `${base}/overzicht`, label: 'Overzicht', icon: '📋', exact: false },
    { path: `${base}/winnaars`, label: capitalize(dataset.entityNounPlural), icon: '⚽', exact: false },
    { path: `${base}/overhoren`, label: 'Overhoren', icon: '🎓', exact: false },
    { path: `${base}/leren`, label: 'Leren', icon: '📚', exact: false },
    { path: `${base}/statistieken`, label: 'Statistieken', icon: '📊', exact: false },
  ];

  const themeStyle = {
    '--primary-color': dataset.theme.primary,
    '--primary-dark': dataset.theme.primaryDark,
    '--secondary-color': dataset.theme.secondary,
    '--accent-color': dataset.theme.accent,
  } as CSSProperties;

  return (
    <div className="app-layout" style={themeStyle}>
      <header className="site-header">
        <div className="header-inner">
          <Link to={base} className="vb-brand">
            <span className="brand-icon">{dataset.icon}</span>
            <div>
              <span className="brand-title">{dataset.title}</span>
              <span className="brand-subtitle">{dataset.subtitle}</span>
            </div>
          </Link>
          <nav className="main-nav">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
            <Link to={VOETBAL_BASE} className="nav-link nav-link-trainers">
              <span className="nav-icon">🔁</span>
              Alle trainers
            </Link>
            <Link to="/" className="nav-link nav-link-trainers">
              <span className="nav-icon">🏠</span>
              Leerapp
            </Link>
          </nav>
        </div>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <p>Data gebaseerd op KNVB-historie, UEFA, FIFA en RSSSF · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
