const Order = require('../models/order');
const Product = require('../models/product');
const Cart = require('../models/cart');

exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, items, totalAmount } = req.body;
        const userId = req.user.id;

        for (const item of items) {
            const product = await Product.findById(item.productId);
            const variant = product.variants.find(v => v.sku === item.sku);
            
            if (!variant || variant.stockQty < item.qty) {
                return res.status(400).json({ message: `No stock for ${item.sku}` });
            }

            await Product.updateOne(
                { _id: item.productId, "variants.sku": item.sku },
                { $inc: { "variants.$.stockQty": -item.qty } }
            );
        }

        const newOrder = new Order({
            userId, shippingAddress, items, totalAmount,
            status: 'paid', paidAt: new Date()
        });

        await newOrder.save();
        await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
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