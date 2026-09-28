const { Op } = require('sequelize');
const { notFound } = require('../../utils/ApiError');
const Product = require('./product.model');
const ProductVariant = require('./productVariant.model');
const Category = require('./category.model');

const PAGE_SIZE = 12;

async function list({ category, minPrice, maxPrice, sort = 'newest', page = 1 }) {
  const where = { isActive: true };

  if (minPrice || maxPrice) {
    where.basePrice = {
      ...(minPrice ? { [Op.gte]: minPrice } : {}),
      ...(maxPrice ? { [Op.lte]: maxPrice } : {}),
    };
  }

  const order = {
    newest: [['createdAt', 'DESC']],
    'price-asc': [['basePrice', 'ASC']],
    'price-desc': [['basePrice', 'DESC']],
  }[sort] || [['createdAt', 'DESC']];

  const { rows, count } = await Product.findAndCountAll({
    where,
    order,
    limit: PAGE_SIZE,
    offset: (Number(page) - 1) * PAGE_SIZE,
    include: [{
      model: Category,
      as: 'category',
      attributes: ['id', 'name', 'slug'],
      ...(category ? { where: { slug: category } } : {}),
    }],
  });

  return { products: rows, total: count, page: Number(page), pageSize: PAGE_SIZE };
}

async function getBySlug(slug) {
  const product = await Product.findOne({
    where: { slug, isActive: true },
    include: [
      { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
      { model: ProductVariant, as: 'variants', where: { isActive: true }, required: false },
    ],
  });

  if (!product) throw notFound('Product not found');
  return product;
}

async function listCategories() {
  return Category.findAll({ order: [['name', 'ASC']] });
}

async function create(payload) {
  const { variants = [], ...productData } = payload;
  const product = await Product.create(productData);

  if (variants.length) {
    await ProductVariant.bulkCreate(variants.map((v) => ({ ...v, productId: product.id })));
  }

  return getBySlug(product.slug);
}

async function update(id, payload) {
  const product = await Product.findByPk(id);
  if (!product) throw notFound('Product not found');

  await product.update(payload);
  return product;
}

// Soft delete: an order item may still reference this product's variants.
async function deactivate(id) {
  const product = await Product.findByPk(id);
  if (!product) throw notFound('Product not found');

  await product.update({ isActive: false });
}

module.exports = { list, getBySlug, listCategories, create, update, deactivate };
