const crypto = require('node:crypto');
const { Op, literal } = require('sequelize');
const sequelize = require('../../config/db');
const { badRequest, conflict, notFound } = require('../../utils/ApiError');
const { multiply, sum } = require('../../utils/money');
const Product = require('../product/product.model');
const ProductVariant = require('../product/productVariant.model');
const Cart = require('../cart/cart.model');
const CartItem = require('../cart/cartItem.model');
const paymentService = require('../payment/payment.service');
const Order = require('./order.model');
const OrderItem = require('./orderItem.model');
const IdempotencyKey = require('./idempotencyKey.model');

function generateOrderNumber() {
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `UW${stamp}${crypto.randomInt(1000, 9999)}`;
}

async function placeOrder({ owner, email, shippingAddress, idempotencyKey }) {
  if (!idempotencyKey) throw badRequest('Idempotency-Key header is required');

  const replay = await IdempotencyKey.findByPk(idempotencyKey);
  if (replay) return replay.response;

  const cart = await Cart.findOne({
    where: owner.userId
      ? { userId: owner.userId, status: 'active' }
      : { guestId: owner.guestId, status: 'active' },
  });
  if (!cart) throw badRequest('Cart is empty');

  const items = await CartItem.findAll({
    where: { cartId: cart.id },
    include: [{
      model: ProductVariant,
      as: 'variant',
      include: [{ model: Product, as: 'product', attributes: ['title'] }],
    }],
  });
  if (!items.length) throw badRequest('Cart is empty');

  const transaction = await sequelize.transaction();
  let order;

  try {
    for (const item of items) {
      if (!item.variant?.isActive) throw conflict(`${item.variant?.id} is no longer available`);

      // Read-then-write would let two concurrent checkouts both pass the check and
      // oversell, so the guard lives in the UPDATE itself and we check row count.
      if (item.variant.trackInventory) {
        const [affected] = await ProductVariant.update(
          { stock: literal(`stock - ${Number(item.quantity)}`) },
          {
            where: { id: item.variantId, stock: { [Op.gte]: item.quantity } },
            transaction,
          },
        );
        if (affected === 0) throw conflict(`Insufficient stock for variant ${item.variantId}`);
      }
    }

    const lineTotals = items.map((item) => multiply(item.variant.price, item.quantity));

    order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: owner.userId || null,
      email,
      totalAmount: sum(lineTotals),
      shippingAddress,
    }, { transaction });

    await OrderItem.bulkCreate(items.map((item) => ({
      orderId: order.id,
      variantId: item.variantId,
      productName: item.variant.product.title,
      variantLabel: `${item.variant.size} / ${item.variant.color}`,
      supplierSku: item.variant.supplierSku,
      unitPrice: item.variant.price,
      quantity: item.quantity,
    })), { transaction });

    await CartItem.destroy({ where: { cartId: cart.id }, transaction });
    await cart.update({ status: 'converted' }, { transaction });

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }

  // Network I/O stays outside the transaction — holding row locks across a gateway
  // call is how deadlocks show up under load.
  const gatewayOrder = await paymentService.createGatewayOrder(order);

  const response = {
    orderId: order.id,
    orderNumber: order.orderNumber,
    amount: order.totalAmount,
    gatewayOrderId: gatewayOrder.id,
    gatewayKeyId: gatewayOrder.keyId,
  };

  await IdempotencyKey.create({ key: idempotencyKey, orderId: order.id, response });

  return response;
}

async function listForUser(userId) {
  return Order.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    include: [{ model: OrderItem, as: 'items' }],
  });
}

async function listAll({ paymentStatus, fulfillmentStatus, limit = 50 } = {}) {
  return Order.findAll({
    where: {
      ...(paymentStatus ? { paymentStatus } : {}),
      ...(fulfillmentStatus ? { fulfillmentStatus } : {}),
    },
    order: [['createdAt', 'DESC']],
    limit: Math.min(Number(limit) || 50, 200),
    include: [{ model: OrderItem, as: 'items' }],
  });
}

async function getByNumber(orderNumber, userId) {
  const order = await Order.findOne({
    where: { orderNumber },
    include: [{ model: OrderItem, as: 'items' }],
  });

  if (!order || (order.userId && String(order.userId) !== String(userId))) {
    throw notFound('Order not found');
  }

  return order;
}

module.exports = { placeOrder, listForUser, listAll, getByNumber, generateOrderNumber };
