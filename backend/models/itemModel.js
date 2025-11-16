// models/Item.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    // Item Name: String, required
    itemName: {
        type: String,
        required: [true, 'Item Name is required'],
        trim: true,
    },
    // Price: Number (consider using Decimal128 for currency, but Number is common)
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0,
    },
    // Quantity: Number, required
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: 0,
        default: 1, // Default from the image
    },
    // HSN/SAC: String or Number (keeping it String for flexibility with leading zeros)
    hsnSac: {
        type: String,
        required: [true, 'HSN/SAC is required'],
        trim: true,
        // You might add validation here, e.g., match: /^\d{6,8}$/
    },
}, {
    // Adds createdAt and updatedAt timestamps
    timestamps: true 
});

// Create and export the Model
const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;