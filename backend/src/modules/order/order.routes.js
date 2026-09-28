const { Router } = require('express');
const { optionalAuth, requireAuth, requireAdmin } = require('../../middleware/auth.middleware');
const controller = require('./order.controller');

const router = Router();

router.post('/', optionalAuth, controller.placeOrder);
router.get('/', requireAuth, controller.list);
// Must sit above /:orderNumber, otherwise "admin" is read as an order number.
router.get('/admin/all', requireAuth, requireAdmin, controller.listAll);
router.get('/:orderNumber', optionalAuth, controller.getByNumber);

module.exports = router;
