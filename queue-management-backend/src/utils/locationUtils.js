export const calculateDistance = (coords1, coords2) => {
  const [lon1, lat1] = coords1
  const [lon2, lat2] = coords2
  
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

const toRad = (degrees) => degrees * (Math.PI / 180)

export const calculateTravelTime = (distanceKm) => {
  const avgSpeed = 30
  const timeMinutes = Math.ceil((distanceKm / avgSpeed) * 60)
  return timeMinutes + 5
}

export const getETA = (travelTimeMinutes) => {
  const eta = new Date(Date.now() + travelTimeMinutes * 60000)
  return eta.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
