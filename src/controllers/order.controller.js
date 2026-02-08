const Order = require('../models/order');
const Cart = require('../models/cart');

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId: userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Корзина пуста' });
        }

    
        const totalAmount = cart.items.reduce((sum, item) => sum + item.priceSnapshot * item.qty, 0);

        const newOrder = new Order({
            userId: userId,
            items: cart.items.map(item => ({
                productId: item.productId,
                sku: item.sku,
                productNameSnapshot: item.productNameSnapshot || '',
                unitPriceSnapshot: item.priceSnapshot,
                qty: item.qty,
                lineTotal: item.priceSnapshot * item.qty
            })),
            totalAmount: totalAmount,
            status: 'pending'  
        });

        await newOrder.save();

        
        cart.items = [];
        await cart.save();

        res.status(201).json({ 
            message: 'Заказ создан', 
            orderId: newOrder._id,
            total: totalAmount 
        });

    } catch (error) {
        console.error('Ошибка создания заказа:', error);
        res.status(500).json({ message: 'Ошибка создания заказа' });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Error fetching order", error: error.message });
    }
};