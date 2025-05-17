const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const SavedItem = sequelize.define('SavedItem', {
  type: { type: DataTypes.STRING, allowNull: false },
  details: { type: DataTypes.JSON, allowNull: false },
});

SavedItem.belongsTo(User, { foreignKey: 'userId' });

module.exports = SavedItem;