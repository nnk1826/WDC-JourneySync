const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Booking = sequelize.define('Booking', {
  hotelId: { type: DataTypes.STRING, allowNull: false },
  checkIn: { type: DataTypes.DATE, allowNull: false },
  checkOut: { type: DataTypes.DATE, allowNull: false },
  roomType: { type: DataTypes.STRING, allowNull: false },
  paymentStatus: { type: DataTypes.STRING, defaultValue: 'pending' },
});

Booking.belongsTo(User, { foreignKey: 'userId' });

module.exports = Booking;