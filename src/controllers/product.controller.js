const Product = require('../models/product');
const Category = require('../models/category');
const mongoose = require('mongoose');
exports.getAllProducts = async (req, res) => {
    try {
        let query = { isActive: true };

        if (req.query.category) {
            const categoryParam = req.query.category.trim().toLowerCase();

            // Специальная обработка для "all" / "all products"
            if (categoryParam === 'all' || categoryParam === 'all products') {
                // Ничего не добавляем → покажем все активные продукты
            } else {
                // Для остальных случаев ищем по slug категории
                const category = await Category.findOne({ slug: categoryParam });

                if (category) {
                    query.categoryId = category._id;
                } else {
                    // Если slug не найден — можно вернуть пустой массив или все продукты
                    // Для теста вернём все:
                    // query = { isActive: true };
                    // Или строго:
                    return res.json([]);
                }
            }
        }

        const products = await Product.find(query)
            .populate('categoryId', 'name slug description')  // чтобы фронт получил название категории
            .sort({ createdAt: -1 })  // новые сверху
            .lean();  // ускоряет, если не нужны mongoose-методы

        res.json(products);
    } catch (error) {
        console.error('Ошибка при получении продуктов:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
  try {
    let id = req.params.id || req.query.id;

    console.log('[DETAIL] Запрошен ID:', id);

    // Пытаемся найти как ObjectId
    let product = await Product.findById(id).catch(() => null);

    // Если не нашлось — пробуем как простую строку
    if (!product) {
      product = await Product.findOne({ _id: id });
      console.log('[DETAIL] Поиск по строке _id:', product ? 'НАЙДЕН' : 'НЕ НАЙДЕН');
    }

    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    res.json(product);
  } catch (error) {
    console.error('[DETAIL ERROR]', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};