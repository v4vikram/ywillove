const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// Name, label, price and SKU are snapshots: an old invoice must not change when a
// product is renamed, repriced, or its Qikink SKU is remapped.
const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  orderId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  variantId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  productName: { type: DataTypes.STRING(180), allowNull: false },
  variantLabel: { type: DataTypes.STRING(80), allowNull: false },
  supplierSku: { type: DataTypes.STRING(80), allowNull: false },
  unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
}, {
  tableName: 'order_items',
  indexes: [{ fields: ['order_id'] }],
});

module.exports = OrderItem;
