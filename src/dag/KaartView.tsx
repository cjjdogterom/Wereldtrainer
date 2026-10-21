import { lazy, Suspense, useRef } from 'react'
import { AlertTriangle, Volume2 } from 'lucide-react'
import SeinVlag from '../seinen/Vlag'
import Fotos from '../ui/Fotos'
import { Kaarten } from '../bridge/Cursus'
import { SchemaTekening } from '../elektronica/schemas'
import { Beeld as VtBeeld } from '../vervoer/beelden'
import type { Beeld, Blok, Kaart } from './types'
import '../bridge/bridge.css'
import '../elektronica/elektronica.css'
import '../vervoer/vervoer.css'

const LandKaart = lazy(() => import('./LandKaart'))

export function BeeldView({ beeld }: { beeld: Beeld }) {
  switch (beeld.soort) {
    case 'img':
      return (
        <div className={`lk-beeld ${beeld.vorm ?? 'foto'}`}>
          <img src={beeld.src} alt={beeld.alt} loading="lazy" />
        </div>
      )
    case 'fotos':
      return <Fotos fotos={beeld.fotos} />
    case 'groot':
      return <div className="lk-groot">{beeld.tekst}</div>
    case 'seinvlag':
      return (
        <div className="lk-beeld object">
          <SeinVlag letter={beeld.letter} size={130} />
        </div>
      )
    case 'land':
      return (
        <Suspense fallback={<div className="lk-kaart lk-kaart-laden" />}>
          <LandKaart mapId={beeld.mapId} latlng={beeld.latlng} area={beeld.area} />
        </Suspense>
      )
    case 'hand':
      return (
        <div className="lk-hand">
          <Kaarten {...beeld.hand} />
        </div>
      )
    case 'schema':
      return <SchemaTekening id={beeld.id} />
    case 'vt':
      return <VtBeeld id={beeld.id} />
  }
}

export function BlokView({ blok }: { blok: Blok }) {
  switch (blok.soort) {
    case 'tekst':
      return <p className="lk-tekst">{blok.tekst}</p>
    case 'regel':
      return <p className="lk-regel">{blok.tekst}</p>
    case 'feiten':
      return (
        <dl className="lk-feiten">
          {blok.rijen.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )
    case 'lijst':
      return (
        <ul className="lk-lijst">
          {blok.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )
    case 'beeld':
      return <BeeldView beeld={blok.beeld} />
    case 'let':
      return (
        <p className="lk-let">
          <AlertTriangle size={17} aria-hidden="true" />
          <span>{blok.tekst}</span>
        </p>
      )
    case 'formule':
      return (
        <div className="lk-formule">
          <code>{blok.formule}</code>
          <span>{blok.betekenis}</span>
        </div>
      )
    case 'serie':
      return (
        <div className="lk-serie">
          <div className="br-serie">
            {blok.stappen.map((s, i) => (
              <span className="br-stap" key={i}>
                <span className="br-stap-wie">{s.wie}</span>
                <span className="br-stap-bod">{s.bod}</span>
                {i < blok.stappen.length - 1 && <span className="br-stap-pijl" aria-hidden="true">→</span>}
              </span>
            ))}
          </div>
          <p className="lk-tekst">{blok.uitleg}</p>
        </div>
      )
    case 'tabel':
      return (
        <div className="lk-tabel-wrap">
          <table className="lk-tabel">
            {blok.kop && (
              <thead>
                <tr>
                  <th>{blok.kop[0]}</th>
                  <th>{blok.kop[1]}</th>
                </tr>
              </thead>
            )}
            <tbody>
              {blok.rijen.map(([a, b]) => (
                <tr key={a + b}>
                  <td>{a}</td>
                  <td>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

export default function KaartView({ kaart }: { kaart: Kaart }) {
  const audio = useRef<HTMLAudioElement>(null)
  return (
    <article className="lk">
      <header className="lk-kop">
        <h2>{kaart.kop}</h2>
        {kaart.ondertitel && <p>{kaart.ondertitel}</p>}
      </header>
      {kaart.beeld && <BeeldView beeld={kaart.beeld} />}
      {kaart.geluid && (
        <>
          <audio ref={audio} src={kaart.geluid} preload="none" />
          <button type="button" className="lk-geluid" onClick={() => audio.current?.play()}>
            <Volume2 size={16} /> Laat het geluid horen
          </button>
        </>
      )}
      <div className="lk-blokken">
        {kaart.blokken.map((b, i) => (
          <BlokView key={i} blok={b} />
        ))}
      </div>
    </article>
  )
}
