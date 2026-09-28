const fulfillmentService = require('./fulfillment.service');

async function webhook(req, res) {
  const result = await fulfillmentService.applySupplierStatus({
    supplierOrderId: String(req.body.order_id ?? ''),
    status: req.body.status,
  });

  res.json({ received: true, ...result });
}

async function retry(req, res) {
  const retried = await fulfillmentService.retryFailed();
  res.json({ retried });
}

async function dispatch(req, res) {
  const log = await fulfillmentService.dispatchOrder(req.params.orderId);
  res.json({ log });
}

module.exports = { webhook, retry, dispatch };
