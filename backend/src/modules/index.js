const express = require('express');
const { Router } = require('express');

require('./associations');

const authRoutes = require('./auth/auth.routes');
const productRoutes = require('./product/product.routes');
const cartRoutes = require('./cart/cart.routes');
const orderRoutes = require('./order/order.routes');
const paymentRoutes = require('./payment/payment.routes');
const fulfillmentRoutes = require('./fulfillment/fulfillment.routes');
const reviewRoutes = require('./review/review.routes');
const newsletterRoutes = require('./newsletter/newsletter.routes');

const router = Router();

// Mounted before the JSON parser: the Razorpay signature is verified against the raw bytes.
router.use('/payments', paymentRoutes);

router.use(express.json({ limit: '1mb' }));

router.use('/fulfillment', fulfillmentRoutes);
router.use('/auth', authRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/', productRoutes);
router.use('/', reviewRoutes);

module.exports = router;
