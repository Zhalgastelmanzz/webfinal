const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: String,
    productNameSnapshot: String,
    unitPriceSnapshot: Number,
    qty: Number,
    lineTotal: Number
});

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'paid', 'completed'], default: 'pending' },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "KZT" },
    paidAt: Date
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;