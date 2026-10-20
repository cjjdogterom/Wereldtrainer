import { useEffect, useRef, useState } from 'react'

// Toont een zelfstandige pagina uit public/ zonder eigen scrollbalk: de iframe
// groeit mee met de inhoud, zodat de hele module als één pagina scrolt.
export default function InbedPagina({ src, titel, minHoogte = 640 }: { src: string; titel: string; minHoogte?: number }) {
  const ref = useRef<HTMLIFrameElement>(null)
  const [hoogte, setHoogte] = useState(minHoogte)

  useEffect(() => {
    const frame = ref.current
    if (!frame) return
    let waarnemer: ResizeObserver | null = null

    const meet = () => {
      const body = frame.contentDocument?.body
      if (!body) return
      setHoogte(Math.max(minHoogte, Math.ceil(body.getBoundingClientRect().height)))
    }
    const opLaden = () => {
      const body = frame.contentDocument?.body
      if (body) body.style.minHeight = '0'
      meet()
      // De observer moet uit het venster van de iframe komen: een observer uit
      // het hoofdvenster ziet geen elementen in een ander document.
      const Waarnemer = (frame.contentWindow as (Window & { ResizeObserver?: typeof ResizeObserver }) | null)?.ResizeObserver
      if (body && Waarnemer) {
        waarnemer?.disconnect()
        waarnemer = new Waarnemer(meet)
        waarnemer.observe(body)
      }
    }

    frame.addEventListener('load', opLaden)
    if (frame.contentDocument?.readyState === 'complete') opLaden()
    // Vangnet voor situaties waarin de observer niet afgaat (bijv. een tabblad
    // dat net weer zichtbaar wordt): meten is goedkoop.
    const klok = window.setInterval(meet, 400)
    return () => {
      frame.removeEventListener('load', opLaden)
      waarnemer?.disconnect()
      window.clearInterval(klok)
    }
  }, [src, minHoogte])

  return (
    <iframe
      ref={ref}
      src={src}
      title={titel}
      style={{ width: '100%', height: hoogte, border: 0, display: 'block' }}
    />
  )
}
