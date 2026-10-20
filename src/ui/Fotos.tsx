import { useState } from 'react'
import './fotos.css'

export type Foto = { src: string; bijschrift: string; maker: string; licentie: string; bron: string }

// Eén of meer echte foto's met bijschrift en bronvermelding.
export default function Fotos({ fotos }: { fotos: Foto[] | undefined }) {
  const [groot, setGroot] = useState<Foto | null>(null)
  if (!fotos || fotos.length === 0) return null
  return (
    <>
      <div className={`ft-rij ft-${Math.min(fotos.length, 3)}`}>
        {fotos.map((f) => (
          <figure key={f.src} className="ft-foto">
            <button type="button" onClick={() => setGroot(f)} aria-label={`Vergroot: ${f.bijschrift}`}>
              <img src={f.src} alt={f.bijschrift} loading="lazy" />
            </button>
            <figcaption>{f.bijschrift}</figcaption>
          </figure>
        ))}
      </div>
      {groot && (
        <div className="ft-scherm" role="dialog" aria-modal="true" aria-label={groot.bijschrift} onClick={() => setGroot(null)}>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={groot.src} alt={groot.bijschrift} />
            <figcaption>
              <span>{groot.bijschrift}</span>
              <small>
                Foto: {groot.maker} · {groot.licentie} ·{' '}
                <a href={groot.bron} target="_blank" rel="noopener noreferrer">
                  bron
                </a>
              </small>
            </figcaption>
            <button type="button" className="ft-sluit" onClick={() => setGroot(null)}>
              Sluiten
            </button>
          </figure>
        </div>
      )}
    </>
  )
}
