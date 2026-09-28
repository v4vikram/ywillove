const { Router } = require('express');
const { requireAuth, requireAdmin } = require('../../middleware/auth.middleware');
const controller = require('./fulfillment.controller');

const router = Router();

router.post('/webhook', controller.webhook);
router.post('/orders/:orderId/dispatch', requireAuth, requireAdmin, controller.dispatch);
router.post('/retry', requireAuth, requireAdmin, controller.retry);

module.exports = router;
