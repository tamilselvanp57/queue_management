import prisma from '../config/prisma.js'

export const getPlaces = async (req, res) => {
  try {
    const { category, region, city, latitude, longitude, maxDistance } = req.query

    let filters = {}

    if (category) filters.category = category
    if (region) filters.region = region
    if (city) filters.city = city

    let places = await prisma.place.findMany({
      where: filters
    })

    // 🔹 Optional: Basic distance filtering (manual)
    if (latitude && longitude) {
      const userLat = parseFloat(latitude)
      const userLng = parseFloat(longitude)
      const maxDist = maxDistance ? parseInt(maxDistance) : 10 // km

      places = places.filter(place => {
        const dist = calculateDistance(
          userLat,
          userLng,
          place.latitude,
          place.longitude
        )
        return dist <= maxDist
      })
    }

    res.json(places)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

// 🔹 Haversine Formula (distance in km)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const getPlaceById = async (req, res) => {
  try {
    const place = await prisma.place.findUnique({
      where: { id: req.params.id }
    })

    if (!place) {
      return res.status(404).json({ message: 'Place not found' })
    }

    res.json(place)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}