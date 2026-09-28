const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  orderId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  gateway: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'razorpay' },
  gatewayOrderId: { type: DataTypes.STRING(80), allowNull: false },
  gatewayPaymentId: { type: DataTypes.STRING(80) },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: {
    type: DataTypes.ENUM('created', 'captured', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'created',
  },
  rawPayload: { type: DataTypes.JSON },
}, {
  tableName: 'payments',
  indexes: [
    { fields: ['order_id'] },
    { unique: true, fields: ['gateway_order_id'] },
  ],
});

module.exports = Payment;
