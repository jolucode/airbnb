const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Create Booking
router.post('/', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const booking = await newBooking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all bookings (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('property').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update booking status
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(booking);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
