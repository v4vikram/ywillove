const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  slug: { type: DataTypes.STRING(140), allowNull: false, unique: true },
  parentId: { type: DataTypes.INTEGER.UNSIGNED },
}, {
  tableName: 'categories',
});

module.exports = Category;
