import { useEffect, useState } from 'react'
import type { Foto } from '../ui/Fotos'
import { SchemaTekening } from '../elektronica/schemas'
import { Beeld as VtBeeld } from '../vervoer/beelden'
import type { SchemaId } from '../elektronica/types'
import type { BeeldId } from '../vervoer/types'
import { fotoVan, laadKrantFotos, laadLesFotos, leestijd, type Stuk } from './stukken'
import '../elektronica/elektronica.css'
import '../vervoer/vervoer.css'

export function useKrantFotos() {
  const [fotos, setFotos] = useState<Record<string, Foto[]>>({})
  useEffect(() => {
    let actief = true
    laadKrantFotos().then((f) => actief && setFotos(f))
    return () => {
      actief = false
    }
  }, [])
  return fotos
}

function useLesFotos(rubriek: string, nodig: boolean) {
  const [fotos, setFotos] = useState<Record<string, Foto[]>>({})
  useEffect(() => {
    if (!nodig) return
    let actief = true
    laadLesFotos(rubriek).then((f) => actief && setFotos(f))
    return () => {
      actief = false
    }
  }, [rubriek, nodig])
  return fotos
}

export function Figuur({ foto, lead }: { foto: Foto; lead?: boolean }) {
  return (
    <figure className={`lz-fig${lead ? ' lead' : ''}`}>
      <img src={foto.src} alt={foto.bijschrift} loading={lead ? 'eager' : 'lazy'} />
      <figcaption>
        {foto.bijschrift}
        <small>
          Foto: {foto.maker} · {foto.licentie}
        </small>
      </figcaption>
    </figure>
  )
}

// Een lang krantenartikel in één rustige leeskolom; foto's vullen op de
// telefoon de hele breedte van het scherm.
export default function StukView({ stuk, rubriek, rubriekNaam }: { stuk: Stuk; rubriek: string; rubriekNaam: string }) {
  const fotos = useKrantFotos()
  const lesFotos = useLesFotos(
    rubriek,
    stuk.secties.some((s) => s.lesFoto),
  )
  const lead = fotoVan(stuk, 0, fotos)
  let eersteAlinea = true

  return (
    <article className="lz-stuk">
      <header className="lz-kop">
        <p className="lz-rubriek">
          <span>{rubriekNaam}</span>
          {stuk.hoofdstuk && <span className="lz-hoofdstuk">{stuk.hoofdstuk}</span>}
        </p>
        <h1>{stuk.kop}</h1>
        <p className="lz-intro">{stuk.intro}</p>
        <p className="lz-meta">± {leestijd(stuk)} minuten lezen</p>
      </header>

      {lead && <Figuur foto={lead} lead />}

      <div className="lz-tekst">
        {stuk.secties.map((s, i) => {
          const foto = s.foto !== undefined && s.foto > 0 ? fotoVan(stuk, s.foto, fotos) : undefined
          const lesFoto = s.lesFoto ? lesFotos[s.lesFoto]?.[0] : undefined
          return (
            <section key={i} className="lz-sectie">
              {s.tussenkop && <h2>{s.tussenkop}</h2>}
              {s.alineas.map((a, j) => {
                const eerste = eersteAlinea
                eersteAlinea = false
                return (
                  <p key={j} className={eerste ? 'lz-eerste' : undefined}>
                    {a}
                  </p>
                )
              })}
              {s.citaat && <blockquote className="lz-citaat">{s.citaat}</blockquote>}
              {foto && <Figuur foto={foto} />}
              {lesFoto && <Figuur foto={lesFoto} />}
              {s.schema && (
                <figure className="lz-tekening">
                  <SchemaTekening id={s.schema as SchemaId} />
                </figure>
              )}
              {s.vt && (
                <figure className="lz-tekening">
                  <VtBeeld id={s.vt as BeeldId} />
                </figure>
              )}
              {s.kader && (
                <aside className="lz-kader">
                  <h3>{s.kader.titel}</h3>
                  <ul>
                    {s.kader.punten.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </aside>
              )}
            </section>
          )
        })}
      </div>
    </article>
  )
}
