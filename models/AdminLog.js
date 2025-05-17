const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const AdminLog = sequelize.define('AdminLog', {
  action: { type: DataTypes.STRING, allowNull: false },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

AdminLog.belongsTo(User, { foreignKey: 'adminId' });

module.exports = AdminLog;