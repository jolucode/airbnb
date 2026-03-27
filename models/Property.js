const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }], 
  amenities: [{ type: String }],
  maxGuests: { type: Number, required: true },
  rooms: { type: Number, default: 1 }, // Nuevo campo
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
