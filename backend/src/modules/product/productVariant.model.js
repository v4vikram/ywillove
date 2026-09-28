const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const ProductVariant = sequelize.define('ProductVariant', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  size: { type: DataTypes.STRING(20), allowNull: false },
  color: { type: DataTypes.STRING(40), allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  supplierSku: { type: DataTypes.STRING(80), allowNull: false },
  // Qikink prints on demand, so most variants have no stock to reserve. A variant we
  // ever hold ourselves flips this on and goes through the conditional-decrement path.
  trackInventory: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  stock: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, {
  tableName: 'product_variants',
  indexes: [
    { unique: true, fields: ['product_id', 'size', 'color'] },
    { fields: ['supplier_sku'] },
  ],
});

module.exports = ProductVariant;
