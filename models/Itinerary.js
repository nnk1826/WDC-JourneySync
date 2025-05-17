const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Itinerary = sequelize.define('Itinerary', {
  tripName: { type: DataTypes.STRING, allowNull: false },
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: false },
  destinations: { type: DataTypes.JSON, defaultValue: [] },
  dailyPlans: { type: DataTypes.JSON, defaultValue: [] },
});

Itinerary.belongsTo(User, { foreignKey: 'userId' });

module.exports = Itinerary;