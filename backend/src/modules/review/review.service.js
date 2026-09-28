const { fn, col } = require('sequelize');
const { conflict, forbidden, notFound } = require('../../utils/ApiError');
const User = require('../auth/user.model');
const Order = require('../order/order.model');
const OrderItem = require('../order/orderItem.model');
const Product = require('../product/product.model');
const ProductVariant = require('../product/productVariant.model');
const Review = require('./review.model');

async function listForProduct(productId) {
  const reviews = await Review.findAll({
    where: { productId, isApproved: true },
    order: [['createdAt', 'DESC']],
    include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
  });

  const [summary] = await Review.findAll({
    where: { productId, isApproved: true },
    attributes: [[fn('AVG', col('rating')), 'average'], [fn('COUNT', col('id')), 'count']],
    raw: true,
  });

  return { reviews, average: Number(summary?.average ?? 0), count: Number(summary?.count ?? 0) };
}

// Only buyers can review: a rating carries no weight if anyone can post one.
async function hasPurchased(userId, productId) {
  const variantIds = (await ProductVariant.findAll({
    where: { productId },
    attributes: ['id'],
    raw: true,
  })).map((v) => v.id);

  if (!variantIds.length) return false;

  const purchase = await OrderItem.findOne({
    where: { variantId: variantIds },
    include: [{ model: Order, as: 'order', where: { userId, paymentStatus: 'paid' }, attributes: [] }],
  });

  return Boolean(purchase);
}

async function create(userId, { productId, rating, body }) {
  if (!(await hasPurchased(userId, productId))) {
    throw forbidden('Only buyers of this product can review it');
  }

  const existing = await Review.findOne({ where: { productId, userId } });
  if (existing) throw conflict('You have already reviewed this product');

  return Review.create({ productId, userId, rating, body });
}

// Homepage social proof: newest approved reviews across the whole catalog.
async function listRecent(limit = 6) {
  return Review.findAll({
    where: { isApproved: true },
    order: [['createdAt', 'DESC']],
    limit: Math.min(Number(limit) || 6, 20),
    include: [
      { model: User, as: 'user', attributes: ['id', 'name'] },
      { model: Product, as: 'product', attributes: ['id', 'title', 'slug'] },
    ],
  });
}

async function listPending() {
  return Review.findAll({
    where: { isApproved: false },
    order: [['createdAt', 'ASC']],
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: Product, as: 'product', attributes: ['id', 'title', 'slug'] },
    ],
  });
}

async function approve(id) {
  const review = await Review.findByPk(id);
  if (!review) throw notFound('Review not found');

  await review.update({ isApproved: true });
  return review;
}

module.exports = { listForProduct, listRecent, listPending, create, approve };
