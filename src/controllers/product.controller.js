const Product = require('../models/product');

exports.getAllProducts = async (req, res) => {
    try {
        let query = {};
        if (req.query.category) {
            query.$or = [
                { categoryId: req.query.category },
                { categoryName: req.query.category }
            ];
        }
        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
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