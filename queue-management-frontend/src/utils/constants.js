export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export const CATEGORIES = [
  {
    id: 'hotels',
    name: 'Hotels & Restaurants',
    icon: '🏨',
    color: 'bg-blue-500',
    description: 'Book tables at top restaurants'
  },
  {
    id: 'hospitals',
    name: 'Hospitals',
    icon: '🏥',
    color: 'bg-red-500',
    description: 'Skip hospital waiting rooms'
  },
  {
    id: 'banks',
    name: 'Banks',
    icon: '🏦',
    color: 'bg-green-500',
    description: 'Fast-track banking services'
  }
]

export const REGIONS = [
  'Downtown',
  'Uptown',
  'East Side',
  'West Side',
  'Suburbs',
  'City Center'
]

export const BUSY_STATUS = {
  AVAILABLE: { label: 'Available', color: 'text-green-600', bg: 'bg-green-100' },
  MODERATE: { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  BUSY: { label: 'Busy', color: 'text-red-600', bg: 'bg-red-100' }
}
