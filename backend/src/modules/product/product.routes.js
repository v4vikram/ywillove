const { Router } = require('express');
const { requireAuth, requireAdmin } = require('../../middleware/auth.middleware');
const controller = require('./product.controller');

const router = Router();

router.get('/products', controller.list);
router.get('/products/:slug', controller.getBySlug);
router.get('/categories', controller.listCategories);

router.post('/products', requireAuth, requireAdmin, controller.create);
router.patch('/products/:id', requireAuth, requireAdmin, controller.update);
router.delete('/products/:id', requireAuth, requireAdmin, controller.deactivate);

module.exports = router;
