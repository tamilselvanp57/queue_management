import prisma from '../config/prisma.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

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

    let placeId = null

    // 🔹 Admin: Create Place
    if (role === 'admin') {
      if (!businessType || !['hotels', 'banks', 'hospitals'].includes(businessType)) {
        return res.status(400).json({ message: 'Valid business type is required for admin registration' })
      }

      if (!place?.name || !place?.region || !place?.city || !place?.state || !place?.address || !place?.phone) {
        return res.status(400).json({ message: 'Complete place details are required for admin registration' })
      }

      const latitude = parseFloat(place.latitude)
      const longitude = parseFloat(place.longitude)

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: 'Valid latitude and longitude are required' })
      }

      const createdPlace = await prisma.place.create({
        data: {
          name: place.name,
          category: businessType,
          region: place.region,
          city: place.city,
          state: place.state,
          address: place.address,
          phone: place.phone,
          description: place.description || '',
          hours: place.hours || '9:00 AM - 10:00 PM',
          latitude,
          longitude
        }
      })

      placeId = createdPlace.id
    }

    // 🔹 Hash Password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 🔹 Create User
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        businessType,
        placeId
      }
    })

    // 🔹 JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        placeId: user.placeId,
        businessType: user.businessType
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessType: user.businessType,
        placeId: user.placeId
      }
    })

  } catch (error) {
    console.error(error)

    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(400).json({ message: 'User with this email already exists' })
    }

    res.status(500).json({ message: error.message || 'Registration failed' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
      include: { place: true }
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    if (role && user.role !== role) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        placeId: user.placeId,
        businessType: user.businessType
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        placeId: user.placeId,
        businessType: user.businessType
      }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}