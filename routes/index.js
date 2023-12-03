// routes/index.js
const express = require('express');
const productController = require('./../controllers/product');
// Import other route files as needed

const router = express.Router();

// Use product routes
router.post('/api/product', productController.create);
//router.put('api/product/:id', productController.edit);
// Use other routes as needed


console.log('Exiting routes/index.js');
module.exports = router;
