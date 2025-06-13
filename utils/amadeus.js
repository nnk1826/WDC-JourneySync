const Amadeus = require('amadeus');
const NodeCache = require('node-cache');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Initialize cache (24-hour TTL for city codes, 1-hour for flight results)
const cache = new NodeCache({ stdTTL: 86400, checkperiod: 120 });

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
});

// Validate date format (YYYY-MM-DD)
const isValidDate = (date) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(date) && !isNaN(new Date(date).getTime());
};

// Helper function for city search
async function searchCity(keyword) {
  try {
    if (!keyword || typeof keyword !== 'string' || keyword.length < 2) {
      return [];
    }

    const cacheKey = `city_${keyword.toLowerCase()}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) return cachedResult;

    const response = await amadeus.referenceData.locations.get({
      subType: 'CITY',
      keyword,
    });

    const result = Array.isArray(response.data) ? response.data : [];
    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('City search error:', {
      message: error.message,
      response: error.response?.data,
      code: error.code,
    });
    return [];
  }
}

// Helper function for flight search
async function searchFlights({ origin, destination, checkIn, checkOut, guests }) {
  try {
    if (!origin || !destination || !checkIn || !checkOut || !guests || isNaN(parseInt(guests))) {
      return [];
    }

    // Validate IATA codes and dates
    if (!/^[A-Z]{3}$/.test(origin) || !/^[A-Z]{3}$/.test(destination) || !isValidDate(checkIn) || !isValidDate(checkOut)) {
      return [];
    }

    const cacheKey = `flights_${origin}_${destination}_${checkIn}_${guests}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) return cachedResult;

    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: checkIn,
      returnDate: checkOut,
      adults: parseInt(guests),
      max: 10,
    });

    const result = Array.isArray(response.data) ? response.data : [];
    cache.set(cacheKey, result, 3600);
    return result;
  } catch (error) {
    console.error('Flight search error:', {
      message: error.message,
      response: error.response?.data,
      code: error.code,
    });
    return [];
  }
}

// Helper function for flight booking
async function bookFlight({ flightId, amount }) {
  try {
    if (!flightId || !amount || isNaN(parseFloat(amount))) {
      throw new Error('Invalid booking parameters');
    }

    // Placeholder for Amadeus flight booking API
    // Note: Actual implementation requires traveler details and flight-offer verification
    // const response = await amadeus.booking.flightOrders.post({
    //   data: {
    //     type: 'flight-order',
    //     flightOffers: [{ id: flightId }],
    //     travelers: [{ /* Traveler details */ }],
    //   },
    // });

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      description: `Flight booking for flight ID: ${flightId}`,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      bookingId: `FLIGHT_${flightId}_${Date.now()}`, // Mock booking ID
    };
  } catch (error) {
    console.error('Flight booking error:', {
      message: error.message,
      response: error.response?.data,
      code: error.code,
    });
    throw new Error('Failed to process flight booking');
  }
}

module.exports = {
  searchCity,
  searchFlights,
  bookFlight,
};