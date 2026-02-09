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
    console.log('addToCart вызван. Данные от фронта:', req.body);
    console.log('Пользователь из токена:', req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Не авторизован. Войдите в аккаунт.' });
    }

    const userId = req.user.id;  
    const { productId, sku, qty, priceSnapshot } = req.body;

    if (!productId || !sku || !qty || !priceSnapshot) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.sku === sku && item.productId.toString() === productId);

    if (existingItem) {
      existingItem.qty += qty;
    } else {
      cart.items.push({ productId, sku, qty, priceSnapshot });
    }

    await cart.save();

    console.log('Корзина сохранена:', cart);

    res.status(200).json({ message: 'Товар добавлен в корзину', cart });
  } catch (error) {
    console.error('Ошибка в addToCart:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Ошибка сервера при добавлении в корзину', error: error.message });
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