import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const locations = [
  {
    name: 'Lucknow Circle',
    position: [26.8467, 80.9462],
  },
  {
    name: 'Varanasi Circle',
    position: [25.3176, 82.9739],
  },
  {
    name: 'Gorakhpur Circle',
    position: [26.7606, 83.3732],
  },
  {
    name: 'Patna Circle',
    position: [25.5941, 85.1376],
  },
  {
    name: 'Kanpur Circle',
    position: [26.4499, 80.3319],
  },
]

export default function MapView() {
  return (
    <div className="card">
      <h2 style={{ marginBottom: '1rem' }}>
        Trust Circle Locations
      </h2>

      <MapContainer
        center={[26.5, 82.5]}
        zoom={6}
        style={{
          height: '500px',
          width: '100%',
          borderRadius: '12px',
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((location) => (
          <Marker
            key={location.name}
            position={location.position}
          >
            <Popup>{location.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}