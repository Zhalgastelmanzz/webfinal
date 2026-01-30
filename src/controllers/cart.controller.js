const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        res.json(cart || { items: [] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, sku, qty, priceSnapshot } = req.body;
        const userId = req.user.id; 

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.productId.toString() === productId && item.sku === sku
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].qty += Number(qty);
        } else {
            cart.items.push({ productId, sku, qty: Number(qty), priceSnapshot });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { userId: req.user.id },
            { $pull: { items: { _id: req.params.itemId } } },
            { new: true }
        );
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};