const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    trackingId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Shipping', shippingSchema); 