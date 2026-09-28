const env = require('../../config/env');
const { notFound } = require('../../utils/ApiError');
const Order = require('../order/order.model');
const OrderItem = require('../order/orderItem.model');
const SupplierOrderLog = require('./supplierOrderLog.model');

const usingDummyKeys = () => String(env.qikink.accessToken).includes('dummy');

const SUPPLIER_TO_ORDER_STATUS = {
  in_production: 'in_production',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
};

function buildQikinkPayload(order, items) {
  return {
    order_number: order.orderNumber,
    qikink_shipping: 1,
    gateway: 'Prepaid',
    total_order_value: order.totalAmount,
    line_items: items.map((item) => ({
      search_from_my_products: 1,
      quantity: String(item.quantity),
      price: String(item.unitPrice),
      sku: item.supplierSku,
    })),
    shipping_address: order.shippingAddress,
  };
}

async function callQikink(payload) {
  const response = await fetch(`${env.qikink.baseUrl}/order/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ClientId: env.qikink.clientId,
      Accesstoken: env.qikink.accessToken,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`Qikink ${response.status}: ${await response.text()}`);
  return response.json();
}

// Runs after payment is captured. Failures are recorded rather than thrown away, so a
// retry job can pick up anything stuck in 'failed' without losing a paid order.
async function dispatchOrder(orderId) {
  const order = await Order.findByPk(orderId, { include: [{ model: OrderItem, as: 'items' }] });
  if (!order) throw notFound('Order not found');

  const [log] = await SupplierOrderLog.findOrCreate({
    where: { orderId: order.id, supplier: 'qikink' },
    defaults: { orderId: order.id, supplier: 'qikink' },
  });

  if (['sent', 'in_production', 'shipped', 'delivered'].includes(log.status)) return log;

  const payload = buildQikinkPayload(order, order.items);

  try {
    const result = usingDummyKeys()
      ? { order_id: `qk_dummy_${order.orderNumber}` }
      : await callQikink(payload);

    await log.update({
      status: 'sent',
      supplierOrderId: String(result.order_id ?? ''),
      attempts: log.attempts + 1,
      payload,
      lastError: null,
    });
    await order.update({ fulfillmentStatus: 'sent_to_supplier' });
  } catch (err) {
    await log.update({ status: 'failed', attempts: log.attempts + 1, lastError: err.message, payload });
    throw err;
  }

  return log;
}

async function applySupplierStatus({ supplierOrderId, status }) {
  const log = await SupplierOrderLog.findOne({ where: { supplierOrderId } });
  if (!log) return { ignored: true };

  const orderStatus = SUPPLIER_TO_ORDER_STATUS[status];
  if (!orderStatus) return { ignored: true };

  await log.update({ status: status === 'cancelled' ? 'failed' : status });
  await Order.update({ fulfillmentStatus: orderStatus }, { where: { id: log.orderId } });

  return { orderId: log.orderId, fulfillmentStatus: orderStatus };
}

async function retryFailed() {
  const stuck = await SupplierOrderLog.findAll({ where: { status: 'failed' }, limit: 20 });

  for (const log of stuck) {
    try {
      await dispatchOrder(log.orderId);
    } catch (err) {
      console.error(`[fulfillment] retry failed for order ${log.orderId}`, err.message);
    }
  }

  return stuck.length;
}

module.exports = { dispatchOrder, applySupplierStatus, retryFailed, usingDummyKeys };
