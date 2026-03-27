import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star, Shield, Wifi, Coffee, Wind, Car } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [bookingStatus, setBookingStatus] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/api/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProperty();
  }, [id]);

  const calculateTotal = () => {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return diffDays * property.price;
  };

  const handleBooking = async () => {
    try {
      const bookingData = {
        property: property._id,
        guestName: "Huésped Ejemplo",
        guestEmail: "guest@example.com",
        startDate,
        endDate,
        totalPrice: calculateTotal()
      };
      await axios.post('/api/bookings', bookingData);
      setBookingStatus('success');
    } catch (err) {
      setBookingStatus('error');
    }
  };

  if (!property) return <div className="p-12 text-center">Cargando...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12">
      <h1 className="text-2xl font-semibold mb-4">{property.title}</h1>
      
      <div className="flex items-center gap-4 text-sm font-semibold mb-6 underline">
        <div className="flex items-center gap-1">
          <Star size={14} fill="currentColor" />
          <span>{property.rating}</span>
        </div>
        <span>{property.reviewsCount} evaluaciones</span>
        <span>{property.location}</span>
      </div>

      {/* Galería Estilo Airbnb */}
      <div className="grid grid-cols-2 gap-2 h-[450px] rounded-2xl overflow-hidden mb-8">
        <div className="col-span-1 h-full">
          <img src={property.images[0]} className="w-full h-full object-cover" />
        </div>
        <div className="col-span-1 grid grid-cols-2 gap-2">
          {property.images.slice(1, 5).map((img, i) => (
            <img key={i} src={img} className="w-full h-full object-cover" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <div className="flex justify-between items-center border-b pb-6">
            <div>
              <h2 className="text-xl font-semibold">Anfitrión: Propiedad de Lujo</h2>
              <p className="text-airbnb-gray">{property.maxGuests} huéspedes · 2 dormitorios · 2 baños</p>
            </div>
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold">A</div>
          </div>

          <div className="py-6 border-b flex flex-col gap-6">
            <div className="flex gap-4">
              <Shield size={24} />
              <div>
                <p className="font-semibold">Protección AirCover</p>
                <p className="text-sm text-airbnb-gray">Tu reserva está protegida ante cancelaciones del anfitrión e imprevistos.</p>
              </div>
            </div>
          </div>

          <div className="py-8">
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>

          <div className="py-8 border-t">
            <h3 className="text-xl font-semibold mb-6">Lo que este lugar ofrece</h3>
            <div className="grid grid-cols-2 gap-4">
              {property.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-4 text-slate-700">
                  {amenity.includes('WiFi') && <Wifi size={20} />}
                  {amenity.includes('Cocina') && <Coffee size={20} />}
                  {amenity.includes('Aire') && <Wind size={20} />}
                  {amenity.includes('Parking') && <Car size={20} />}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card de Reserva */}
        <div className="md:col-span-1">
          <div className="sticky top-28 border rounded-2xl p-6 shadow-xl bg-white">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold">${property.price}</span>
                <span className="text-airbnb-gray">noche</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Star size={14} fill="currentColor" />
                <span>{property.rating}</span>
              </div>
            </div>

            <div className="border rounded-xl overflow-hidden mb-4">
              <div className="grid grid-cols-2 border-b">
                <div className="p-3 border-r">
                  <p className="text-[10px] font-bold uppercase">Llegada</p>
                  <DatePicker 
                    selected={startDate} 
                    onChange={date => setStartDate(date)}
                    className="w-full text-sm outline-none"
                  />
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-bold uppercase">Salida</p>
                  <DatePicker 
                    selected={endDate} 
                    onChange={date => setEndDate(date)}
                    className="w-full text-sm outline-none"
                  />
                </div>
              </div>
              <div className="p-3">
                <p className="text-[10px] font-bold uppercase">Huéspedes</p>
                <p className="text-sm">1 huésped</p>
              </div>
            </div>

            <button 
              onClick={handleBooking}
              className="airbnb-btn w-full mb-4"
            >
              Reservar
            </button>

            {bookingStatus === 'success' && <p className="text-green-600 text-center mb-4 font-semibold">¡Reserva enviada con éxito!</p>}
            {bookingStatus === 'error' && <p className="text-red-600 text-center mb-4 font-semibold">Error al procesar la reserva.</p>}

            <div className="space-y-4">
              <div className="flex justify-between text-airbnb-gray">
                <span className="underline">${property.price} x {Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)) || 1} noches</span>
                <span>${calculateTotal()}</span>
              </div>
              <div className="flex justify-between pt-4 border-t font-bold text-lg">
                <span>Total sin impuestos</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
