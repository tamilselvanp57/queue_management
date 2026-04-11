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

export const INDIAN_REGIONS = [
  { id: 'north', name: 'North India', states: ['Delhi', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Uttarakhand', 'Himachal Pradesh', 'Jammu & Kashmir'] },
  { id: 'south', name: 'South India', states: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Telangana'] },
  { id: 'east', name: 'East India', states: ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand'] },
  { id: 'west', name: 'West India', states: ['Maharashtra', 'Gujarat', 'Rajasthan', 'Goa'] },
  { id: 'central', name: 'Central India', states: ['Madhya Pradesh', 'Chhattisgarh'] },
  { id: 'northeast', name: 'Northeast India', states: ['Assam', 'Meghalaya', 'Manipur', 'Tripura', 'Nagaland', 'Mizoram', 'Arunachal Pradesh', 'Sikkim'] }
]

export const MAJOR_CITIES = [
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, region: 'west' },
  { name: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025, region: 'north' },
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, region: 'south' },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, region: 'south' },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, region: 'south' },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, region: 'east' },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, region: 'west' },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, region: 'west' },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, region: 'west' },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, region: 'north' }
]

export const BUSY_STATUS = {
  AVAILABLE: { label: 'Available', color: 'text-green-600', bg: 'bg-green-100' },
  MODERATE: { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  BUSY: { label: 'Busy', color: 'text-red-600', bg: 'bg-red-100' }
}
