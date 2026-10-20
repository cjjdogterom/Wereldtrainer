import type { ReactNode } from 'react'
import { KLEUR, Op, Pijl, Symbool } from './symbolen'
import type { SchemaId } from './types'

function Draad({ p, kleur = KLEUR.draad, dik }: { p: string; kleur?: string; dik?: boolean }) {
  return <polyline points={p} fill="none" stroke={kleur} strokeWidth={dik ? 3 : 2} strokeLinejoin="round" />
}

function Knoop({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={3} fill="currentColor" stroke="none" />
}

function T({ x, y, children, g = 12, a = 'middle', kleur, vet }: { x: number; y: number; children: ReactNode; g?: number; a?: 'start' | 'middle' | 'end'; kleur?: string; vet?: boolean }) {
  return (
    <text x={x} y={y} fontSize={g} textAnchor={a} fill={kleur ?? 'currentColor'} stroke="none" fontWeight={vet ? 700 : 400} fontFamily="var(--body)">
      {children}
    </text>
  )
}

function Kast({ x, y, b, h, children }: { x: number; y: number; b: number; h: number; children?: ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={b} height={h} rx={5} fill="var(--sch-vlak)" stroke="currentColor" strokeWidth={1.6} />
      {children}
    </g>
  )
}

// Een wisselschakelaar (één ingang, twee uitgangen) met de hefboom naar boven.
function Wissel({ x, y, spiegel = false }: { x: number; y: number; spiegel?: boolean }) {
  const s = spiegel ? -1 : 1
  return (
    <g transform={`translate(${x} ${y}) scale(${s} 1)`} stroke="currentColor" strokeWidth={2}>
      <circle cx={0} cy={0} r={2.5} fill="currentColor" />
      <line x1={0} y1={0} x2={26} y2={-14} />
      <circle cx={30} cy={-16} r={2.5} fill="var(--sch-vlak)" />
      <circle cx={30} cy={16} r={2.5} fill="var(--sch-vlak)" />
    </g>
  )
}

const SCHEMAS: Record<SchemaId, { titel: string; tekening: ReactNode; vb?: string }> = {
  serie: {
    titel: 'Serieschakeling: één stroomkring, de spanning verdeelt zich',
    tekening: (
      <>
        <Op x={40} y={160} rot={-90}><Symbool id="batterij" /></Op>
        <Draad p="40,100 40,40 90,40" />
        <Op x={90} y={40}><Symbool id="weerstand" /></Op>
        <Draad p="150,40 190,40" />
        <Op x={190} y={40}><Symbool id="weerstand" /></Op>
        <Draad p="250,40 300,40 300,160 40,160" />
        <T x={120} y={26}>R1</T>
        <T x={220} y={26}>R2</T>
        <T x={22} y={134} a="end">U</T>
        <Pijl x1={270} y1={60} x2={270} y2={90} />
        <T x={282} y={80} a="start">I</T>
        <T x={170} y={186} g={11}>I is overal gelijk · R = R1 + R2</T>
      </>
    ),
  },
  parallel: {
    titel: 'Parallelschakeling: dezelfde spanning, de stroom verdeelt zich',
    tekening: (
      <>
        <Op x={40} y={160} rot={-90}><Symbool id="batterij" /></Op>
        <Draad p="40,100 40,40 280,40" />
        <Knoop x={150} y={40} />
        <Knoop x={150} y={160} />
        <Op x={150} y={40} rot={90}><Symbool id="weerstand" /></Op>
        <Draad p="150,100 150,160" />
        <Op x={280} y={40} rot={90}><Symbool id="weerstand" /></Op>
        <Draad p="280,100 280,160 40,160" />
        <T x={168} y={74} a="start">R1</T>
        <T x={298} y={74} a="start">R2</T>
        <T x={170} y={186} g={11}>U is overal gelijk · 1/R = 1/R1 + 1/R2</T>
      </>
    ),
  },
  enkelpolig: {
    titel: 'Enkelpolige schakeling: de schakelaar onderbreekt de fase',
    tekening: (
      <>
        <T x={22} y={54} a="end" kleur={KLEUR.fase} vet>L</T>
        <T x={22} y={154} a="end" kleur={KLEUR.nul} vet>N</T>
        <Draad p="30,50 90,50" kleur={KLEUR.fase} dik />
        <Op x={90} y={50}><Symbool id="schakelaar" kleur={KLEUR.fase} /></Op>
        <Draad p="150,50 240,50 240,70" kleur={KLEUR.fase} dik />
        <Op x={240} y={70} rot={90}><Symbool id="lamp" /></Op>
        <Draad p="240,130 240,150 30,150" kleur={KLEUR.nul} dik />
        <T x={120} y={30}>schakelaar</T>
        <T x={268} y={104} a="start">lamp</T>
        <T x={170} y={186} g={11}>Schakel altijd de fase, nooit de nul</T>
      </>
    ),
  },
  wissel: {
    titel: 'Wisselschakeling: één lamp vanaf twee plekken',
    tekening: (
      <>
        <T x={20} y={104} a="end" kleur={KLEUR.fase} vet>L</T>
        <Draad p="26,100 60,100" kleur={KLEUR.fase} dik />
        <Wissel x={60} y={100} />
        <Draad p="90,84 210,84" />
        <Draad p="90,116 210,116" />
        <Wissel x={240} y={100} spiegel />
        <Draad p="240,100 280,100" kleur={KLEUR.fase} dik />
        <Op x={280} y={100} rot={-90}><Symbool id="lamp" /></Op>
        <Draad p="280,40 280,24 310,24" kleur={KLEUR.nul} dik />
        <T x={316} y={28} a="start" kleur={KLEUR.nul} vet>N</T>
        <T x={150} y={76} g={10}>correspondentiedraden</T>
        <T x={150} y={136} g={10}>(twee ‘pendeldraden’)</T>
        <T x={170} y={186} g={11}>Omzetten van één schakelaar keert de toestand om</T>
      </>
    ),
  },
  kruis: {
    titel: 'Kruisschakeling: een kruisschakelaar tussen twee wisselschakelaars',
    tekening: (
      <>
        <T x={18} y={104} a="end" kleur={KLEUR.fase} vet>L</T>
        <Draad p="24,100 44,100" kleur={KLEUR.fase} dik />
        <Wissel x={44} y={100} />
        <Draad p="74,84 130,84" />
        <Draad p="74,116 130,116" />
        <Kast x={130} y={70} b={60} h={60}>
          <line x1={140} y1={84} x2={180} y2={116} stroke="currentColor" strokeWidth={2} strokeDasharray="4 3" />
          <line x1={140} y1={116} x2={180} y2={84} stroke="currentColor" strokeWidth={2} strokeDasharray="4 3" />
        </Kast>
        <Draad p="190,84 246,84" />
        <Draad p="190,116 246,116" />
        <Wissel x={276} y={100} spiegel />
        <Draad p="276,100 306,100" kleur={KLEUR.fase} dik />
        <Op x={306} y={100} rot={-90}><Symbool id="lamp" /></Op>
        <Draad p="306,40 306,24 324,24" kleur={KLEUR.nul} dik />
        <T x={330} y={28} a="start" kleur={KLEUR.nul} vet>N</T>
        <T x={160} y={150} g={10}>kruisschakelaar</T>
        <T x={170} y={186} g={11}>Met meer kruisschakelaars: vanaf drie of meer plekken</T>
      </>
    ),
  },
  groepenkast: {
    titel: 'Groepenkast (eenlijnschema): van hoofdschakelaar naar groepen',
    tekening: (
      <>
        <Kast x={14} y={76} b={62} h={48}>
          <T x={45} y={96} g={10} vet>hoofd-</T>
          <T x={45} y={110} g={10} vet>schakelaar</T>
        </Kast>
        <Draad p="76,100 96,100" dik />
        <Draad p="96,52 96,148" dik />
        <Draad p="96,52 114,52" dik />
        <Draad p="96,148 114,148" dik />
        <Kast x={114} y={32} b={66} h={40}>
          <T x={147} y={50} g={10} vet>aardlek 1</T>
          <T x={147} y={63} g={9}>30 mA</T>
        </Kast>
        <Kast x={114} y={128} b={66} h={40}>
          <T x={147} y={146} g={10} vet>aardlek 2</T>
          <T x={147} y={159} g={9}>30 mA</T>
        </Kast>
        {[18, 52, 86].map((y, i) => (
          <g key={y}>
            <Draad p={`180,52 200,52 200,${y} 222,${y}`} />
            <Kast x={222} y={y - 12} b={50} h={24}><T x={247} y={y + 4} g={10}>B16</T></Kast>
            <Draad p={`272,${y} 292,${y}`} />
            <T x={298} y={y + 4} g={10} a="start">groep {i + 1}</T>
          </g>
        ))}
        {[132, 166].map((y, i) => (
          <g key={y}>
            <Draad p={`180,148 200,148 200,${y} 222,${y}`} />
            <Kast x={222} y={y - 12} b={50} h={24}><T x={247} y={y + 4} g={10}>B16</T></Kast>
            <Draad p={`272,${y} 292,${y}`} />
            <T x={298} y={y + 4} g={10} a="start">groep {i + 4}</T>
          </g>
        ))}
        <T x={45} y={146} g={10}>van de meter</T>
      </>
    ),
  },
  driefase: {
    titel: 'Drie fasen: 230 V naar de nul, 400 V tussen twee fasen',
    tekening: (
      <>
        {[
          ['L1', 40, '#8a5a2b'],
          ['L2', 75, '#1f2328'],
          ['L3', 110, '#7a8088'],
          ['N', 150, KLEUR.nul],
        ].map(([lbl, y, kl]) => (
          <g key={lbl as string}>
            <T x={26} y={(y as number) + 4} a="end" kleur={kl as string} vet>{lbl}</T>
            <Draad p={`34,${y} 316,${y}`} kleur={kl as string} dik />
          </g>
        ))}
        <Knoop x={110} y={40} />
        <Knoop x={110} y={150} />
        <Draad p="110,40 110,150" kleur="#d06a1f" />
        <T x={116} y={136} a="start" kleur="#d06a1f" g={11} vet>230 V</T>
        <Knoop x={230} y={40} />
        <Knoop x={230} y={75} />
        <Draad p="230,40 230,75" kleur="#c43c2f" />
        <T x={236} y={62} a="start" kleur="#c43c2f" g={11} vet>400 V</T>
        <T x={170} y={186} g={11}>400 = 230 × √3 — de fasen lopen 120° uit elkaar</T>
      </>
    ),
  },
  aardlek: {
    titel: 'Aardlekschakelaar: vergelijkt de stroom heen en terug',
    tekening: (
      <>
        <T x={20} y={64} a="end" kleur={KLEUR.fase} vet>L</T>
        <T x={20} y={104} a="end" kleur={KLEUR.nul} vet>N</T>
        <Draad p="26,60 300,60" kleur={KLEUR.fase} dik />
        <Draad p="26,100 300,100" kleur={KLEUR.nul} dik />
        <ellipse cx={110} cy={80} rx={20} ry={40} fill="none" stroke="currentColor" strokeWidth={6} opacity={0.35} />
        <T x={110} y={142} g={10}>ringkern</T>
        <Kast x={250} y={44} b={60} h={72}>
          <T x={280} y={84} g={11}>apparaat</T>
        </Kast>
        <Draad p="280,116 280,150" kleur={KLEUR.aarde} />
        <Op x={280} y={150} rot={90}><Symbool id="aarde" /></Op>
        <T x={292} y={140} a="start" g={10} kleur={KLEUR.aarde}>lek</T>
        <Pijl x1={160} y1={50} x2={200} y2={50} />
        <Pijl x1={200} y1={112} x2={160} y2={112} />
        <T x={170} y={186} g={11}>Verschil groter dan 30 mA → binnen 0,3 s uit</T>
      </>
    ),
  },
  spanningsdeler: {
    titel: 'Spanningsdeler: Uuit = Uin × R2 / (R1 + R2)',
    tekening: (
      <>
        <T x={44} y={30} a="end">Uin</T>
        <Draad p="50,26 160,26 160,40" />
        <Op x={160} y={40} rot={90}><Symbool id="weerstand" /></Op>
        <Knoop x={160} y={100} />
        <Op x={160} y={100} rot={90}><Symbool id="weerstand" /></Op>
        <Draad p="160,160 160,170 50,170" />
        <Draad p="160,100 260,100" />
        <T x={266} y={104} a="start">Uuit</T>
        <T x={178} y={74} a="start">R1</T>
        <T x={178} y={134} a="start">R2</T>
        <T x={44} y={174} a="end">0 V</T>
      </>
    ),
  },
  led: {
    titel: 'LED met voorschakelweerstand: R = (Uvoeding − ULED) / I',
    tekening: (
      <>
        <Op x={40} y={160} rot={-90}><Symbool id="batterij" /></Op>
        <T x={20} y={134} a="end">5 V</T>
        <Draad p="40,100 40,40 90,40" />
        <Op x={90} y={40}><Symbool id="weerstand" /></Op>
        <Draad p="150,40 200,40" />
        <Op x={200} y={40}><Symbool id="led" /></Op>
        <Draad p="260,40 300,40 300,160 40,160" />
        <T x={120} y={26}>150 Ω</T>
        <T x={230} y={66}>rood, 2 V</T>
        <T x={170} y={186} g={11}>(5 − 2) / 0,020 = 150 Ω</T>
      </>
    ),
  },
  transistor: {
    titel: 'Transistor als schakelaar: kleine basisstroom stuurt grote collectorstroom',
    tekening: (
      <>
        <Draad p="170,14 240,14" dik />
        <T x={248} y={18} a="start" g={11}>+5 V</T>
        <Op x={200} y={14} rot={90}><Symbool id="weerstand" /></Op>
        <Op x={200} y={74} rot={90}><Symbool id="led" /></Op>
        <Draad p="200,134 200,140" />
        <Op x={162} y={162}><Symbool id="npn" /></Op>
        <Draad p="200,184 200,196" />
        <Draad p="170,196 240,196" dik />
        <T x={248} y={200} a="start" g={11}>0 V</T>
        <Draad p="40,162 90,162" />
        <Op x={90} y={162}><Symbool id="weerstand" /></Op>
        <Draad p="150,162 162,162" />
        <T x={34} y={166} a="end" g={11}>pin</T>
        <T x={120} y={148} g={10}>Rb</T>
        <T x={214} y={48} a="start" g={10}>R</T>
        <T x={186} y={108} a="end" g={10}>LED</T>
        <T x={236} y={162} a="start" g={10}>C</T>
        <T x={236} y={182} a="start" g={10}>E</T>
      </>
    ),
  },
  brug: {
    titel: 'Bruggelijkrichter: vier diodes maken van wissel- gelijkspanning',
    tekening: (
      <>
        {/* vier diodes in een ruit; stroom loopt steeds naar de +-hoek rechts */}
        <Op x={50} y={100} rot={-45}><g transform="scale(1.414)"><Symbool id="diode" /></g></Op>
        <Op x={110} y={40} rot={45}><g transform="scale(1.414)"><Symbool id="diode" /></g></Op>
        <Op x={50} y={100} rot={45}><g transform="scale(1.414)"><Symbool id="diode" /></g></Op>
        <Op x={110} y={160} rot={-45}><g transform="scale(1.414)"><Symbool id="diode" /></g></Op>
        <Knoop x={50} y={100} />
        <Knoop x={110} y={40} />
        <Knoop x={110} y={160} />
        <Knoop x={170} y={100} />
        <Draad p="110,40 110,20" />
        <Draad p="110,160 110,180" />
        <T x={122} y={22} a="start" g={11}>~ (van de trafo)</T>
        <T x={122} y={184} a="start" g={11}>~</T>
        <Draad p="170,100 230,100 230,50 320,50" />
        <Draad p="50,100 30,100 30,196 320,196" />
        <Draad p="280,50 280,60" />
        <Op x={280} y={60} rot={90}><Symbool id="elco" /></Op>
        <Draad p="280,120 280,196" />
        <T x={326} y={54} a="start" g={13} vet>+</T>
        <T x={326} y={200} a="start" g={13} vet>−</T>
        <T x={268} y={150} a="end" g={10}>afvlakken</T>
      </>
    ),
  },
  rc: {
    titel: 'RC-kring: de condensator laadt op met tijdconstante τ = R × C',
    tekening: (
      <>
        <Op x={30} y={150} rot={-90}><Symbool id="batterij" /></Op>
        <Draad p="30,90 30,40 50,40" />
        <Op x={50} y={40}><Symbool id="schakelaar" /></Op>
        <Draad p="110,40 120,40" />
        <Op x={120} y={40}><Symbool id="weerstand" /></Op>
        <Draad p="180,40 190,40 190,70" />
        <Op x={190} y={70} rot={90}><Symbool id="condensator" /></Op>
        <Draad p="190,130 190,150 30,150" />
        <g transform="translate(220 40)">
          <line x1={0} y1={100} x2={110} y2={100} stroke="currentColor" strokeWidth={1} />
          <line x1={0} y1={100} x2={0} y2={0} stroke="currentColor" strokeWidth={1} />
          <path d="M0 100 C 18 40, 45 14, 108 8" fill="none" stroke="#c43c2f" strokeWidth={2.4} />
          <line x1={22} y1={100} x2={22} y2={37} stroke="#c43c2f" strokeDasharray="3 3" />
          <T x={22} y={114} g={10}>τ</T>
          <T x={104} y={114} g={10}>t</T>
          <T x={34} y={34} a="start" g={10} kleur="#c43c2f">63 %</T>
        </g>
      </>
    ),
  },
  'meet-spanning': {
    titel: 'Spanning meten: de voltmeter parallel over het onderdeel',
    tekening: (
      <>
        <Op x={40} y={160} rot={-90}><Symbool id="batterij" /></Op>
        <Draad p="40,100 40,40 230,40 230,70" />
        <Op x={230} y={70} rot={90}><Symbool id="lamp" /></Op>
        <Draad p="230,130 230,160 40,160" />
        <Knoop x={230} y={56} />
        <Knoop x={230} y={146} />
        <Draad p="230,56 296,56 296,70" kleur="#c43c2f" />
        <Op x={296} y={70} rot={90}><Symbool id="voltmeter" kleur="#c43c2f" /></Op>
        <Draad p="296,130 296,146 230,146" kleur="#c43c2f" />
        <T x={170} y={186} g={11}>Voltmeter heeft een heel hoge inwendige weerstand</T>
      </>
    ),
  },
  'meet-stroom': {
    titel: 'Stroom meten: de ampèremeter in serie, de kring openknippen',
    tekening: (
      <>
        <Op x={40} y={160} rot={-90}><Symbool id="batterij" /></Op>
        <Draad p="40,100 40,40 100,40" />
        <Op x={100} y={40}><Symbool id="ampèremeter" kleur="#c43c2f" /></Op>
        <Draad p="160,40 250,40 250,70" />
        <Op x={250} y={70} rot={90}><Symbool id="lamp" /></Op>
        <Draad p="250,130 250,160 40,160" />
        <T x={170} y={186} g={11}>Ampèremeter heeft bijna geen weerstand — nooit parallel!</T>
      </>
    ),
  },
  sinus: {
    titel: 'Netspanning: 230 V effectief, 325 V top, 50 keer per seconde',
    tekening: (
      <>
        <line x1={30} y1={100} x2={320} y2={100} stroke="currentColor" strokeWidth={1} />
        <line x1={30} y1={20} x2={30} y2={180} stroke="currentColor" strokeWidth={1} />
        <path
          d={Array.from({ length: 141 }, (_, i) => {
            const x = 30 + i * 2
            const y = 100 - 70 * Math.sin((i / 140) * 2 * Math.PI * 2 * 0.62)
            return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
          }).join(' ')}
          fill="none"
          stroke="#2d63b0"
          strokeWidth={2.6}
        />
        <line x1={30} y1={30} x2={320} y2={30} stroke="#c43c2f" strokeDasharray="4 4" />
        <T x={34} y={24} a="start" g={10} kleur="#c43c2f">+325 V (top)</T>
        <line x1={30} y1={50.5} x2={320} y2={50.5} stroke="#1d8a52" strokeDasharray="2 4" />
        <T x={318} y={46} a="end" g={10} kleur="#1d8a52">230 V effectief</T>
        <T x={34} y={186} a="start" g={10}>één periode = 20 ms</T>
      </>
    ),
  },
}

export function SchemaTekening({ id }: { id: SchemaId }) {
  const s = SCHEMAS[id]
  return (
    <figure className="ek-schema">
      <svg viewBox="0 0 340 205" role="img" aria-label={s.titel}>
        <g strokeLinecap="round" fill="none" strokeWidth={2}>
          {s.tekening}
        </g>
      </svg>
      <figcaption>{s.titel}</figcaption>
    </figure>
  )
}
