// controllers/itemController.js
const Item = require('../models/itemModel'); // Import the Item Model

// GET all items (Read All)
exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET a single item (Read One)
exports.getOneItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST a new item (Create)
exports.createItem = async (req, res) => {
    try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem); // 201 Created
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request for validation errors
    }
};

// PUT/PATCH to update an item (Update)
exports.updateItem = async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // Return the new document, run schema validators
        );
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE an item (Delete)
exports.deleteItem = async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        // 204 No Content is often used for successful deletions
        res.status(204).json({ message: 'Item deleted successfully' }); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};