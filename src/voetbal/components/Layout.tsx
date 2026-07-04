import { Link, useLocation } from 'react-router-dom';
import type { CSSProperties, ReactNode } from 'react';
import { useDataset } from '../data/DatasetContext';
import { VOETBAL_BASE } from '../App';
import CompetitionMark from './CompetitionMark';

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
    { path: base, label: 'Home', exact: true },
    { path: `${base}/overzicht`, label: 'Overzicht', exact: false },
    { path: `${base}/winnaars`, label: capitalize(dataset.entityNounPlural), exact: false },
    { path: `${base}/overhoren`, label: 'Overhoren', exact: false },
    { path: `${base}/leren`, label: 'Leren', exact: false },
    { path: `${base}/statistieken`, label: 'Statistieken', exact: false },
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
            <CompetitionMark id={dataset.id} color={dataset.theme.primary} size={40} />
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
                  {item.label}
                </Link>
              );
            })}
            <span className="nav-sep" aria-hidden="true" />
            <Link to={VOETBAL_BASE} className="nav-link nav-link-quiet">
              Alle competities
            </Link>
            <Link to="/" className="nav-link nav-link-quiet">
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
