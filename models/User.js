const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  searchHistory: { type: DataTypes.JSON, defaultValue: [] },
  preferences: { type: DataTypes.JSON, defaultValue: { budget: null, amenities: [] } },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = User;