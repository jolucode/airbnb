import { Star, Info } from 'lucide-react';

const PropertyCard = ({ property, onViewDetails }) => {
  return (
    <div className="group cursor-pointer">
      <div className="flex flex-col gap-2">
        {/* Imagen */}
        <div className="aspect-square w-full overflow-hidden rounded-xl relative">
          <img
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
          {/* Badge de Rating */}
          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Star size={12} fill="currentColor" className="text-airbnb-pink" />
            <span className="text-xs font-semibold">{property.rating}</span>
          </div>
        </div>

        {/* Información */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-base">{property.location}</h3>
          </div>
          <p className="text-airbnb-gray text-sm line-clamp-1">{property.title}</p>
          <p className="text-airbnb-gray text-xs">
            👥 {property.maxGuests} huéspedes • 🏠 {property.rooms} cuartos
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="font-semibold text-lg">${property.price}</span>
            <span className="font-light text-airbnb-gray text-sm">noche</span>
          </div>

          {/* Botón Ver Detalles */}
          <button
            onClick={() => onViewDetails(property)}
            className="mt-2 w-full bg-airbnb-pink/10 hover:bg-airbnb-pink/20 text-airbnb-pink py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Info size={16} />
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
