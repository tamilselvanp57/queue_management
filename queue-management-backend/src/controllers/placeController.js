import Place from '../models/Place.js'

export const getPlaces = async (req, res) => {
  try {
    const { category, region, city, latitude, longitude, maxDistance } = req.query
    let query = { isActive: true }
    if (category) query.category = category
    if (region) query.region = region
    if (city) query.city = city

    let places
    if (latitude && longitude) {
      const distance = maxDistance ? parseInt(maxDistance) * 1000 : 10000
      places = await Place.find({
        ...query,
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
            $maxDistance: distance
          }
        }
      })
    } else {
      places = await Place.find(query)
    }
    res.json(places)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id)
    if (!place) return res.status(404).json({ message: 'Place not found' })
    res.json(place)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
