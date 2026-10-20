import type { ReactNode } from 'react'
import type { SymboolId } from './types'

// Schemasymbolen (IEC/NEN), getekend tussen twee aansluitpunten op (0,0) en (60,0).
// Zo kunnen ze in schema's gedraaid en verplaatst worden met <Op>.

export const KLEUR = {
  draad: 'currentColor',
  fase: '#8a5a2b',
  nul: '#2d63b0',
  aarde: '#3f8f3a',
  aardeStreep: '#d9b21c',
}

const lijn = (x1: number, y1: number, x2: number, y2: number, kleur: string = KLEUR.draad) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={kleur} />
)

export function Pijl({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const hoek = Math.atan2(y2 - y1, x2 - x1)
  const a = 5
  const p1 = [x2 - a * Math.cos(hoek - 0.45), y2 - a * Math.sin(hoek - 0.45)]
  const p2 = [x2 - a * Math.cos(hoek + 0.45), y2 - a * Math.sin(hoek + 0.45)]
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <polygon points={`${x2},${y2} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`} fill="currentColor" stroke="none" />
    </g>
  )
}

// Plaatst een symbool: (x,y) = eerste aansluiting, rot in graden.
export function Op({ x, y, rot = 0, children }: { x: number; y: number; rot?: number; children: ReactNode }) {
  return <g transform={`translate(${x} ${y}) rotate(${rot})`}>{children}</g>
}

function Tekst({ x, y, children, grootte = 11, anker = 'middle' }: { x: number; y: number; children: ReactNode; grootte?: number; anker?: 'start' | 'middle' | 'end' }) {
  return (
    <text x={x} y={y} fontSize={grootte} textAnchor={anker} fill="currentColor" stroke="none" fontFamily="var(--body)">
      {children}
    </text>
  )
}

export function Symbool({ id, kleur }: { id: SymboolId; kleur?: string }) {
  const k = kleur ?? KLEUR.draad
  switch (id) {
    case 'weerstand':
      return (
        <g stroke={k}>
          {lijn(0, 0, 15, 0, k)}
          <rect x={15} y={-6} width={30} height={12} fill="var(--sch-vlak)" />
          {lijn(45, 0, 60, 0, k)}
        </g>
      )
    case 'potmeter':
      return (
        <g stroke={k}>
          {lijn(0, 0, 15, 0, k)}
          <rect x={15} y={-6} width={30} height={12} fill="var(--sch-vlak)" />
          {lijn(45, 0, 60, 0, k)}
          <Pijl x1={20} y1={12} x2={42} y2={-12} />
        </g>
      )
    case 'condensator':
      return (
        <g stroke={k}>
          {lijn(0, 0, 27, 0, k)}
          {lijn(27, -12, 27, 12, k)}
          {lijn(33, -12, 33, 12, k)}
          {lijn(33, 0, 60, 0, k)}
        </g>
      )
    case 'elco':
      return (
        <g stroke={k}>
          {lijn(0, 0, 27, 0, k)}
          <rect x={25} y={-12} width={4} height={24} fill="var(--sch-vlak)" />
          <rect x={32} y={-12} width={4} height={24} fill="currentColor" />
          {lijn(36, 0, 60, 0, k)}
          <Tekst x={19} y={-8} grootte={10}>+</Tekst>
        </g>
      )
    case 'spoel':
      return (
        <g stroke={k} fill="none">
          {lijn(0, 0, 10, 0, k)}
          <path d="M10 0 a5 6 0 0 1 10 0 a5 6 0 0 1 10 0 a5 6 0 0 1 10 0 a5 6 0 0 1 10 0" />
          {lijn(50, 0, 60, 0, k)}
        </g>
      )
    case 'diode':
    case 'led':
    case 'zener':
      return (
        <g stroke={k}>
          {lijn(0, 0, 21, 0, k)}
          <polygon points="21,-10 21,10 38,0" fill="var(--sch-vlak)" />
          {id === 'zener' ? <polyline points="34,-13 38,-10 38,10 42,13" fill="none" /> : lijn(38, -10, 38, 10, k)}
          {lijn(38, 0, 60, 0, k)}
          {id === 'led' && (
            <>
              <Pijl x1={28} y1={-12} x2={36} y2={-22} />
              <Pijl x1={34} y1={-10} x2={42} y2={-20} />
            </>
          )}
        </g>
      )
    case 'npn':
    case 'pnp':
      return (
        <g stroke={k} fill="none">
          <circle cx={34} cy={0} r={15} fill="var(--sch-vlak)" />
          {lijn(0, 0, 27, 0, k)}
          {lijn(27, -9, 27, 9, k)}
          {lijn(27, -4, 38, -12, k)}
          {lijn(38, -12, 38, -22, k)}
          {lijn(27, 4, 38, 12, k)}
          {lijn(38, 12, 38, 22, k)}
          {id === 'npn' ? <Pijl x1={30} y1={6} x2={38} y2={12} /> : <Pijl x1={38} y1={12} x2={30} y2={6} />}
        </g>
      )
    case 'batterij':
      return (
        <g stroke={k}>
          {lijn(0, 0, 26, 0, k)}
          {lijn(26, -14, 26, 14, k)}
          <line x1={34} y1={-7} x2={34} y2={7} strokeWidth={4} />
          {lijn(34, 0, 60, 0, k)}
          <Tekst x={20} y={-10} grootte={10}>+</Tekst>
        </g>
      )
    case 'lamp':
      return (
        <g stroke={k}>
          {lijn(0, 0, 18, 0, k)}
          <circle cx={30} cy={0} r={12} fill="var(--sch-vlak)" />
          {lijn(21.5, -8.5, 38.5, 8.5, k)}
          {lijn(21.5, 8.5, 38.5, -8.5, k)}
          {lijn(42, 0, 60, 0, k)}
        </g>
      )
    case 'schakelaar':
      return (
        <g stroke={k}>
          {lijn(0, 0, 18, 0, k)}
          <circle cx={18} cy={0} r={2} fill="currentColor" />
          {lijn(18, 0, 41, -13, k)}
          <circle cx={42} cy={0} r={2} fill="var(--sch-vlak)" />
          {lijn(44, 0, 60, 0, k)}
        </g>
      )
    case 'drukknop':
      return (
        <g stroke={k}>
          {lijn(0, 0, 18, 0, k)}
          <circle cx={18} cy={0} r={2} fill="currentColor" />
          <circle cx={42} cy={0} r={2} fill="currentColor" />
          {lijn(14, -9, 46, -9, k)}
          {lijn(30, -9, 30, -20, k)}
          {lijn(42, 0, 60, 0, k)}
        </g>
      )
    case 'zekering':
      return (
        <g stroke={k}>
          {lijn(0, 0, 15, 0, k)}
          <rect x={15} y={-6} width={30} height={12} fill="var(--sch-vlak)" />
          {lijn(15, 0, 45, 0, k)}
          {lijn(45, 0, 60, 0, k)}
        </g>
      )
    case 'aarde':
      return (
        <g stroke={KLEUR.aarde}>
          {lijn(0, 0, 30, 0, KLEUR.aarde)}
          {lijn(30, -14, 30, 14, KLEUR.aarde)}
          {lijn(36, -9, 36, 9, KLEUR.aarde)}
          {lijn(42, -4, 42, 4, KLEUR.aarde)}
        </g>
      )
    case 'transformator':
      return (
        <g stroke={k} fill="none">
          {lijn(0, -14, 14, -14, k)}
          {lijn(0, 14, 14, 14, k)}
          <path d="M14 -14 a6 4.7 0 0 1 0 9.3 a6 4.7 0 0 1 0 9.3 a6 4.7 0 0 1 0 9.3" />
          {lijn(27, -16, 27, 16, k)}
          {lijn(33, -16, 33, 16, k)}
          <path d="M46 -14 a6 4.7 0 0 0 0 9.3 a6 4.7 0 0 0 0 9.3 a6 4.7 0 0 0 0 9.3" />
          {lijn(46, -14, 60, -14, k)}
          {lijn(46, 14, 60, 14, k)}
        </g>
      )
    case 'motor':
    case 'voltmeter':
    case 'ampèremeter':
    case 'wisselspanning':
      return (
        <g stroke={k}>
          {lijn(0, 0, 17, 0, k)}
          <circle cx={30} cy={0} r={13} fill="var(--sch-vlak)" />
          {lijn(43, 0, 60, 0, k)}
          {id === 'wisselspanning' ? (
            <path d="M22 0 q4 -9 8 0 t8 0" fill="none" />
          ) : (
            <Tekst x={30} y={4.5} grootte={13}>
              {id === 'motor' ? 'M' : id === 'voltmeter' ? 'V' : 'A'}
            </Tekst>
          )}
        </g>
      )
    case 'stopcontact':
      return (
        <g stroke={k} fill="none">
          {lijn(0, 0, 22, 0, k)}
          <path d="M40 -14 a14 14 0 0 0 0 28" />
          {lijn(22, 0, 26, 0, k)}
          {lijn(40, -17, 40, 17, k)}
          {lijn(30, -17, 30, -11, KLEUR.aarde)}
          {lijn(30, 11, 30, 17, KLEUR.aarde)}
        </g>
      )
  }
}

export const SYMBOOL_INFO: Record<SymboolId, { naam: string; uitleg: string }> = {
  weerstand: { naam: 'Weerstand', uitleg: 'Rechthoek volgens IEC; in Amerikaanse schema’s een zigzaglijn.' },
  potmeter: { naam: 'Potmeter (regelbare weerstand)', uitleg: 'Weerstand met een schuine pijl: de waarde is instelbaar.' },
  condensator: { naam: 'Condensator', uitleg: 'Twee evenwijdige platen met een isolerende laag ertussen.' },
  elco: { naam: 'Elektrolytische condensator (elco)', uitleg: 'Gepolariseerd: de plus-kant moet aan de hoogste spanning.' },
  spoel: { naam: 'Spoel', uitleg: 'Gewikkelde draad; slaat energie op in een magnetisch veld.' },
  diode: { naam: 'Diode', uitleg: 'Stroom gaat in de richting van de driehoek, de streep is de kathode.' },
  led: { naam: 'LED', uitleg: 'Diode met pijltjes naar buiten: hij straalt licht uit.' },
  zener: { naam: 'Zenerdiode', uitleg: 'Diode met gebogen kathodestreep; geleidt in sperrichting bij een vaste spanning.' },
  npn: { naam: 'NPN-transistor', uitleg: 'Pijl bij de emitter wijst naar buiten (Not Pointing iN).' },
  pnp: { naam: 'PNP-transistor', uitleg: 'Pijl bij de emitter wijst naar binnen (Pointing iN Proudly).' },
  batterij: { naam: 'Batterij / gelijkspanningsbron', uitleg: 'Lange streep is de plus, korte dikke streep de min.' },
  lamp: { naam: 'Lamp', uitleg: 'Cirkel met een kruis: een lichtpunt.' },
  schakelaar: { naam: 'Schakelaar (maakcontact)', uitleg: 'Getekend in rustpositie: open.' },
  drukknop: { naam: 'Drukknop', uitleg: 'Contact dat alleen sluit zolang je drukt.' },
  zekering: { naam: 'Zekering', uitleg: 'Rechthoek met een doorlopende lijn: smelt door bij te veel stroom.' },
  aarde: { naam: 'Aarde', uitleg: 'Aflopende strepen: verbinding met aarde of randaarde.' },
  transformator: { naam: 'Transformator', uitleg: 'Twee spoelen met een kern ertussen; zet wisselspanning om.' },
  motor: { naam: 'Motor', uitleg: 'Cirkel met een M.' },
  voltmeter: { naam: 'Voltmeter', uitleg: 'Meet spanning — altijd parallel aansluiten.' },
  ampèremeter: { naam: 'Ampèremeter', uitleg: 'Meet stroom — altijd in serie opnemen.' },
  wisselspanning: { naam: 'Wisselspanningsbron', uitleg: 'Cirkel met een sinusgolfje.' },
  stopcontact: { naam: 'Wandcontactdoos', uitleg: 'Halve cirkel; de streepjes geven randaarde aan.' },
}

export function SymboolKaart({ id, breedte = 120 }: { id: SymboolId; breedte?: number }) {
  return (
    <svg viewBox="-10 -30 80 60" width={breedte} height={(breedte * 60) / 80} className="ek-symbool" aria-label={SYMBOOL_INFO[id].naam}>
      <g strokeWidth={2} strokeLinecap="round" fill="none">
        <Symbool id={id} />
      </g>
    </svg>
  )
}
