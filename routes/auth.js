const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('signup', { user: req.user });
});

router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, dob, terms, marketing } = req.body;
  if (password !== confirmPassword) return res.status(400).send('Passwords do not match');
//   if (!agreeTerms) return res.status(400).send('You must agree to the terms');
  try {
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).send('User already exists');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      preferences: { dob, marketing: !!marketing },
    });
    req.login(user, (err) => {
      if (err) throw err;
      res.redirect('/dashboard');
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
}));

router.get('/dashboard', (req, res) => {
  if (!req.user) return res.redirect('/login');
  res.render('dashboard', { user: req.user });
});

router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

module.exports = router;