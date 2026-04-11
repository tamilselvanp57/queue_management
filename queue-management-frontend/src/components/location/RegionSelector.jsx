import { MapPin } from 'lucide-react'
import { INDIAN_REGIONS, MAJOR_CITIES } from '../../utils/constants'

const RegionSelector = ({ selectedRegion, selectedCity, onRegionChange, onCityChange }) => {
  const cities = selectedRegion 
    ? MAJOR_CITIES.filter(c => c.region === selectedRegion)
    : MAJOR_CITIES

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <MapPin className="w-5 h-5 text-primary mr-2" />
        <h3 className="text-lg font-bold">Select Location</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Region</label>
          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="">All Regions</option>
            {INDIAN_REGIONS.map(region => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">City</label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city.name} value={city.name}>
                {city.name}, {city.state}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default RegionSelector
