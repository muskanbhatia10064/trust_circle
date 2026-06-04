import { useEffect, useRef, useState } from 'react'

const LOCATIONS = [
  { name: 'Mahila Bachat Mandal', city: 'Lucknow', position: [26.8467, 80.9462], members: 4, contribution: '₹500/week', status: 'active', color: '#1D9E75' },
  { name: 'Kisan Sahayata Group', city: 'Gorakhpur', position: [26.7606, 83.3732], members: 3, contribution: '₹1,000/month', status: 'active', color: '#0E7A5A' },
  { name: 'Varanasi Vyapar Circle', city: 'Varanasi', position: [25.3176, 82.9739], members: 3, contribution: '₹5,000/month', status: 'pending', color: '#d97706' },
  { name: 'Member — Patna', city: 'Patna', position: [25.5941, 85.1376], members: null, contribution: null, status: 'member', color: '#6366f1' },
  { name: 'Member — Kanpur', city: 'Kanpur', position: [26.4499, 80.3319], members: null, contribution: null, status: 'member', color: '#6366f1' },
]

const LAYERS = {
  street:    { label: '🗺 Map',       url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',                                                    attr: '© CARTO © OSM' },
  satellite: { label: '🛰 Satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',                               attr: '© Esri' },
  terrain:   { label: '⛰ Terrain',   url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',                                                                            attr: '© OpenTopoMap' },
}

export default function MapView() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const tileRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState('street')

  useEffect(() => {
    if (!document.getElementById('lf-css')) {
      const l = document.createElement('link')
      l.id = 'lf-css'; l.rel = 'stylesheet'
      l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(l)
    }
    if (window.L) { setReady(true); return }
    const s = document.createElement('script')
    s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    s.onload = () => setReady(true)
    document.head.appendChild(s)
  }, [])

  useEffect(() => {
    if (!ready || !mapRef.current || mapInstanceRef.current) return
    const L = window.L
    const map = L.map(mapRef.current, { center: [26.2, 82.5], zoom: 7, zoomControl: false })
    mapInstanceRef.current = map
    tileRef.current = L.tileLayer(LAYERS.street.url, { attribution: LAYERS.street.attr, maxZoom: 19 }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.control.scale({ position: 'bottomleft', metric: true, imperial: false }).addTo(map)

    LOCATIONS.forEach(loc => {
      const isCircle = loc.members !== null
      const icon = L.divIcon({
        html: `<div style="position:relative;width:38px;height:46px;">
          <svg viewBox="0 0 38 46" xmlns="http://www.w3.org/2000/svg" width="38" height="46">
            <path d="M19 0C8.51 0 0 8.51 0 19c0 14.19 19 27 19 27s19-12.81 19-27C38 8.51 29.49 0 19 0z" fill="${loc.color}" stroke="white" stroke-width="2.5"/>
            ${isCircle ? `<text x="19" y="23" text-anchor="middle" fill="white" font-size="13" font-weight="700" font-family="system-ui">${loc.members}</text>` : `<circle cx="19" cy="19" r="5" fill="white" opacity="0.9"/>`}
          </svg>
          ${isCircle ? `<div style="position:absolute;top:-5px;right:-5px;width:16px;height:16px;background:white;border:2px solid ${loc.color};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:${loc.color};">${loc.status === 'active' ? '✓' : '~'}</div>` : ''}
        </div>`,
        className: '', iconSize: [38, 46], iconAnchor: [19, 46], popupAnchor: [0, -48],
      })
      const popup = isCircle
        ? `<div style="font-family:system-ui;min-width:185px;padding:4px 0;">
            <div style="font-weight:700;font-size:13px;color:${loc.color};margin-bottom:5px;">${loc.name}</div>
            <div style="font-size:12px;color:#6B7A8D;margin-bottom:8px;">📍 ${loc.city}</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
              <span style="background:#F7F9FC;border-radius:6px;padding:3px 8px;font-size:11px;">👥 ${loc.members} members</span>
              <span style="background:#F7F9FC;border-radius:6px;padding:3px 8px;font-size:11px;">💰 ${loc.contribution}</span>
            </div>
            <span style="background:${loc.status === 'active' ? '#E8F5F1' : '#FEF9C3'};color:${loc.status === 'active' ? '#0E7A5A' : '#92400E'};border-radius:100px;padding:3px 10px;font-size:10px;font-weight:700;">${loc.status.toUpperCase()}</span>
          </div>`
        : `<div style="font-family:system-ui;padding:4px 0;"><div style="font-weight:700;font-size:13px;color:#6366f1;">📍 ${loc.city}</div><div style="font-size:11px;color:#6B7A8D;margin-top:4px;">Circle member location</div></div>`
      L.marker(loc.position, { icon }).addTo(map).bindPopup(popup, { maxWidth: 230 })
    })

    const bounds = L.latLngBounds(LOCATIONS.map(l => l.position))
    map.fitBounds(bounds, { padding: [50, 50] })
  }, [ready])

  const switchLayer = (key) => {
    const map = mapInstanceRef.current; const L = window.L
    if (!map || !L) return
    if (tileRef.current) map.removeLayer(tileRef.current)
    tileRef.current = L.tileLayer(LAYERS[key].url, { attribution: LAYERS[key].attr, maxZoom: 19 }).addTo(map)
    setActive(key)
  }

  return (
    <div style={{ position: 'relative' }}>
      <div ref={mapRef} style={{ height: '480px', width: '100%', background: '#E8F5F1' }} />

      {/* Layer toggle */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 1000, display: 'flex', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.18)' }}>
        {Object.entries(LAYERS).map(([key, { label }]) => (
          <button key={key} onClick={() => switchLayer(key)} style={{ background: active === key ? '#1D9E75' : 'white', color: active === key ? 'white' : '#1A2332', border: 'none', borderRight: '1px solid #eee', padding: '7px 13px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: '36px', left: '12px', zIndex: 1000, background: 'rgba(255,255,255,0.95)', borderRadius: '10px', padding: '10px 14px', boxShadow: '0 2px 10px rgba(0,0,0,0.12)', fontSize: '11px' }}>
        <div style={{ fontWeight: 700, color: '#1A2332', marginBottom: '6px' }}>Legend</div>
        {[{ color: '#1D9E75', label: 'Active Circle' }, { color: '#d97706', label: 'Pending Circle' }, { color: '#6366f1', label: 'Member Location' }].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ color: '#6B7A8D' }}>{label}</span>
          </div>
        ))}
      </div>

      {!ready && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F9FC', color: '#6B7A8D', fontSize: '14px' }}>
          Loading map…
        </div>
      )}
    </div>
  )
}
