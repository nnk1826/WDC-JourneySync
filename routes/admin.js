const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AdminLog = require('../models/AdminLog');

const ensureAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) return res.redirect('/');
  next();
};

router.get('/', ensureAdmin, async (req, res) => {
  const users = await User.findAll();
  const logs = await AdminLog.findAll();
  res.render('admin', { user: req.user, users, logs });
});

router.post('/ban', ensureAdmin, async (req, res) => {
  const { userId } = req.body;
  await User.update({ isAdmin: false }, { where: { id: userId } });
  await AdminLog.create({
    adminId: req.user.id,
    action: `Banned user ${userId}`,
  });
  res.redirect('/admin');
});

module.exports = router;