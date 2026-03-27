import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Trash2, X, Upload, Home } from 'lucide-react';

const AdminProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    maxGuests: '',
    rooms: '',
    amenities: '',
    rating: '4.5'
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    checkAuth();
    fetchProperties();
  }, []);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showModal]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
    }
  };

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/properties', {
        headers: { 'x-auth-token': token }
      });
      setProperties(res.data);
    } catch (err) {
      console.error('Error fetching properties:', err);
      alert('Error al cargar departamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const openModal = (property = null) => {
    if (property) {
      setEditingProperty(property);
      setFormData({
        title: property.title,
        description: property.description,
        location: property.location,
        price: property.price,
        maxGuests: property.maxGuests,
        rooms: property.rooms,
        amenities: property.amenities?.join(', ') || '',
        rating: property.rating || '4.5'
      });
      setImagePreviews(property.images || []);
    } else {
      setEditingProperty(null);
      setFormData({
        title: '',
        description: '',
        location: '',
        price: '',
        maxGuests: '',
        rooms: '',
        amenities: '',
        rating: '4.5'
      });
      setImagePreviews([]);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setImages([]);
    setImagePreviews([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('maxGuests', formData.maxGuests);
    formDataToSend.append('rooms', formData.rooms);
    formDataToSend.append('amenities', formData.amenities);
    formDataToSend.append('rating', formData.rating);

    images.forEach(image => {
      formDataToSend.append('images', image);
    });

    try {
      if (editingProperty) {
        await axios.put(`/api/properties/${editingProperty._id}`, formDataToSend, {
          headers: { 
            'x-auth-token': token,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Departamento actualizado correctamente');
      } else {
        await axios.post('/api/properties', formDataToSend, {
          headers: { 
            'x-auth-token': token,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Departamento creado correctamente');
      }
      closeModal();
      fetchProperties();
    } catch (err) {
      console.error('Error saving property:', err);
      alert(err.response?.data || 'Error al guardar departamento');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este departamento?')) return;
    
    setDeletingId(id);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/properties/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setProperties(properties.filter(p => p._id !== id));
      alert('Departamento eliminado');
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Error al eliminar departamento');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbnb-pink"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="px-4 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pt-20 md:pt-24">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold">Gestión de Departamentos</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-airbnb-pink text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-700 transition-colors w-full md:w-auto"
          >
            <Plus size={20} />
            <span>Nuevo Departamento</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <Home className="text-airbnb-pink" size={24} />
              <div>
                <p className="text-gray-500 text-sm">Total Departamentos</p>
                <p className="text-2xl font-bold">{properties.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Home size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay departamentos</h3>
            <p className="text-gray-500 mb-4">Comienza agregando tu primer departamento</p>
            <button
              onClick={() => openModal()}
              className="bg-airbnb-pink text-white px-6 py-2 rounded-full font-semibold hover:bg-pink-700 transition-colors"
            >
              Agregar Departamento
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={property.images?.[0] || '/placeholder.jpg'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{property.location}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-airbnb-pink font-bold text-xl">${property.price}</span>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <span>👥 {property.maxGuests} huéspedes</span>
                      <span>•</span>
                      <span>🏠 {property.rooms} cuartos</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(property)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(property._id)}
                      disabled={deletingId === property._id}
                      className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      {deletingId === property._id ? '...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-8">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingProperty ? 'Editar Departamento' : 'Nuevo Departamento'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium mb-1">Título *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ej: Departamento moderno en Miraflores"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-airbnb-pink"
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium mb-1">Descripción *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe tu departamento..."
                  rows={3}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-airbnb-pink"
                  required
                />
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium mb-1">Ubicación *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Ej: Lima, Perú"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-airbnb-pink"
                  required
                />
              </div>

              {/* Precio y Capacidad */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Precio por noche *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-airbnb-pink"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Huéspedes máx *</label>
                  <input
                    type="number"
                    name="maxGuests"
                    value={formData.maxGuests}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-airbnb-pink"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cuartos *</label>
                  <input
                    type="number"
                    name="rooms"
                    value={formData.rooms}
                    onChange={handleInputChange}
                    placeholder="1"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-airbnb-pink"
                    required
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="5"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-airbnb-pink"
                />
              </div>

              {/* Amenidades */}
              <div>
                <label className="block text-sm font-medium mb-1">Amenidades</label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleInputChange}
                  placeholder="Ej: WiFi, Cocina, Piscina (separados por coma)"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-airbnb-pink"
                />
              </div>

              {/* Imágenes */}
              <div>
                <label className="block text-sm font-medium mb-1">Imágenes</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-500 mb-2">
                    {images.length > 0 
                      ? `${images.length} archivo(s) seleccionado(s)`
                      : 'Arrastra imágenes o haz click para subir'}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-block bg-airbnb-pink text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-pink-700 transition-colors"
                  >
                    Seleccionar Imágenes
                  </label>
                </div>

                {/* Previsualización */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-airbnb-pink text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                >
                  {editingProperty ? 'Actualizar' : 'Crear'} Departamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
