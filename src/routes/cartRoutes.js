const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, cartController.getCart);
router.post('/add', protect, cartController.addToCart); 
router.delete('/item/:itemId', protect, cartController.removeFromCart);

module.exports = router;