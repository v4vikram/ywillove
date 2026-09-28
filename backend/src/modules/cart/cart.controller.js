const crypto = require('node:crypto');
const env = require('../../config/env');
const cartService = require('./cart.service');

const GUEST_COOKIE = 'guest_id';

function resolveOwner(req, res) {
  if (req.user?.id) return { userId: req.user.id };

  let guestId = req.guestId;
  if (!guestId) {
    guestId = crypto.randomUUID();
    res.cookie(GUEST_COOKIE, guestId, {
      httpOnly: true,
      secure: env.isProd,
      sameSite: env.isProd ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  return { guestId };
}

async function getCart(req, res) {
  res.json(await cartService.getCart(resolveOwner(req, res)));
}

async function addItem(req, res) {
  res.status(201).json(await cartService.addItem(resolveOwner(req, res), req.body));
}

async function updateItem(req, res) {
  const owner = resolveOwner(req, res);
  res.json(await cartService.updateItem(owner, req.params.variantId, req.body.quantity));
}

async function removeItem(req, res) {
  const owner = resolveOwner(req, res);
  res.json(await cartService.removeItem(owner, req.params.variantId));
}

async function merge(req, res) {
  await cartService.mergeGuestCart({ userId: req.user.id, guestId: req.guestId });
  res.clearCookie(GUEST_COOKIE);
  res.json(await cartService.getCart({ userId: req.user.id }));
}

module.exports = { getCart, addItem, updateItem, removeItem, merge };
