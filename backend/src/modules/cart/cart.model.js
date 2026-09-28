const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT.UNSIGNED },
  guestId: { type: DataTypes.STRING(64) },
  status: { type: DataTypes.ENUM('active', 'converted'), allowNull: false, defaultValue: 'active' },
}, {
  tableName: 'carts',
  indexes: [
    { fields: ['user_id', 'status'] },
    { fields: ['guest_id', 'status'] },
  ],
});

module.exports = Cart;
