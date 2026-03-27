const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Property = require('../models/Property');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Listar con filtros opcionales
router.get('/', async (req, res) => {
  const { location, guests, rooms } = req.query;
  let query = {};

  if (location) query.location = { $regex: location, $options: 'i' };
  if (guests) query.maxGuests = { $gte: parseInt(guests) };
  if (rooms) query.rooms = { $gte: parseInt(rooms) };

  try {
    const properties = await Property.find(query).sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    res.json(property);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/', [auth, upload.array('images', 10)], async (req, res) => {
  try {
    const images = req.files.map(file => `/uploads/${file.filename}`);
    const property = new Property({
      ...req.body,
      amenities: req.body.amenities ? req.body.amenities.split(',').map(a => a.trim()).filter(a => a) : [],
      images: images.length > 0 ? images : req.body.images ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images]) : []
    });
    await property.save();
    res.json(property);
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(500).send(err.message);
  }
});

router.put('/:id', [auth, upload.array('images', 10)], async (req, res) => {
  try {
    const images = req.files.map(file => `/uploads/${file.filename}`);
    const updateData = { 
      ...req.body,
      amenities: req.body.amenities ? req.body.amenities.split(',').map(a => a.trim()).filter(a => a) : undefined
    };
    if (images.length > 0) updateData.images = images;

    const property = await Property.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(property);
  } catch (err) {
    console.error('Error updating property:', err);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Eliminado' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
