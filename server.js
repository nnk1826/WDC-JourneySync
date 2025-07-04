const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const sequelize = require('./config/db');
const dotenv = require('dotenv');
const path = require('path');
const fetch = require('node-fetch'); // For Node.js < 18

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug: Log to verify API keys
console.log('GOOGLE_MAPS_API_KEY:', process.env.GOOGLE_MAPS_API_KEY || 'Not loaded');
console.log('AMADEUS_API_KEY:', process.env.AMADEUS_API_KEY || 'Not loaded');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({ db: sequelize }),
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));

// Routes
app.use('/', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/flights', require('./routes/flights'));
app.use('/api/hotels', require('./routes/hotels'));

// Itinerary route with city code resolution
app.get('/itinerary', async (req, res) => {
  try {
    const { destination, checkIn, checkOut, adults, kids } = req.query;

    let cityCode = destination;

    // Resolve city name to IATA code if needed
    if (!/^[A-Z]{3}$/i.test(destination)) {
      const cityResponse = await fetch(
        `http://localhost:${process.env.PORT || 3000}/flights/city-search?keyword=${encodeURIComponent(destination)}`
      );
      const cities = await cityResponse.json();
      cityCode = cities[0]?.iataCode || destination;
    }

    // Fetch hotels using resolved city code
    const hotelResponse = await fetch(
      `http://localhost:${process.env.PORT || 3000}/api/hotels?cityCode=${cityCode.toUpperCase()}`
    );
    const hotels = await hotelResponse.json();

    res.render('itinerary', {
      user: req.user,
      searchParams: { destination, checkIn, checkOut, adults, kids },
      hotels: hotels.data || []
    });

  } catch (error) {
    console.error('Itinerary error:', error);
    res.render('itinerary', {
      error: 'Failed to load itinerary. Please try again.'
    });
  }
});

// Profile route
app.get('/profile', (req, res) => {
  console.log('Accessing /profile - Authenticated:', req.isAuthenticated());
  console.log('User object:', req.user);

  if (!req.isAuthenticated()) {
    console.log('User not authenticated, redirecting to /login');
    return res.redirect('/login');
  }

  // Ensure User object is passed with fallback values
  const userData = req.user || { firstname: '', lastname: '', email: '' };
  res.render('profile', { User: userData });
});

// Home route
app.get('/', (req, res) => {
  console.log('Rendering home with API key:', process.env.GOOGLE_MAPS_API_KEY);
  res.render('home', {
    user: req.user,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || ''
  });
});

// Sync database and start server
sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
