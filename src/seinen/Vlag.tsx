// De 26 internationale seinvlaggen, getekend als SVG. Kleuren volgens het
// Internationaal Seinboek (benaderd).
const BLAUW = '#1d4a8f'
const ROOD = '#c8102e'
const GEEL = '#f2c500'
const ZWART = '#14181d'
const WIT = '#ffffff'

const S = 120 // viewBox-maat

// Zwaluwstaart-uitsnede (voor A en B): pad van de vlag mét inkeping rechts.
const ZWALUW = `M0 0 H${S} L${S - 34} ${S / 2} L${S} ${S} H0 Z`

function stroken(kleuren: string[], horizontaal: boolean) {
  const n = kleuren.length
  const d = S / n
  return kleuren.map((kleur, i) =>
    horizontaal
      ? <rect key={i} x={0} y={i * d} width={S} height={d} fill={kleur} />
      : <rect key={i} x={i * d} y={0} width={d} height={S} fill={kleur} />,
  )
}

function kwarten(tl: string, tr: string, bl: string, br: string) {
  const h = S / 2
  return (
    <>
      <rect x={0} y={0} width={h} height={h} fill={tl} />
      <rect x={h} y={0} width={h} height={h} fill={tr} />
      <rect x={0} y={h} width={h} height={h} fill={bl} />
      <rect x={h} y={h} width={h} height={h} fill={br} />
    </>
  )
}

function inhoud(letter: string) {
  const h = S / 2
  switch (letter) {
    case 'A':
      return (
        <g clipPath="url(#zwaluw)">
          <rect width={h} height={S} fill={WIT} />
          <rect x={h} width={h} height={S} fill={BLAUW} />
        </g>
      )
    case 'B':
      return <g clipPath="url(#zwaluw)"><rect width={S} height={S} fill={ROOD} /></g>
    case 'C':
      return <>{stroken([BLAUW, WIT, ROOD, WIT, BLAUW], true)}</>
    case 'D':
      return (
        <>
          <rect width={S} height={S} fill={GEEL} />
          <rect y={S / 4} width={S} height={S / 2} fill={BLAUW} />
        </>
      )
    case 'E':
      return <>{stroken([BLAUW, ROOD], true)}</>
    case 'F':
      return (
        <>
          <rect width={S} height={S} fill={WIT} />
          <polygon points={`${h},6 ${S - 6},${h} ${h},${S - 6} 6,${h}`} fill={ROOD} />
        </>
      )
    case 'G':
      return <>{stroken([GEEL, BLAUW, GEEL, BLAUW, GEEL, BLAUW], false)}</>
    case 'H':
      return <>{stroken([WIT, ROOD], false)}</>
    case 'I':
      return (
        <>
          <rect width={S} height={S} fill={GEEL} />
          <circle cx={h} cy={h} r={26} fill={ZWART} />
        </>
      )
    case 'J':
      return <>{stroken([BLAUW, WIT, BLAUW], true)}</>
    case 'K':
      return <>{stroken([GEEL, BLAUW], false)}</>
    case 'L':
      return <>{kwarten(GEEL, ZWART, ZWART, GEEL)}</>
    case 'M':
      return (
        <>
          <rect width={S} height={S} fill={BLAUW} />
          <path d={`M0 0 L${S} ${S} M${S} 0 L0 ${S}`} stroke={WIT} strokeWidth={22} />
        </>
      )
    case 'N': {
      const d = S / 4
      const cells = []
      for (let r = 0; r < 4; r += 1)
        for (let c = 0; c < 4; c += 1)
          cells.push(<rect key={`${r}-${c}`} x={c * d} y={r * d} width={d} height={d} fill={(r + c) % 2 === 0 ? BLAUW : WIT} />)
      return <>{cells}</>
    }
    case 'O':
      return (
        <>
          <polygon points={`0,0 ${S},0 0,${S}`} fill={ROOD} />
          <polygon points={`${S},0 ${S},${S} 0,${S}`} fill={GEEL} />
        </>
      )
    case 'P':
      return (
        <>
          <rect width={S} height={S} fill={BLAUW} />
          <rect x={S / 3} y={S / 3} width={S / 3} height={S / 3} fill={WIT} />
        </>
      )
    case 'Q':
      return <rect width={S} height={S} fill={GEEL} />
    case 'R':
      return (
        <>
          <rect width={S} height={S} fill={ROOD} />
          <rect x={h - 11} width={22} height={S} fill={GEEL} />
          <rect y={h - 11} width={S} height={22} fill={GEEL} />
        </>
      )
    case 'S':
      return (
        <>
          <rect width={S} height={S} fill={WIT} />
          <rect x={S / 3} y={S / 3} width={S / 3} height={S / 3} fill={BLAUW} />
        </>
      )
    case 'T':
      return <>{stroken([ROOD, WIT, BLAUW], false)}</>
    case 'U':
      return <>{kwarten(ROOD, WIT, WIT, ROOD)}</>
    case 'V':
      return (
        <>
          <rect width={S} height={S} fill={WIT} />
          <path d={`M0 0 L${S} ${S} M${S} 0 L0 ${S}`} stroke={ROOD} strokeWidth={22} />
        </>
      )
    case 'W':
      return (
        <>
          <rect width={S} height={S} fill={BLAUW} />
          <rect x={S / 6} y={S / 6} width={(S * 2) / 3} height={(S * 2) / 3} fill={WIT} />
          <rect x={S / 3} y={S / 3} width={S / 3} height={S / 3} fill={ROOD} />
        </>
      )
    case 'X':
      return (
        <>
          <rect width={S} height={S} fill={WIT} />
          <rect x={h - 11} width={22} height={S} fill={BLAUW} />
          <rect y={h - 11} width={S} height={22} fill={BLAUW} />
        </>
      )
    case 'Y': {
      // Vijf rode diagonale banen op geel
      const banen = []
      for (let i = -2; i < 8; i += 1) {
        banen.push(
          <polygon
            key={i}
            points={`${i * 34},0 ${i * 34 + 17},0 ${i * 34 + 17 - S},${S} ${i * 34 - S},${S}`}
            fill={i % 2 === 0 ? ROOD : GEEL}
          />,
        )
      }
      return (
        <>
          <rect width={S} height={S} fill={GEEL} />
          {banen}
        </>
      )
    }
    case 'Z':
      return (
        <>
          <polygon points={`0,0 ${S},0 ${h},${h}`} fill={GEEL} />
          <polygon points={`${S},0 ${S},${S} ${h},${h}`} fill={BLAUW} />
          <polygon points={`0,${S} ${S},${S} ${h},${h}`} fill={ROOD} />
          <polygon points={`0,0 0,${S} ${h},${h}`} fill={ZWART} />
        </>
      )
    default:
      return <rect width={S} height={S} fill={WIT} />
  }
}

export default function SeinVlag({ letter, size = 72 }: { letter: string; size?: number }) {
  return (
    <svg
      viewBox={`0 0 ${S} ${S}`}
      width={size}
      height={size}
      role="img"
      aria-label={`Seinvlag ${letter}`}
      style={{ display: 'block' }}
    >
      <defs>
        <clipPath id="zwaluw">
          <path d={ZWALUW} />
        </clipPath>
      </defs>
      {inhoud(letter)}
      {letter === 'A' || letter === 'B' ? (
        <path d={ZWALUW} fill="none" stroke="#d9e0e8" strokeWidth={2} />
      ) : (
        <rect width={S} height={S} fill="none" stroke="#d9e0e8" strokeWidth={2} />
      )}
    </svg>
  )
}
