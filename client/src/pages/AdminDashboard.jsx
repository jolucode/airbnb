import { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Home as HomeIcon, Calendar, DollarSign, LogOut, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalBookings: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const config = { headers: { 'x-auth-token': token } };
        const resBookings = await axios.get('/api/bookings', config);
        setBookings(resBookings.data);

        const total = resBookings.data.reduce((acc, curr) => acc + curr.totalPrice, 0);
        setStats({ totalRevenue: total, totalBookings: resBookings.data.length });
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <LayoutDashboard size={32} className="text-airbnb-pink" />
          Panel de Administración
        </h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-airbnb-gray hover:text-red-500 font-semibold transition-colors">
          <LogOut size={20} /> Salir
        </button>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/properties')}
          className="flex items-center gap-2 bg-airbnb-pink text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-700 transition-colors shadow-lg"
        >
          <HomeIcon size={20} />
          Gestionar Departamentos
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-full text-green-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-airbnb-gray text-sm">Ingresos Totales</p>
            <p className="text-2xl font-bold">${stats.totalRevenue}</p>
          </div>
        </div>
        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-airbnb-pink/10 p-4 rounded-full text-airbnb-pink">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-airbnb-gray text-sm">Reservas Totales</p>
            <p className="text-2xl font-bold">{stats.totalBookings}</p>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Reservas Recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-airbnb-gray text-xs uppercase font-bold">
                <th className="p-4">Propiedad</th>
                <th className="p-4">Huésped</th>
                <th className="p-4">Entrada</th>
                <th className="p-4">Salida</th>
                <th className="p-4">Total</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="p-4 font-semibold">{booking.property?.title}</td>
                  <td className="p-4">{booking.guestName}</td>
                  <td className="p-4">{new Date(booking.startDate).toLocaleDateString()}</td>
                  <td className="p-4">{new Date(booking.endDate).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-slate-800">${booking.totalPrice}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
