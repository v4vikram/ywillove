const reviewService = require('./review.service');

async function listForProduct(req, res) {
  res.json(await reviewService.listForProduct(req.params.productId));
}

async function listRecent(req, res) {
  res.json({ reviews: await reviewService.listRecent(req.query.limit) });
}

async function listPending(req, res) {
  res.json({ reviews: await reviewService.listPending() });
}

async function create(req, res) {
  res.status(201).json({ review: await reviewService.create(req.user.id, req.body) });
}

async function approve(req, res) {
  res.json({ review: await reviewService.approve(req.params.id) });
}

module.exports = { listForProduct, listRecent, listPending, create, approve };
