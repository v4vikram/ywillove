const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SupplierOrderLog = sequelize.define('SupplierOrderLog', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  orderId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  supplier: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'qikink' },
  supplierOrderId: { type: DataTypes.STRING(80) },
  status: {
    type: DataTypes.ENUM('queued', 'sent', 'failed', 'in_production', 'shipped', 'delivered'),
    allowNull: false,
    defaultValue: 'queued',
  },
  attempts: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  lastError: { type: DataTypes.TEXT },
  payload: { type: DataTypes.JSON },
}, {
  tableName: 'supplier_order_logs',
  indexes: [
    { unique: true, fields: ['order_id', 'supplier'] },
    { fields: ['status'] },
  ],
});

module.exports = SupplierOrderLog;
