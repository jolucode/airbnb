import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    guests: searchParams.get('guests') || '',
    rooms: searchParams.get('rooms') || ''
  });

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const location = searchParams.get('location') || '';
        const guests = searchParams.get('guests') || '';
        const rooms = searchParams.get('rooms') || '';

        setFilters({ location, guests, rooms });

        const params = new URLSearchParams();
        if (location) params.append('location', location);
        if (guests) params.append('guests', guests);
        if (rooms) params.append('rooms', rooms);

        const res = await axios.get(`/api/properties?${params.toString()}`);
        setProperties(res.data);
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [searchParams]);

  const clearFilters = () => {
    setFilters({ location: '', guests: '', rooms: '' });
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
  };

  const hasActiveFilters = filters.location || filters.guests || filters.rooms;

  if (loading) {
    return (
      <div className="px-4 md:px-12 pt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-square bg-gray-200 rounded-xl" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 md:px-12 pt-24">
      {hasActiveFilters && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">Filtros aplicados:</span>
            {filters.location && (
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                📍 {filters.location}
              </span>
            )}
            {filters.guests && (
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                👥 {filters.guests} huéspedes
              </span>
            )}
            {filters.rooms && (
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                🏠 {filters.rooms} cuartos
              </span>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="text-airbnb-pink font-semibold hover:underline text-sm"
          >
            Limpiar filtros
          </button>
        </div>
      )}
      
      {properties.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold mb-2">No se encontraron departamentos</h3>
          <p className="text-airbnb-gray">Intenta ajustar los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
