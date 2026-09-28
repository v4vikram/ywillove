const { Router } = require('express');
const controller = require('./newsletter.controller');

const router = Router();

router.post('/subscribe', controller.subscribe);
router.post('/unsubscribe', controller.unsubscribe);

module.exports = router;
