const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Subscriber = sequelize.define('Subscriber', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING(190), allowNull: false, unique: true, validate: { isEmail: true } },
  source: { type: DataTypes.STRING(40), allowNull: false, defaultValue: 'homepage' },
  unsubscribedAt: { type: DataTypes.DATE },
}, {
  tableName: 'subscribers',
});

module.exports = Subscriber;
