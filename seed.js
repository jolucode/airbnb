const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Property = require('./models/Property');
const dotenv = require('dotenv');

dotenv.config();

const properties = [
  {
    title: "Penthouse Moderno con Vista al Mar",
    description: "Increíble departamento de lujo con acabados minimalistas y vistas panorámicas. Perfecto para estancias cortas o ejecutivos.",
    location: "Mirador del Sol",
    price: 150,
    images: [
      "http://localhost:5000/fotos_departamento/sala.jpeg",
      "http://localhost:5000/fotos_departamento/areacomun.jpeg",
      "http://localhost:5000/fotos_departamento/mirador.jpeg"
    ],
    amenities: ["WiFi", "Piscina", "Aire Acondicionado", "Cocina Equipada"],
    maxGuests: 4,
    rating: 4.9,
    reviewsCount: 12
  },
  {
    title: "Suite Ejecutiva con Piscina Privada",
    description: "Espacio elegante y privado. Disfruta de la tranquilidad en nuestra suite diseñada para el máximo confort.",
    location: "Centro Histórico",
    price: 95,
    images: [
      "http://localhost:5000/fotos_departamento/cuarto.jpeg",
      "http://localhost:5000/fotos_departamento/pisicna.jpeg",
      "http://localhost:5000/fotos_departamento/cuarto2.jpeg"
    ],
    amenities: ["WiFi", "Jacuzzi", "Seguridad 24/7"],
    maxGuests: 2,
    rating: 4.7,
    reviewsCount: 8
  },
  {
    title: "Departamento Familiar Amplio",
    description: "Ubicado en una zona residencial segura, ideal para familias que buscan comodidad y cercanía a parques.",
    location: "Residencial Las Palmas",
    price: 120,
    images: [
      "http://localhost:5000/fotos_departamento/cuarto3.jpeg",
      "http://localhost:5000/fotos_departamento/cuarto4.jpeg",
      "http://localhost:5000/fotos_departamento/cuarto5.jpeg"
    ],
    amenities: ["Parking Gratuito", "Lavadora", "TV por cable"],
    maxGuests: 6,
    rating: 4.8,
    reviewsCount: 20
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB...');

    // Limpiar base de datos
    await User.deleteMany({});
    await Property.deleteMany({});

    // Crear Admin
    const admin = new User({
      email: "admin@airbnb.com",
      password: "admin123", // Será hasheada por el modelo
      name: "Administrador"
    });
    await admin.save();
    console.log('✅ Admin creado: admin@airbnb.com / admin123');

    // Crear Propiedades
    await Property.insertMany(properties);
    console.log('✅ Propiedades creadas exitosamente');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
