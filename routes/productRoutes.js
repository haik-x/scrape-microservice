// routes/productRoutes.js
const express = require('express');
const productController = require('./../controllers/product');

const router = express.Router();

// Route to handle product creation
router.post('/', productController.createProduct);
// Add more routes as needed

module.exports = router;
