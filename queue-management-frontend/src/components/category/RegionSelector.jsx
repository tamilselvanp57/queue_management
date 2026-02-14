import { MapPin } from 'lucide-react'
import { REGIONS } from '../../utils/constants'

const RegionSelector = ({ selectedRegion, onSelectRegion }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Select Region</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <select
          value={selectedRegion}
          onChange={(e) => onSelectRegion(e.target.value)}
          className="input-field pl-10"
        >
          <option value="">All Regions</option>
          {REGIONS.map((region) => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default RegionSelector
