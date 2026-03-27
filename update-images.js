const mongoose = require('mongoose');
const Property = require('./models/Property');
const dotenv = require('dotenv');

dotenv.config();

const updateImageUrls = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Obtener todas las propiedades
    const properties = await Property.find({});

    for (const property of properties) {
      // Actualizar imágenes que tengan localhost a rutas relativas
      const updatedImages = property.images.map(img => {
        if (img.includes('localhost')) {
          return img.replace('http://localhost:5000', '');
        }
        return img;
      });

      if (JSON.stringify(updatedImages) !== JSON.stringify(property.images)) {
        property.images = updatedImages;
        await property.save();
        console.log(`✅ Actualizado: ${property.title}`);
      }
    }

    console.log('✅ Todas las imágenes fueron actualizadas a rutas relativas');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

updateImageUrls();
