import { useRef, useState } from 'react'
import { Check, RotateCcw, Volume2 } from 'lucide-react'
import type { Foto } from '../ui/Fotos'
import { BeeldView, BlokView } from './KaartView'
import { RUBRIEK } from './krant'
import type { Beeld, Blok, Eenheid, Kaart } from './types'
import './les.css'

// Kop boven een artikel met meerdere eenheden.
const namen = (u: Eenheid[]) => u.map((x) => x.naam)
const KOPPEN: Record<string, (u: Eenheid[]) => string> = {
  klaverjas: () => 'Wat zegt het reglement?',
  geschiedenis: (u) => `${zonderJaren(u[0].hoofdstuk)}: van ${u[0].naam} tot ${u[u.length - 1].naam}`,
  voetbal: (u) => `Kampioenen van weleer: ${u[0].naam} tot ${u[u.length - 1].naam}`,
  vogels: (u) => `Vogels om te herkennen: ${opsomming(namen(u))}`,
  planten: (u) => `Op pad: ${opsomming(namen(u))}`,
  klussen: (u) => `${u[0].kaarten[0].ondertitel}: ${opsomming([...new Set(u.map((x) => x.kaarten[0].kop.replace(/\?$/, '').toLowerCase()))])}`,
}

const zonderJaren = (t: string) => t.replace(/\s*\(.*\)\s*$/, '')

function opsomming(xs: string[]): string {
  return xs.length < 2 ? (xs[0] ?? '') : `${xs.slice(0, -1).join(', ')} en ${xs[xs.length - 1]}`
}

function FotoFig({ foto, klasse = '' }: { foto: Foto; klasse?: string }) {
  return (
    <figure className={`kr-fig ${klasse}`}>
      <img src={foto.src} alt={foto.bijschrift} loading="lazy" />
      <figcaption>
        {foto.bijschrift}
        <small>
          Foto: {foto.maker} · {foto.licentie}
        </small>
      </figcaption>
    </figure>
  )
}

function ImgFig({ beeld, klasse = '' }: { beeld: Extract<Beeld, { soort: 'img' }>; klasse?: string }) {
  return (
    <figure className={`kr-fig ${beeld.vorm === 'object' ? 'object' : ''} ${klasse}`}>
      <img src={beeld.src} alt={beeld.alt} loading="lazy" />
    </figure>
  )
}

// Haalt de eerste foto uit een kaart als openingsbeeld; de rest blijft in de tekst.
function splitsLead(kaart: Kaart): { lead?: Foto | Extract<Beeld, { soort: 'img' }>; datum?: string; blokken: Blok[] } {
  let lead: Foto | Extract<Beeld, { soort: 'img' }> | undefined
  let datum: string | undefined
  if (kaart.beeld?.soort === 'img') lead = kaart.beeld
  if (kaart.beeld?.soort === 'groot') datum = kaart.beeld.tekst
  if (kaart.beeld?.soort === 'fotos' && kaart.beeld.fotos.length) lead = kaart.beeld.fotos[0]
  const blokken: Blok[] = []
  for (const b of kaart.blokken) {
    if (!lead && b.soort === 'beeld' && b.beeld.soort === 'fotos' && b.beeld.fotos.length) {
      lead = b.beeld.fotos[0]
      const rest = b.beeld.fotos.slice(1)
      if (rest.length) blokken.push({ ...b, beeld: { soort: 'fotos', fotos: rest } })
      continue
    }
    blokken.push(b)
  }
  return { lead, datum, blokken }
}

function Lead({ lead, klasse }: { lead: Foto | Extract<Beeld, { soort: 'img' }>; klasse?: string }) {
  return 'soort' in lead ? <ImgFig beeld={lead} klasse={klasse} /> : <FotoFig foto={lead} klasse={klasse} />
}

// Blokken in krantenstijl: losse foto's als figuur in de kolom.
function Tekst({ blokken }: { blokken: Blok[] }) {
  return (
    <>
      {blokken.map((b, i) => {
        if (b.soort === 'beeld' && b.beeld.soort === 'fotos') return b.beeld.fotos.map((f) => <FotoFig key={f.src} foto={f} />)
        if (b.soort === 'beeld' && b.beeld.soort === 'img') return <ImgFig key={i} beeld={b.beeld} />
        if (b.soort === 'beeld')
          return (
            <figure key={i} className="kr-fig kr-fig-tekening">
              <BeeldView beeld={b.beeld} />
            </figure>
          )
        return <BlokView key={i} blok={b} />
      })}
    </>
  )
}

function Geluid({ src }: { src: string }) {
  const audio = useRef<HTMLAudioElement>(null)
  return (
    <>
      <audio ref={audio} src={src} preload="none" />
      <button type="button" className="kr-geluid" onClick={() => audio.current?.play()}>
        <Volume2 size={15} /> Laat het geluid horen
      </button>
    </>
  )
}

function Kaders({ kaarten }: { kaarten: Kaart[] }) {
  return (
    <>
      {kaarten.map((k, i) => (
        <aside key={i} className="kr-kader">
          <h4>{k.kop.includes(':') ? k.kop.split(':').pop()!.trim() : k.kop}</h4>
          <Tekst blokken={k.blokken} />
        </aside>
      ))}
    </>
  )
}

export default function KrantArtikel({
  m,
  units,
  voorpagina,
  extra,
  gelezen,
  onGelezen,
  zonderAfvinken,
}: {
  m: string
  units: Eenheid[]
  voorpagina?: boolean
  extra?: boolean
  zonderAfvinken?: boolean
  gelezen?: boolean
  onGelezen: (aan: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const rubriek = RUBRIEK[m]?.naam ?? m
  const enkel = units.length === 1
  const eerste = units[0]
  const kop = enkel ? eerste.naam : (KOPPEN[m] ?? ((u: Eenheid[]) => opsomming(namen(u))))(units)
  const hoofdstukken = [...new Set(units.map((u) => u.hoofdstuk))]
  const ingeklapt = gelezen && !open

  return (
    <article className={`kr-art${voorpagina ? ' voorpagina' : ''}${extra ? ' extra' : ''}${gelezen ? ' gelezen' : ''}`}>
      <p className="kr-rubriek">
        {extra && <span className="kr-extra-label">Extra</span>}
        <span>{rubriek}</span>
        {hoofdstukken.length === 1 && <span className="kr-hoofdstuk">{hoofdstukken[0]}</span>}
      </p>
      <h2 className="kr-kop">
        <button type="button" disabled={!gelezen} onClick={() => setOpen(!open)}>
          {kop}
        </button>
      </h2>

      {ingeklapt ? (
        <p className="kr-gelezen-regel">
          <Check size={15} strokeWidth={3} /> Gelezen ·{' '}
          <button type="button" onClick={() => setOpen(true)}>
            lees opnieuw
          </button>
        </p>
      ) : enkel ? (
        <EnkelStuk eenheid={eerste} voorpagina={voorpagina} kop={kop} />
      ) : (
        <div className="kr-tekst kr-reeks">
          {units.map((u) => (
            <Deel key={u.id} eenheid={u} />
          ))}
        </div>
      )}

      {!ingeklapt && !zonderAfvinken && (
        <div className="kr-afvinken">
          <button type="button" className={gelezen ? 'aan' : ''} onClick={() => onGelezen(!gelezen)} aria-pressed={!!gelezen}>
            <span className="kr-vinkje">{gelezen ? <Check size={16} strokeWidth={3} /> : null}</span>
            {gelezen ? 'Gelezen' : 'Ik heb dit gelezen'}
          </button>
          {gelezen && (
            <button type="button" className="kr-terug" onClick={() => onGelezen(false)}>
              <RotateCcw size={14} /> Toch nog niet
            </button>
          )}
        </div>
      )}
    </article>
  )
}

function EnkelStuk({ eenheid, voorpagina, kop }: { eenheid: Eenheid; voorpagina?: boolean; kop: string }) {
  const [k0, ...rest] = eenheid.kaarten
  const { lead, datum, blokken } = splitsLead(k0)
  const introIdx = blokken.findIndex((b) => b.soort === 'regel')
  const regel = introIdx >= 0 && introIdx < 2 ? (blokken[introIdx] as { tekst: string }).tekst : undefined
  const intro = regel === kop ? undefined : regel
  const romp = regel ? blokken.filter((_, i) => i !== introIdx) : blokken
  return (
    <>
      {intro && <p className="kr-intro">{intro}</p>}
      {lead && <Lead lead={lead} klasse={voorpagina ? 'kr-lead' : 'kr-lead klein'} />}
      <div className="kr-tekst">
        {datum && <span className="kr-dateline">{datum}</span>}
        {k0.geluid && <Geluid src={k0.geluid} />}
        <Tekst blokken={romp} />
        <Kaders kaarten={rest} />
      </div>
    </>
  )
}

function Deel({ eenheid }: { eenheid: Eenheid }) {
  const [k0, ...rest] = eenheid.kaarten
  const { lead, datum, blokken } = splitsLead(k0)
  const sub = datum && k0.ondertitel?.startsWith(datum) ? k0.ondertitel.slice(datum.length).replace(/^\s*·\s*/, '') : k0.ondertitel
  return (
    <section className="kr-deel">
      <h3>
        {datum && <span className="kr-dateline">{datum}</span>}
        {k0.kop}
      </h3>
      {sub && sub !== eenheid.hoofdstuk && <p className="kr-deel-sub">{sub}</p>}
      {lead && <Lead lead={lead} klasse="kr-deel-foto" />}
      {k0.geluid && <Geluid src={k0.geluid} />}
      <Tekst blokken={blokken} />
      <Kaders kaarten={rest} />
    </section>
  )
}

// Kop, intro, foto en leestijd voor een teaser op de voorpagina.
export function samenvatting(m: string, units: Eenheid[]): { kop: string; intro: string; foto?: string; minuten: number } {
  const kop = units.length === 1 ? units[0].naam : (KOPPEN[m] ?? ((u: Eenheid[]) => opsomming(namen(u))))(units)
  let foto: string | undefined
  let tekst = ''
  let n = 0
  for (const u of units)
    for (const k of u.kaarten) {
      if (!foto && k.beeld?.soort === 'img') foto = k.beeld.src
      if (!foto && k.beeld?.soort === 'fotos') foto = k.beeld.fotos[0]?.src
      for (const b of k.blokken) {
        if (!foto && b.soort === 'beeld' && b.beeld.soort === 'fotos') foto = b.beeld.fotos[0]?.src
        if (!foto && b.soort === 'beeld' && b.beeld.soort === 'img') foto = b.beeld.src
        if (b.soort === 'tekst' || b.soort === 'regel' || b.soort === 'let') {
          n += b.tekst.split(/\s+/).length
          if (!tekst && b.soort === 'tekst') tekst = b.tekst
        }
      }
    }
  const intro = tekst.length > 220 ? `${tekst.slice(0, 210).replace(/\s+\S*$/, '')} …` : tekst
  return { kop, intro, foto, minuten: Math.max(1, Math.round(n / 220)) }
}
