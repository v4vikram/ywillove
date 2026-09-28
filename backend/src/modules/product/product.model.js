const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(180), allowNull: false },
  slug: { type: DataTypes.STRING(200), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
  basePrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  images: { type: DataTypes.JSON, defaultValue: [] },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, {
  tableName: 'products',
  indexes: [
    { fields: ['category_id', 'is_active', 'base_price'] },
    { type: 'FULLTEXT', fields: ['title', 'description'] },
  ],
});

module.exports = Product;
