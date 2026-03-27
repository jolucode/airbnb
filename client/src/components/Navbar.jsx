import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, Globe } from 'lucide-react';

const Navbar = () => {
  const [search, setSearch] = useState({ location: '', guests: '', rooms: '' });
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.location) params.append('location', search.location);
    if (search.guests) params.append('guests', search.guests);
    if (search.rooms) params.append('rooms', search.rooms);
    navigate(`/?${params.toString()}`);
  };

  return (
    <nav className="fixed top-0 w-full bg-white border-b z-50 px-4 md:px-12 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-1">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="#FF385C" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.392 3.415-6.425 3.61l-.25.019-.234.011c-3.48 0-6.358-2.416-6.358-6.478 0-1.541.332-2.809 1.121-4.409l.056-.112.128-.242C5.3 16.591 9.46 7.88 11.414 4.053l.533-1.025C13.237 1.963 14.692 1 16.7 1z"/>
        </svg>
        <span className="text-airbnb-pink font-bold text-xl hidden md:block">airbnb</span>
      </Link>

      <div className="hidden md:flex items-center border rounded-full py-1 px-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer gap-2">
        <input 
          type="text" 
          placeholder="¿Dónde vas?" 
          className="text-xs font-semibold px-4 outline-none w-28"
          value={search.location}
          onChange={(e) => setSearch({...search, location: e.target.value})}
        />
        <input 
          type="number" 
          placeholder="Huéspedes" 
          className="text-xs font-semibold px-4 border-l outline-none w-24"
          value={search.guests}
          onChange={(e) => setSearch({...search, guests: e.target.value})}
        />
        <input 
          type="number" 
          placeholder="Cuartos" 
          className="text-xs font-semibold px-4 border-l outline-none w-20"
          value={search.rooms}
          onChange={(e) => setSearch({...search, rooms: e.target.value})}
        />
        <div 
          onClick={handleSearch}
          className="bg-airbnb-pink p-2 rounded-full text-white"
        >
          <Search size={16} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/admin" className="text-sm font-semibold hover:bg-gray-100 py-2 px-4 rounded-full transition-colors hidden md:block">
          Modo Admin
        </Link>
        <Globe size={18} className="cursor-pointer hidden md:block" />
        <div className="flex items-center gap-3 border p-2 rounded-full hover:shadow-md transition-shadow cursor-pointer">
          <Menu size={18} />
          <div className="bg-gray-500 text-white rounded-full p-1">
            <User size={18} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
