const express = require('express');
const { searchHotels, createPaymentIntent } = require('../utils/amadeus');
const Booking = require('../models/Booking');
const router = express.Router();

router.get('/search', (req, res) => {
  if (!req.user) return res.redirect('/login');
  res.render('hotelSearch', {
    user: req.user,
    destination: '',
    latitude: '',
    longitude: '',
    radius: 5,
  });
});

router.post('/search', async (req, res) => {
  if (!req.user) return res.redirect('/login');
  const { destination, latitude, longitude, radius, checkIn, checkOut } = req.body;
  try {
    const hotels = await searchHotels({ latitude, longitude, radius });
    res.render('hotelResults', {
      user: req.user,
      hotels,
      destination,
      checkIn,
      checkOut,
    });
  } catch (err) {
    res.status(500).send('Error fetching hotels');
  }
});

router.post('/book', async (req, res) => {
  if (!req.user) return res.redirect('/login');
  const { hotelId, checkIn, checkOut, roomType, amount } = req.body;
  try {
    const clientSecret = await createPaymentIntent(amount);
    const booking = await Booking.create({
      userId: req.user.id,
      hotelId,
      checkIn,
      checkOut,
      roomType,
      paymentStatus: 'pending',
    });
    res.render('payment', {
      user: req.user,
      clientSecret,
      bookingId: booking.id,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (err) {
    res.status(500).send('Error processing booking');
  }
});

router.post('/update-status', async (req, res) => {
  const { bookingId, status } = req.body;
  try {
    await Booking.update({ paymentStatus: status }, { where: { id: bookingId } });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send('Error updating booking status');
  }
});

module.exports = router;