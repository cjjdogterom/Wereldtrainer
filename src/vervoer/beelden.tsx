import { useState, type ReactNode } from 'react'
import type { BeeldId } from './types'

function T({ x, y, children, g = 11, a = 'middle', kleur, vet }: { x: number; y: number; children: ReactNode; g?: number; a?: 'start' | 'middle' | 'end'; kleur?: string; vet?: boolean }) {
  return (
    <text x={x} y={y} fontSize={g} textAnchor={a} fill={kleur ?? 'currentColor'} fontWeight={vet ? 700 : 400} fontFamily="var(--body)">
      {children}
    </text>
  )
}

function Pijl({ x1, y1, x2, y2, kleur = 'currentColor', dik = 2 }: { x1: number; y1: number; x2: number; y2: number; kleur?: string; dik?: number }) {
  const h = Math.atan2(y2 - y1, x2 - x1)
  const a = 7
  return (
    <g stroke={kleur} fill={kleur} strokeWidth={dik}>
      <line x1={x1} y1={y1} x2={x2 - Math.cos(h) * 3} y2={y2 - Math.sin(h) * 3} />
      <polygon
        stroke="none"
        points={`${x2},${y2} ${x2 - a * Math.cos(h - 0.45)},${y2 - a * Math.sin(h - 0.45)} ${x2 - a * Math.cos(h + 0.45)},${y2 - a * Math.sin(h + 0.45)}`}
      />
    </g>
  )
}

// ─── PAPI: interactief ───
// Overgangshoeken bij een glijpad van 3°: 2,5° · 2,83° · 3,17° · 3,5°.
const OVERGANG = [3.5, 3.17, 2.83, 2.5]

function Papi() {
  const [hoek, setHoek] = useState(3)
  const wit = OVERGANG.filter((o) => hoek > o).length
  const oordeel =
    wit === 4 ? 'Veel te hoog' : wit === 3 ? 'Iets te hoog' : wit === 2 ? 'Op het glijpad' : wit === 1 ? 'Iets te laag' : 'Veel te laag — gevaarlijk'
  // zijaanzicht: vliegtuig 62 eenheden vóór de baandrempel, hoogte 4× overdreven
  const yVlieg = 62 - Math.tan((hoek * Math.PI) / 180) * 62 * 4
  return (
    <figure className="vt-beeld vt-papi">
      <svg viewBox="0 0 340 210" role="img" aria-label={`PAPI: ${wit} wit, ${4 - wit} rood`}>
        <rect x={0} y={0} width={340} height={210} rx={10} fill="#1b2433" />
        {/* baan in perspectief */}
        <polygon points="120,200 220,200 186,104 154,104" fill="#3a4250" />
        <line x1={170} y1={200} x2={170} y2={106} stroke="#e8ecf2" strokeWidth={1.5} strokeDasharray="8 7" />
        {/* PAPI-balk links van de baan */}
        {[0, 1, 2, 3].map((i) => {
          const isWit = i < wit
          return (
            <g key={i}>
              <circle cx={44 + i * 20} cy={150} r={12} fill={isWit ? '#ffffff' : '#ff3b2f'} opacity={0.18} />
              <circle cx={44 + i * 20} cy={150} r={6.5} fill={isWit ? '#ffffff' : '#ff3b2f'} />
            </g>
          )
        })}
        <T x={74} y={180} kleur="#c9d2e0" g={10}>PAPI</T>
        {/* zijaanzicht rechtsboven */}
        <g transform="translate(232 20)">
          <rect width={98} height={70} rx={6} fill="#273246" />
          <line x1={8} y1={62} x2={92} y2={62} stroke="#59657a" />
          {/* hoogte 4× overdreven zodat het verschil zichtbaar is */}
          <line x1={92} y1={62} x2={10} y2={62 - Math.tan((3 * Math.PI) / 180) * 82 * 4} stroke="#4fbf8c" strokeDasharray="3 3" />
          <circle cx={30} cy={yVlieg} r={3.5} fill="#f2d27a" />
          <T x={49} y={12} kleur="#c9d2e0" g={9}>zijaanzicht</T>
        </g>
        <T x={170} y={30} kleur="#ffffff" g={15} vet>{oordeel}</T>
        <T x={170} y={48} kleur="#c9d2e0" g={11}>{hoek.toFixed(1).replace('.', ',')}° · {wit} wit, {4 - wit} rood</T>
      </svg>
      <label className="vt-schuif">
        <span>Naderingshoek</span>
        <input type="range" min={1.8} max={4.2} step={0.1} value={hoek} onChange={(e) => setHoek(Number(e.target.value))} />
      </label>
      <figcaption>Schuif de hoek: twee wit en twee rood betekent dat je op het glijpad van 3° zit.</figcaption>
    </figure>
  )
}

// ─── Viertaktcyclus ───
function Viertakt() {
  const takten = [
    { naam: 'Inlaat', zuiger: 70, inlaat: true, uitlaat: false, vonk: false, kleur: '#7fb6e6' },
    { naam: 'Compressie', zuiger: 22, inlaat: false, uitlaat: false, vonk: false, kleur: '#a7c6e8' },
    { naam: 'Arbeid', zuiger: 70, inlaat: false, uitlaat: false, vonk: true, kleur: '#f2a35e' },
    { naam: 'Uitlaat', zuiger: 22, inlaat: false, uitlaat: true, vonk: false, kleur: '#b9b2a8' },
  ]
  return (
    <figure className="vt-beeld">
      <svg viewBox="0 0 340 170" role="img" aria-label="De vier takten van een viertaktmotor">
        {takten.map((t, i) => {
          const x = 10 + i * 82
          return (
            <g key={t.naam} transform={`translate(${x} 10)`}>
              <rect x={10} y={20} width={50} height={90} fill="none" stroke="currentColor" strokeWidth={2} />
              <rect x={11} y={21} width={48} height={t.zuiger - 1} fill={t.kleur} opacity={0.6} />
              <rect x={12} y={20 + t.zuiger} width={46} height={16} rx={2} fill="#6b7280" />
              <line x1={35} y1={36 + t.zuiger} x2={35} y2={128} stroke="#6b7280" strokeWidth={4} />
              {/* kleppen */}
              <line x1={20} y1={4} x2={20} y2={t.inlaat ? 28 : 20} stroke="#2d63b0" strokeWidth={3} />
              <line x1={50} y1={4} x2={50} y2={t.uitlaat ? 28 : 20} stroke="#c43c2f" strokeWidth={3} />
              {t.vonk && <polygon points="35,20 31,30 36,28 33,38 41,25 36,27 39,20" fill="#f2d27a" stroke="#c48a12" strokeWidth={0.8} />}
              <T x={35} y={148} vet g={11}>{`${i + 1}. ${t.naam}`}</T>
              {t.zuiger === 22 ? <Pijl x1={66} y1={80} x2={66} y2={55} dik={1.5} /> : <Pijl x1={66} y1={55} x2={66} y2={80} dik={1.5} />}
            </g>
          )
        })}
      </svg>
      <figcaption>Twee omwentelingen van de krukas: inlaatklep (blauw) en uitlaatklep (rood) openen elk één keer.</figcaption>
    </figure>
  )
}

// ─── ILS ───
function Ils() {
  return (
    <figure className="vt-beeld">
      <svg viewBox="0 0 340 200" role="img" aria-label="ILS: localizer en glideslope">
        <T x={10} y={16} a="start" vet>Bovenaanzicht — localizer (links/rechts)</T>
        <rect x={250} y={46} width={80} height={14} fill="#59657a" />
        <polygon points="250,53 30,30 30,76" fill="#2d63b0" opacity={0.15} />
        <line x1={250} y1={53} x2={30} y2={53} stroke="#2d63b0" strokeDasharray="5 4" strokeWidth={2} />
        <T x={60} y={28} g={10} kleur="#2d63b0">90 Hz</T>
        <T x={60} y={88} g={10} kleur="#c43c2f">150 Hz</T>
        <T x={10} y={118} a="start" vet>Zijaanzicht — glideslope (op/neer, 3°)</T>
        <line x1={20} y1={186} x2={330} y2={186} stroke="currentColor" />
        <rect x={250} y={182} width={80} height={6} fill="#59657a" />
        <polygon points="262,186 30,128 30,158" fill="#1d8a52" opacity={0.15} />
        <line x1={262} y1={186} x2={30} y2={143} stroke="#1d8a52" strokeDasharray="5 4" strokeWidth={2} />
        <T x={140} y={152} g={10} kleur="#1d8a52">3°</T>
        <T x={300} y={176} g={10}>baan</T>
      </svg>
      <figcaption>Twee radiobundels: de localizer wijst de baanas aan, de glideslope het daalpad.</figcaption>
    </figure>
  )
}

// ─── Vleugelprofiel ───
function Vleugel() {
  return (
    <figure className="vt-beeld">
      <svg viewBox="0 0 340 190" role="img" aria-label="Vleugelprofiel met invalshoek en lift">
        <g transform="rotate(-8 170 110)">
          <path d="M70 110 C 90 78, 190 72, 290 106 C 200 116, 110 122, 70 110 Z" fill="#dbe6f3" stroke="currentColor" strokeWidth={2} />
          <line x1={70} y1={110} x2={290} y2={106} stroke="currentColor" strokeDasharray="4 4" />
          <T x={210} y={128} g={10}>koorde</T>
        </g>
        {[60, 140].map((y) => (
          <Pijl key={y} x1={8} y1={y + 12} x2={58} y2={y + 12} kleur="#7c8796" dik={1.5} />
        ))}
        <T x={10} y={60} a="start" g={10}>relatieve wind</T>
        <Pijl x1={170} y1={100} x2={170} y2={24} kleur="#1d8a52" dik={3} />
        <T x={178} y={30} a="start" kleur="#1d8a52" vet>lift</T>
        <Pijl x1={250} y1={104} x2={318} y2={104} kleur="#c43c2f" dik={2} />
        <T x={312} y={96} a="end" kleur="#c43c2f" g={10}>weerstand</T>
        <path d="M70 140 A 60 60 0 0 1 78 125" fill="none" stroke="#c48a12" strokeWidth={2} />
        <T x={92} y={150} kleur="#c48a12" g={10} a="start">invalshoek α</T>
        <T x={170} y={182} g={10}>Bovenlangs lagere druk, onderlangs hogere druk; de stroming wordt omlaag afgebogen.</T>
      </svg>
      <figcaption>Lift = ½ × ρ × v² × S × CL — en CL groeit met de invalshoek, tot de vleugel overtrekt.</figcaption>
    </figure>
  )
}

// ─── Rotorkop (swashplate) ───
function Rotor() {
  return (
    <figure className="vt-beeld">
      <svg viewBox="0 0 340 200" role="img" aria-label="Rotorkop met tuimelschijf">
        <line x1={170} y1={40} x2={170} y2={180} stroke="#6b7280" strokeWidth={8} />
        <rect x={40} y={32} width={260} height={10} rx={3} fill="#3a4250" transform="rotate(-6 170 37)" />
        <T x={60} y={24} a="start" g={10}>rotorbladen</T>
        <g transform="rotate(-8 170 122)">
          <rect x={110} y={116} width={120} height={8} rx={2} fill="#c48a12" />
          <rect x={114} y={128} width={112} height={8} rx={2} fill="#8a6a1c" />
        </g>
        <line x1={124} y1={112} x2={110} y2={40} stroke="currentColor" strokeWidth={2} />
        <line x1={216} y1={100} x2={230} y2={30} stroke="currentColor" strokeWidth={2} />
        <T x={244} y={106} a="start" g={10}>tuimelschijf (draait mee)</T>
        <T x={244} y={136} a="start" g={10}>vast deel</T>
        <T x={86} y={78} a="end" g={10}>pitch link</T>
        <line x1={130} y1={140} x2={130} y2={184} stroke="#2d63b0" strokeWidth={2} />
        <line x1={210} y1={130} x2={210} y2={184} stroke="#2d63b0" strokeWidth={2} />
        <T x={170} y={196} g={10} kleur="#2d63b0">stuurstangen van cyclic en collective</T>
      </svg>
      <figcaption>Collective schuift de schijf op en neer (alle bladen gelijk); cyclic kantelt hem, zodat de bladhoek per omwenteling varieert.</figcaption>
    </figure>
  )
}

// ─── Platzcircuit ───
function Circuit() {
  return (
    <figure className="vt-beeld">
      <svg viewBox="0 0 340 200" role="img" aria-label="Linkerhand platzcircuit">
        <rect x={110} y={92} width={120} height={16} fill="#59657a" />
        <T x={170} y={104} g={9} kleur="#fff">baan 09</T>
        <path d="M250 100 H 320 V 30 H 20 V 100 H 92" fill="none" stroke="#2d63b0" strokeWidth={2.5} strokeDasharray="7 5" />
        <Pijl x1={300} y1={30} x2={240} y2={30} kleur="#2d63b0" />
        <Pijl x1={20} y1={50} x2={20} y2={90} kleur="#2d63b0" />
        <Pijl x1={44} y1={100} x2={96} y2={100} kleur="#2d63b0" />
        <Pijl x1={320} y1={90} x2={320} y2={44} kleur="#2d63b0" />
        <T x={170} y={22} vet>downwind</T>
        <T x={8} y={70} a="start" g={10} vet>base</T>
        <T x={56} y={124} vet>final</T>
        <T x={334} y={70} a="end" g={10} vet>crosswind</T>
        <T x={286} y={124} g={10} vet>upwind</T>
        <T x={170} y={168} g={11}>Circuithoogte meestal ± 1000 ft boven het veld; standaard linkerhand.</T>
      </svg>
      <figcaption>Het circuit rond het veld: opstijgen, crosswind, downwind langs de baan, base en final.</figcaption>
    </figure>
  )
}

// ─── Baanmarkeringen ───
function Baan() {
  return (
    <figure className="vt-beeld">
      <svg viewBox="0 0 340 170" role="img" aria-label="Baanmarkeringen">
        <rect x={20} y={50} width={310} height={70} fill="#3a4250" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect key={i} x={26} y={56 + i * 8} width={26} height={5} fill="#fff" />
        ))}
        <T x={70} y={90} kleur="#fff" g={22} vet>27</T>
        <line x1={96} y1={85} x2={330} y2={85} stroke="#fff" strokeWidth={2} strokeDasharray="14 10" />
        <rect x={150} y={60} width={34} height={8} fill="#fff" />
        <rect x={150} y={102} width={34} height={8} fill="#fff" />
        {[110, 210].map((x) => (
          <g key={x}>
            <rect x={x} y={62} width={20} height={4} fill="#fff" />
            <rect x={x} y={104} width={20} height={4} fill="#fff" />
          </g>
        ))}
        <rect x={190} y={128} width={24} height={40} fill="#59657a" />
        <line x1={190} y1={136} x2={214} y2={136} stroke="#f2c500" strokeWidth={2} />
        <line x1={190} y1={141} x2={214} y2={141} stroke="#f2c500" strokeWidth={2} strokeDasharray="4 3" />
        <T x={39} y={42} g={10}>threshold</T>
        <T x={167} y={42} g={10}>aiming point</T>
        <T x={120} y={142} g={10}>touchdown zone</T>
        <T x={276} y={152} g={10}>holding position</T>
      </svg>
      <figcaption>Baan 27 ligt op een magnetische koers van ongeveer 270°. Stop vóór de gele dubbele doorgetrokken lijn tot je klaring hebt.</figcaption>
    </figure>
  )
}

export function Beeld({ id }: { id: BeeldId }) {
  switch (id) {
    case 'papi':
      return <Papi />
    case 'viertakt':
      return <Viertakt />
    case 'ils':
      return <Ils />
    case 'vleugel':
      return <Vleugel />
    case 'rotor':
      return <Rotor />
    case 'circuit':
      return <Circuit />
    case 'baan':
      return <Baan />
  }
}
