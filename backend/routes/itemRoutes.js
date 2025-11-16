// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Base path: /api/items

// GET all items (Read All) and POST a new item (Create)
router.route('/')
    .get(itemController.getAllItems)
    .post(itemController.createItem);

// GET one item (Read One), PUT/PATCH to update (Update), and DELETE one item (Delete)
router.route('/:id')
    .get(itemController.getOneItem)
    .put(itemController.updateItem) // Use PUT for full replacement, or PATCH for partial update
    .delete(itemController.deleteItem);

module.exports = router;