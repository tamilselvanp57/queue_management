import User from '../models/User.js'
import Place from '../models/Place.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = 'user',
      businessType,
      place
    } = req.body

    let placeId
    if (role === 'admin') {
      if (!businessType || !['hotels', 'banks', 'hospitals'].includes(businessType)) {
        return res.status(400).json({ message: 'Valid business type is required for admin registration' })
      }

      if (!place?.name || !place?.region || !place?.city || !place?.state || !place?.address || !place?.phone) {
        return res.status(400).json({ message: 'Complete place details are required for admin registration' })
      }

      const latitude = parseFloat(place?.latitude)
      const longitude = parseFloat(place?.longitude)
      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return res.status(400).json({ message: 'Valid latitude and longitude are required' })
      }

      const createdPlace = await Place.create({
        name: place.name,
        category: businessType,
        region: place.region,
        city: place.city,
        state: place.state,
        address: place.address,
        phone: place.phone,
        description: place.description || '',
        hours: place.hours || '9:00 AM - 10:00 PM',
        location: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      })
      placeId = createdPlace._id
    }

    const user = new User({ name, email, phone, password, role, businessType, placeId })
    await user.save()
    const token = jwt.sign(
      { id: user._id, role: user.role, placeId: user.placeId, businessType: user.businessType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessType: user.businessType,
        placeId: user.placeId
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body
    const user = await User.findOne({ email }).populate('placeId')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    if (role && user.role !== role) return res.status(403).json({ message: 'Access denied' })
    const resolvedPlaceId = user.placeId?._id || user.placeId
    const token = jwt.sign({ 
      id: user._id, 
      role: user.role, 
      placeId: resolvedPlaceId,
      businessType: user.businessType 
    }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        placeId: user.placeId,
        businessType: user.businessType
      } 
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
