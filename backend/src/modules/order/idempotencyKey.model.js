const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// A double-clicked Pay button replays the same key and gets the original order back
// instead of creating a second one.
const IdempotencyKey = sequelize.define('IdempotencyKey', {
  key: { type: DataTypes.STRING(100), primaryKey: true },
  orderId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  response: { type: DataTypes.JSON, allowNull: false },
}, {
  tableName: 'idempotency_keys',
});

module.exports = IdempotencyKey;
