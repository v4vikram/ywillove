const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Review = sequelize.define('Review', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  rating: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, validate: { min: 1, max: 5 } },
  body: { type: DataTypes.TEXT },
  isApproved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
  tableName: 'reviews',
  indexes: [
    { unique: true, fields: ['product_id', 'user_id'] },
    { fields: ['product_id', 'is_approved'] },
  ],
});

module.exports = Review;
