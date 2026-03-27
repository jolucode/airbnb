import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { X, Star, Shield, Wifi, Coffee, Wind, Car, Users, HomeIcon, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Home = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    guests: searchParams.get('guests') || '',
    rooms: searchParams.get('rooms') || ''
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [bookingStatus, setBookingStatus] = useState(null);

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

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProperty(null);
    setBookingStatus(null);
    document.body.style.overflow = 'auto';
  };

  const calculateTotal = () => {
    if (!selectedProperty) return 0;
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return diffDays * selectedProperty.price;
  };

  const handleBooking = async () => {
    try {
      const bookingData = {
        property: selectedProperty._id,
        guestName: "Huésped Ejemplo",
        guestEmail: "guest@example.com",
        startDate,
        endDate,
        totalPrice: calculateTotal()
      };
      await axios.post('/api/bookings', bookingData);
      setBookingStatus('success');
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (err) {
      setBookingStatus('error');
    }
  };

  const hasActiveFilters = filters.location || filters.guests || filters.rooms;

  if (loading) {
    return (
      <div className="px-4 md:px-12 pt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 animate-pulse">
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
    <div className="px-4 md:px-12 pt-20 pb-12">
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
            <PropertyCard 
              key={property._id} 
              property={property} 
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Modal de Detalles */}
      {showModal && selectedProperty && (
        <div 
          className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header con botón cerrar */}
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold">{selectedProperty.title}</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Galería de Imágenes */}
            <div className="grid grid-cols-2 gap-1 p-4">
              <div className="col-span-2 md:col-span-1 h-48 md:h-64 rounded-xl overflow-hidden">
                <img 
                  src={selectedProperty.images[0]} 
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden md:grid grid-cols-2 gap-1">
                {selectedProperty.images.slice(1, 5).map((img, i) => (
                  <div key={i} className="h-32 rounded-lg overflow-hidden">
                    <img 
                      src={img} 
                      alt={`${selectedProperty.title} ${i + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Información Principal */}
            <div className="px-4 pb-4 space-y-4">
              {/* Rating y Ubicación */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-airbnb-pink/10 px-3 py-1 rounded-full">
                  <Star size={16} fill="currentColor" className="text-airbnb-pink" />
                  <span className="font-semibold">{selectedProperty.rating}</span>
                </div>
                <span className="text-airbnb-gray">{selectedProperty.reviewsCount} evaluaciones</span>
                <span className="text-airbnb-gray">•</span>
                <span className="font-semibold">{selectedProperty.location}</span>
              </div>

              {/* Huéspedes y Habitaciones */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center">
                  <Users size={24} className="text-airbnb-pink mb-2" />
                  <p className="text-2xl font-bold">{selectedProperty.maxGuests}</p>
                  <p className="text-xs text-airbnb-gray">Huéspedes</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center">
                  <HomeIcon size={24} className="text-airbnb-pink mb-2" />
                  <p className="text-2xl font-bold">{selectedProperty.rooms}</p>
                  <p className="text-xs text-airbnb-gray">Cuartos</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center">
                  <Calendar size={24} className="text-airbnb-pink mb-2" />
                  <p className="text-lg font-bold">Disponible</p>
                  <p className="text-xs text-airbnb-gray">Ahora</p>
                </div>
              </div>

              {/* Descripción */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-2">Descripción</h3>
                <p className="text-slate-700 leading-relaxed">{selectedProperty.description}</p>
              </div>

              {/* Precio */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold">${selectedProperty.price}</span>
                    <span className="text-airbnb-gray"> / noche</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-airbnb-gray">
                    <Shield size={16} />
                    <span>Protección AirCover</span>
                  </div>
                </div>

                {/* Selector de Fechas */}
                <div className="border rounded-xl overflow-hidden mb-4">
                  <div className="grid grid-cols-2 border-b">
                    <div className="p-3 border-r">
                      <p className="text-[10px] font-bold uppercase">Llegada</p>
                      <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        className="w-full text-sm outline-none"
                        minDate={new Date()}
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-bold uppercase">Salida</p>
                      <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        className="w-full text-sm outline-none"
                        minDate={startDate}
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50">
                    <p className="text-[10px] font-bold uppercase">Huéspedes</p>
                    <p className="text-sm">{selectedProperty.maxGuests} huéspedes máx.</p>
                  </div>
                </div>

                {/* Botón de Reserva */}
                <button
                  onClick={handleBooking}
                  className="w-full bg-airbnb-pink text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-700 transition-colors"
                >
                  Reservar
                </button>

                {bookingStatus === 'success' && (
                  <p className="text-green-600 text-center mt-3 font-semibold">
                    ¡Reserva enviada con éxito!
                  </p>
                )}
                {bookingStatus === 'error' && (
                  <p className="text-red-600 text-center mt-3 font-semibold">
                    Error al procesar la reserva.
                  </p>
                )}

                {/* Total */}
                <div className="space-y-2 mt-4 pt-4 border-t text-sm">
                  <div className="flex justify-between text-airbnb-gray">
                    <span className="underline">${selectedProperty.price} x {Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)) || 1} noches</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-bold text-lg">
                    <span>Total sin impuestos</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Amenidades */}
              {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg mb-3">Comodidades</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProperty.amenities.map((amenity, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-700">
                        {amenity.includes('WiFi') && <Wifi size={18} className="text-airbnb-pink" />}
                        {amenity.includes('Cocina') && <Coffee size={18} className="text-airbnb-pink" />}
                        {amenity.includes('Aire') && <Wind size={18} className="text-airbnb-pink" />}
                        {amenity.includes('Parking') && <Car size={18} className="text-airbnb-pink" />}
                        {!amenity.includes('WiFi') && !amenity.includes('Cocina') && !amenity.includes('Aire') && !amenity.includes('Parking') && (
                          <div className="w-[18px]" />
                        )}
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
