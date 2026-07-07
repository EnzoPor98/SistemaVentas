const express = require('express');
const router = express.Router();
const { 
    createProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');

// Rutas para /api/products
router.route('/')
    .get(getProducts)               // Público: Cualquiera puede ver el catálogo
    .post(protect, createProduct);  // Protegido: Solo usuarios logueados crean

// Rutas para /api/products/:id
router.route('/:id')
    .get(getProductById)
    .put(protect, updateProduct)    // Protegido
    .delete(protect, deleteProduct); // Protegido

module.exports = router;