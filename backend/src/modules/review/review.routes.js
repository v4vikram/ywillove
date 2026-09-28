const { Router } = require('express');
const { requireAuth, requireAdmin } = require('../../middleware/auth.middleware');
const controller = require('./review.controller');

const router = Router();

router.get('/products/:productId/reviews', controller.listForProduct);
router.get('/reviews/recent', controller.listRecent);
router.get('/reviews/pending', requireAuth, requireAdmin, controller.listPending);
router.post('/reviews', requireAuth, controller.create);
router.patch('/reviews/:id/approve', requireAuth, requireAdmin, controller.approve);

module.exports = router;
