const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(190), allowNull: false, unique: true, validate: { isEmail: true } },
  phone: { type: DataTypes.STRING(20) },
  passwordHash: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('customer', 'admin'), allowNull: false, defaultValue: 'customer' },
}, {
  tableName: 'users',
  defaultScope: { attributes: { exclude: ['passwordHash'] } },
  scopes: { withPassword: { attributes: {} } },
});

module.exports = User;
