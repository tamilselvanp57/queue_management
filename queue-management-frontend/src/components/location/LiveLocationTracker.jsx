import { useEffect, useState } from 'react'
import { Navigation, MapPin } from 'lucide-react'
import { MAJOR_CITIES } from '../../utils/constants'

const LiveLocationTracker = ({ onLocationUpdate }) => {
  const [location, setLocation] = useState(null)
  const [nearestCity, setNearestCity] = useState(null)
  const [tracking, setTracking] = useState(false)

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  }

  const findNearestCity = (lat, lng) => {
    let nearest = null
    let minDistance = Infinity
    
    MAJOR_CITIES.forEach(city => {
      const distance = calculateDistance(lat, lng, city.lat, city.lng)
      if (distance < minDistance) {
        minDistance = distance
        nearest = { ...city, distance: distance.toFixed(1) }
      }
    })
    
    return nearest
  }

  const startTracking = () => {
    if (!navigator.geolocation) return
    
    setTracking(true)
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const loc = { lat: latitude, lng: longitude }
        setLocation(loc)
        
        const nearest = findNearestCity(latitude, longitude)
        setNearestCity(nearest)
        
        if (onLocationUpdate) {
          onLocationUpdate({ ...loc, city: nearest })
        }
      },
      (error) => console.error('Location error:', error),
      { enableHighAccuracy: true, maximumAge: 10000 }
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Navigation className={`w-5 h-5 ${tracking ? 'text-green-600 animate-pulse' : 'text-gray-600'}`} />
          <div>
            <h4 className="font-semibold">Live Location</h4>
            {nearestCity ? (
              <p className="text-sm text-gray-600">
                Near {nearestCity.name}, {nearestCity.state} ({nearestCity.distance} km)
              </p>
            ) : (
              <p className="text-sm text-gray-500">Enable to find nearby places</p>
            )}
          </div>
        </div>
        
        <button
          onClick={startTracking}
          disabled={tracking}
          className={`px-4 py-2 rounded-lg font-semibold ${
            tracking 
              ? 'bg-green-100 text-green-700 cursor-not-allowed' 
              : 'bg-primary text-white hover:bg-blue-600'
          }`}
        >
          {tracking ? 'Tracking...' : 'Enable'}
        </button>
      </div>
    </div>
  )
}

export default LiveLocationTracker
