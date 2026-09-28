const { badRequest, notFound } = require('../../utils/ApiError');
const { multiply, sum } = require('../../utils/money');
const Product = require('../product/product.model');
const ProductVariant = require('../product/productVariant.model');
const Cart = require('./cart.model');
const CartItem = require('./cartItem.model');

function ownerWhere({ userId, guestId }) {
  if (userId) return { userId, status: 'active' };
  if (guestId) return { guestId, status: 'active' };
  throw badRequest('No cart owner — log in or send a guest id');
}

async function getOrCreateCart(owner) {
  const where = ownerWhere(owner);
  const [cart] = await Cart.findOrCreate({ where, defaults: where });
  return cart;
}

async function getCart(owner) {
  const cart = await getOrCreateCart(owner);

  const items = await CartItem.findAll({
    where: { cartId: cart.id },
    include: [{
      model: ProductVariant,
      as: 'variant',
      include: [{ model: Product, as: 'product', attributes: ['id', 'title', 'slug', 'images'] }],
    }],
  });

  const lines = items.map((item) => ({
    variantId: item.variantId,
    quantity: item.quantity,
    unitPrice: item.variant.price,
    lineTotal: multiply(item.variant.price, item.quantity),
    variant: item.variant,
  }));

  return { cartId: cart.id, items: lines, subtotal: sum(lines.map((l) => l.lineTotal)) };
}

async function addItem(owner, { variantId, quantity = 1 }) {
  const variant = await ProductVariant.findOne({ where: { id: variantId, isActive: true } });
  if (!variant) throw notFound('Variant not available');

  const cart = await getOrCreateCart(owner);
  const existing = await CartItem.findOne({ where: { cartId: cart.id, variantId } });

  if (existing) {
    await existing.update({ quantity: existing.quantity + Number(quantity) });
  } else {
    await CartItem.create({ cartId: cart.id, variantId, quantity });
  }

  return getCart(owner);
}

async function updateItem(owner, variantId, quantity) {
  const cart = await getOrCreateCart(owner);
  const item = await CartItem.findOne({ where: { cartId: cart.id, variantId } });
  if (!item) throw notFound('Item not in cart');

  if (Number(quantity) < 1) {
    await item.destroy();
  } else {
    await item.update({ quantity });
  }

  return getCart(owner);
}

async function removeItem(owner, variantId) {
  const cart = await getOrCreateCart(owner);
  await CartItem.destroy({ where: { cartId: cart.id, variantId } });
  return getCart(owner);
}

// On login the guest's cart lines move onto the user's cart, so nothing browsed
// logged-out is lost at checkout.
async function mergeGuestCart({ userId, guestId }) {
  if (!guestId) return;

  const guestCart = await Cart.findOne({ where: { guestId, status: 'active' } });
  if (!guestCart) return;

  const userCart = await getOrCreateCart({ userId });
  const guestItems = await CartItem.findAll({ where: { cartId: guestCart.id } });

  for (const item of guestItems) {
    const existing = await CartItem.findOne({
      where: { cartId: userCart.id, variantId: item.variantId },
    });

    if (existing) {
      await existing.update({ quantity: existing.quantity + item.quantity });
    } else {
      await CartItem.create({
        cartId: userCart.id,
        variantId: item.variantId,
        quantity: item.quantity,
      });
    }
  }

  await CartItem.destroy({ where: { cartId: guestCart.id } });
  await guestCart.destroy();
}

module.exports = { getCart, getOrCreateCart, addItem, updateItem, removeItem, mergeGuestCart };
