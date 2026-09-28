const User = require('./auth/user.model');
const Category = require('./product/category.model');
const Product = require('./product/product.model');
const ProductVariant = require('./product/productVariant.model');
const Cart = require('./cart/cart.model');
const CartItem = require('./cart/cartItem.model');
const Order = require('./order/order.model');
const OrderItem = require('./order/orderItem.model');
const IdempotencyKey = require('./order/idempotencyKey.model');
const Payment = require('./payment/payment.model');
const SupplierOrderLog = require('./fulfillment/supplierOrderLog.model');
const Review = require('./review/review.model');
const Subscriber = require('./newsletter/subscriber.model');

// Relations live here rather than inside each module, because every one of them
// crosses a module boundary and they must all be registered before sync().
Category.hasMany(Product, { as: 'products', foreignKey: 'categoryId' });
Product.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });

Product.hasMany(ProductVariant, { as: 'variants', foreignKey: 'productId' });
ProductVariant.belongsTo(Product, { as: 'product', foreignKey: 'productId' });

User.hasMany(Cart, { as: 'carts', foreignKey: 'userId' });
Cart.belongsTo(User, { as: 'user', foreignKey: 'userId' });

Cart.hasMany(CartItem, { as: 'items', foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { as: 'cart', foreignKey: 'cartId' });
CartItem.belongsTo(ProductVariant, { as: 'variant', foreignKey: 'variantId' });

User.hasMany(Order, { as: 'orders', foreignKey: 'userId' });
Order.belongsTo(User, { as: 'user', foreignKey: 'userId' });

Order.hasMany(OrderItem, { as: 'items', foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { as: 'order', foreignKey: 'orderId' });
OrderItem.belongsTo(ProductVariant, { as: 'variant', foreignKey: 'variantId' });

Order.hasMany(Payment, { as: 'payments', foreignKey: 'orderId' });
Payment.belongsTo(Order, { as: 'order', foreignKey: 'orderId' });

Order.hasOne(SupplierOrderLog, { as: 'supplierLog', foreignKey: 'orderId' });
SupplierOrderLog.belongsTo(Order, { as: 'order', foreignKey: 'orderId' });

Order.hasMany(IdempotencyKey, { as: 'idempotencyKeys', foreignKey: 'orderId' });
IdempotencyKey.belongsTo(Order, { as: 'order', foreignKey: 'orderId' });

Product.hasMany(Review, { as: 'reviews', foreignKey: 'productId' });
Review.belongsTo(Product, { as: 'product', foreignKey: 'productId' });
User.hasMany(Review, { as: 'reviews', foreignKey: 'userId' });
Review.belongsTo(User, { as: 'user', foreignKey: 'userId' });

module.exports = {
  User,
  Category,
  Product,
  ProductVariant,
  Cart,
  CartItem,
  Order,
  OrderItem,
  IdempotencyKey,
  Payment,
  SupplierOrderLog,
  Review,
  Subscriber,
};
