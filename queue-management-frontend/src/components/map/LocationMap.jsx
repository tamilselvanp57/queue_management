import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const LocationMap = ({ places, userLocation }) => {
  const navigate = useNavigate()

  return (
    <MapContainer
      center={userLocation || [12.9716, 77.5946]}
      zoom={13}
      style={{ height: '500px', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      
      {userLocation && (
        <Marker position={userLocation}>
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {places.map((place) => (
        <Marker
          key={place._id}
          position={[place.location.coordinates[1], place.location.coordinates[0]]}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold">{place.name}</h3>
              <p className="text-sm text-gray-600">{place.address}</p>
              <p className="text-sm">Queue: {place.queueLength} people</p>
              <button
                onClick={() => navigate(`/place/${place._id}`)}
                className="mt-2 bg-primary text-white px-4 py-1 rounded text-sm"
              >
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default LocationMap
