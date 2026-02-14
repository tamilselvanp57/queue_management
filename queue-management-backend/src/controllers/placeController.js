import Place from '../models/Place.js'

export const getPlaces = async (req, res) => {
  try {
    const { category, region, latitude, longitude } = req.query
    let query = { isActive: true }
    if (category) query.category = category
    if (region) query.region = region

    let places
    if (latitude && longitude) {
      places = await Place.find({
        ...query,
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
            $maxDistance: 10000
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
