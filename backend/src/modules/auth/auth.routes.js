const { Router } = require('express');
const { requireAuth } = require('../../middleware/auth.middleware');
const controller = require('./auth.controller');

const router = Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.get('/me', requireAuth, controller.me);

module.exports = router;
