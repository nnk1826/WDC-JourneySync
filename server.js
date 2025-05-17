const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const authRoutes = require('./routes/auth');
const hotelRoutes = require('./routes/hotels');
const itineraryRoutes = require('./routes/itineraries');
const adminRoutes = require('./routes/admin');
require('./config/passport');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.get('/', (req, res) => {
  res.render('pages/home', { user: req.user });
});

app.use('/', authRoutes);
app.use('/hotels', hotelRoutes);
app.use('/itineraries', itineraryRoutes);
app.use('/admin', adminRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port 3000');
});