const fulfillmentService = require('../fulfillment/fulfillment.service');
const paymentService = require('./payment.service');

// The browser's "payment succeeded" callback can be fabricated, so the webhook is
// the only thing that flips an order to paid.
async function webhook(req, res) {
  const rawBody = req.body instanceof Buffer ? req.body : Buffer.from(JSON.stringify(req.body));
  paymentService.verifyWebhookSignature(rawBody, req.get('X-Razorpay-Signature'));

  const event = JSON.parse(rawBody.toString('utf8'));
  const result = await paymentService.handleWebhook(event);

  // Gateways time out fast: acknowledge first, let supplier dispatch fail and retry
  // on its own without the gateway replaying the whole event.
  res.status(200).json({ received: true });

  if (result.transitionedTo === 'paid') {
    fulfillmentService.dispatchOrder(result.orderId).catch((err) => {
      console.error(`[fulfillment] dispatch failed for order ${result.orderId}`, err);
    });
  }
}

module.exports = { webhook };
