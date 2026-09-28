const productService = require('./product.service');

async function list(req, res) {
  res.json(await productService.list(req.query));
}

async function getBySlug(req, res) {
  res.json({ product: await productService.getBySlug(req.params.slug) });
}

async function listCategories(req, res) {
  res.json({ categories: await productService.listCategories() });
}

async function create(req, res) {
  res.status(201).json({ product: await productService.create(req.body) });
}

async function update(req, res) {
  res.json({ product: await productService.update(req.params.id, req.body) });
}

async function deactivate(req, res) {
  await productService.deactivate(req.params.id);
  res.status(204).send();
}

module.exports = { list, getBySlug, listCategories, create, update, deactivate };
