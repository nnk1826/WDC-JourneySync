const express = require('express');
const router = express.Router();
const { searchCity, searchFlights, bookFlight } = require('../utils/amadeus');
const Booking = require('../models/Booking');

// Search flights
router.post('/search-flights', async (req, res) => {
  try {
    const { origin, destination, checkIn, checkOut, guests } = req.body;

    // Return empty array for missing inputs
    if (!origin || !destination || !checkIn || !checkOut || !guests) {
      return res.status(200).json([]);
    }

    const flights = await searchFlights({ origin, destination, checkIn, checkOut, guests });
    res.status(200).json(Array.isArray(flights) ? flights : []);
  } catch (error) {
    console.error('Flight search endpoint error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(200).json([]);
  }
});

// Search cities for autocomplete
router.get('/city-search', async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword || keyword.length < 2) {
      return res.status(200).json([]);
    }

    const cities = await searchCity(keyword);
    res.status(200).json(Array.isArray(cities) ? cities : []);
  } catch (error) {
    console.error('City search endpoint error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(200).json([]);
  }
});

// Book a flight
router.post('/book', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { flightId, amount } = req.body;
  try {
    const { clientSecret, bookingId } = await bookFlight({ flightId, amount });
    const booking = await Booking.create({
      userId: req.user.id,
      flightId,
      amount,
      paymentStatus: 'pending',
    });
    res.json({
      clientSecret,
      bookingId: booking.id,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error('Flight booking endpoint error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: 'Error processing flight booking' });
  }
});

module.exports = router;