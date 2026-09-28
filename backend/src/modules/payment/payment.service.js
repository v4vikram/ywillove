const crypto = require('node:crypto');
const env = require('../../config/env');
const { badRequest, unauthorized } = require('../../utils/ApiError');
const { toPaise } = require('../../utils/money');
const Order = require('../order/order.model');
const Payment = require('./payment.model');

const usingDummyKeys = () => String(env.razorpay.keyId).includes('dummy');

async function callRazorpay(path, body) {
  const auth = Buffer.from(`${env.razorpay.keyId}:${env.razorpay.keySecret}`).toString('base64');

  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw badRequest(`Razorpay error: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

// Until a real Razorpay test account exists, this returns a stub so checkout can be
// exercised end to end locally. Swapping in real keys switches it to the live call.
async function createGatewayOrder(order) {
  const gatewayOrder = usingDummyKeys()
    ? { id: `order_dummy_${order.orderNumber}` }
    : await callRazorpay('/orders', {
      amount: toPaise(order.totalAmount),
      currency: 'INR',
      receipt: order.orderNumber,
      notes: { orderNumber: order.orderNumber },
    });

  await Payment.create({
    orderId: order.id,
    gatewayOrderId: gatewayOrder.id,
    amount: order.totalAmount,
  });

  return { id: gatewayOrder.id, keyId: env.razorpay.keyId };
}

function verifyWebhookSignature(rawBody, signature) {
  const expected = crypto
    .createHmac('sha256', env.razorpay.webhookSecret)
    .update(rawBody)
    .digest('hex');

  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature || ''));

  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw unauthorized('Invalid webhook signature');
  }
}

// Gateways retry and can deliver out of order, so every transition is checked
// against the current state instead of applied blindly.
async function handleWebhook(event) {
  const entity = event?.payload?.payment?.entity;
  if (!entity?.order_id) return { ignored: true };

  const payment = await Payment.findOne({ where: { gatewayOrderId: entity.order_id } });
  if (!payment) return { ignored: true };

  const order = await Order.findByPk(payment.orderId);
  if (!order) return { ignored: true };

  if (event.event === 'payment.captured' && order.paymentStatus === 'pending') {
    await payment.update({
      status: 'captured',
      gatewayPaymentId: entity.id,
      rawPayload: event,
    });
    await order.update({ paymentStatus: 'paid' });
    return { orderId: order.id, transitionedTo: 'paid' };
  }

  if (event.event === 'payment.failed' && order.paymentStatus === 'pending') {
    await payment.update({ status: 'failed', gatewayPaymentId: entity.id, rawPayload: event });
    await order.update({ paymentStatus: 'failed' });
    return { orderId: order.id, transitionedTo: 'failed' };
  }

  return { ignored: true };
}

module.exports = { createGatewayOrder, verifyWebhookSignature, handleWebhook, usingDummyKeys };
