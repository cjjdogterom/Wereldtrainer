import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import geoUrl from 'world-atlas/countries-50m.json?url'

// Inzoomen op basis van de oppervlakte: grote landen ver weg, kleine dichtbij.
function zoomVoor(area: number): number {
  return Math.min(26, Math.max(1.4, 3600 / Math.sqrt(Math.max(area, 1))))
}

export default function LandKaart({ mapId, latlng, area }: { mapId: string; latlng: [number, number]; area: number }) {
  const zoom = zoomVoor(area)
  const klein = area < 15000
  return (
    <div className="lk-kaart">
      <ComposableMap projectionConfig={{ scale: 150 }} width={800} height={500} style={{ width: '100%', height: 'auto' }}>
        <ZoomableGroup center={[latlng[1], latlng[0]]} zoom={zoom} minZoom={zoom} maxZoom={zoom} filterZoomEvent={() => false}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const dit = String(geo.id ?? geo.properties?.name ?? '') === mapId
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={dit ? '#d9531e' : '#e6dfd0'}
                    stroke="#ffffff"
                    strokeWidth={0.6 / zoom}
                    style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }}
                  />
                )
              })
            }
          </Geographies>
          {klein && (
            <Marker coordinates={[latlng[1], latlng[0]]}>
              <circle r={9 / zoom} fill="none" stroke="#d9531e" strokeWidth={2.5 / zoom} />
            </Marker>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}
