const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  orderNumber: { type: DataTypes.STRING(32), allowNull: false, unique: true },
  userId: { type: DataTypes.BIGINT.UNSIGNED },
  email: { type: DataTypes.STRING(190), allowNull: false },
  totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'pending',
  },
  // Kept separate from paymentStatus: money can be settled while Qikink is still
  // printing, and a print can fail after a successful payment.
  fulfillmentStatus: {
    type: DataTypes.ENUM('unfulfilled', 'sent_to_supplier', 'in_production', 'shipped', 'delivered', 'cancelled'),
    allowNull: false,
    defaultValue: 'unfulfilled',
  },
  shippingAddress: { type: DataTypes.JSON, allowNull: false },
}, {
  tableName: 'orders',
  indexes: [
    { fields: ['user_id', 'created_at'] },
    { fields: ['payment_status'] },
  ],
});

module.exports = Order;
