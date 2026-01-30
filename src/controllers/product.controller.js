const Product = require('../models/product');
const mongoose = require('mongoose'); 
exports.getAllProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search } = req.query;
        
        let query = {}; 

        if (category) query.categoryId = category;

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' }; 
        }
        const products = await Product.find(query);
        
        res.json(products);
    } catch (error) {
        console.error("Error in getAllProducts:", error);
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Product ID format" });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: "Error creating product", error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const result = await Product.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: "Product not found" });
        
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};