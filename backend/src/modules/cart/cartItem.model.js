const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// Composite PK so adding the same variant twice increments quantity instead of
// creating a second row.
const CartItem = sequelize.define('CartItem', {
  cartId: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
  variantId: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
  quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
}, {
  tableName: 'cart_items',
});

module.exports = CartItem;
