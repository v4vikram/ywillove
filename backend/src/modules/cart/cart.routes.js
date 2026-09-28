const { Router } = require('express');
const { optionalAuth, requireAuth } = require('../../middleware/auth.middleware');
const controller = require('./cart.controller');

const router = Router();

router.get('/', optionalAuth, controller.getCart);
router.post('/items', optionalAuth, controller.addItem);
router.patch('/items/:variantId', optionalAuth, controller.updateItem);
router.delete('/items/:variantId', optionalAuth, controller.removeItem);
router.post('/merge', requireAuth, controller.merge);

module.exports = router;
