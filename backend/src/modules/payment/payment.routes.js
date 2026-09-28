const express = require('express');
const { Router } = require('express');
const controller = require('./payment.controller');

const router = Router();

// Raw body, because the HMAC is computed over the exact bytes Razorpay sent.
router.post('/webhook', express.raw({ type: 'application/json' }), controller.webhook);

module.exports = router;
