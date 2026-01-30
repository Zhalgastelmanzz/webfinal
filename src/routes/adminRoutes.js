const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/stats', protect, adminOnly, analyticsController.getCategoryStats);

module.exports = router;