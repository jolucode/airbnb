import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  return (
    <Link to={`/property/${property._id}`} className="group cursor-pointer">
      <div className="flex flex-col gap-2">
        <div className="aspect-square w-full overflow-hidden rounded-xl">
          <img
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </div>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-base">{property.location}</h3>
          <div className="flex items-center gap-1">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-light">{property.rating}</span>
          </div>
        </div>
        <p className="text-airbnb-gray text-sm line-clamp-1">{property.title}</p>
        <p className="text-airbnb-gray text-sm">Disponible ahora</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="font-semibold">${property.price}</span>
          <span className="font-light text-airbnb-gray text-sm">noche</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
