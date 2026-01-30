const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/orders', protect, orderController.createOrder); 
router.get('/my-orders', protect, orderController.getMyOrders);
router.get('/cart', protect, orderController.getCart || ((req,res)=>res.json({items:[]}))); 

module.exports = router;