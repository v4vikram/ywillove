const { badRequest } = require('../../utils/ApiError');
const orderService = require('./order.service');

async function placeOrder(req, res) {
  const owner = req.user?.id ? { userId: req.user.id } : { guestId: req.guestId };
  if (!owner.userId && !owner.guestId) throw badRequest('No cart found');

  const result = await orderService.placeOrder({
    owner,
    email: req.body.email || req.user?.email,
    shippingAddress: req.body.shippingAddress,
    idempotencyKey: req.get('Idempotency-Key'),
  });

  res.status(201).json(result);
}

async function list(req, res) {
  res.json({ orders: await orderService.listForUser(req.user.id) });
}

async function listAll(req, res) {
  res.json({ orders: await orderService.listAll(req.query) });
}

async function getByNumber(req, res) {
  const order = await orderService.getByNumber(req.params.orderNumber, req.user?.id);
  res.json({ order });
}

module.exports = { placeOrder, list, listAll, getByNumber };
