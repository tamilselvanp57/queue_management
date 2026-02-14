import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../components/common/Header'
import RegionSelector from '../../components/category/RegionSelector'
import SearchBar from '../../components/category/SearchBar'
import PlaceCard from '../../components/category/PlaceCard'
import LocationMap from '../../components/map/LocationMap'
import Loader from '../../components/common/Loader'
import { useGeolocation } from '../../hooks/useGeolocation'
import axios from '../../services/axiosConfig'
import toast from 'react-hot-toast'

const CategoryListPage = () => {
  const { type } = useParams()
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMap, setShowMap] = useState(false)
  const { location } = useGeolocation()

  useEffect(() => {
    fetchPlaces()
  }, [type, selectedRegion, location])

  const fetchPlaces = async () => {
    try {
      setLoading(true)
      const params = { category: type, region: selectedRegion }
      if (location) {
        params.latitude = location.latitude
        params.longitude = location.longitude
      }
      const { data } = await axios.get('/places', { params })
      setPlaces(data)
    } catch (error) {
      toast.error('Failed to load places')
    } finally {
      setLoading(false)
    }
  }

  const filteredPlaces = places.filter(place =>
    place.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 capitalize">{type}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <RegionSelector selectedRegion={selectedRegion} onSelectRegion={setSelectedRegion} />
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search places..." />
        </div>

        <div className="mb-4">
          <button
            onClick={() => setShowMap(!showMap)}
            className="btn-primary"
          >
            {showMap ? 'Show List' : 'Show Map'}
          </button>
        </div>

        {loading ? (
          <div className="py-20"><Loader size="lg" /></div>
        ) : showMap ? (
          <LocationMap
            places={filteredPlaces}
            userLocation={location ? [location.latitude, location.longitude] : null}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        )}

        {!loading && filteredPlaces.length === 0 && (
          <div className="text-center py-20 text-gray-500">No places found</div>
        )}
      </main>
    </div>
  )
}

export default CategoryListPage
