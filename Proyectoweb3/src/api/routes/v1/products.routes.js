const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../../middleware/validation.middleware');
const { authMiddleware, adminMiddleware } = require('../../middleware/auth.middleware');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  getProductPriceHistory
} = require('../../controllers/product.controller');

const router = express.Router();

// Rutas públicas
router.get('/', getProducts);
router.get('/stats/:id', getProductStats);
router.get('/price-history/:id', getProductPriceHistory);
router.get('/:id', getProductById);

// Rutas protegidas (solo admin)
router.post('/', authMiddleware, adminMiddleware, [
  body('marca').notEmpty().withMessage('La marca es requerida'),
  body('Nombre').notEmpty().withMessage('El nombre es requerido'),
  body('Precio').isNumeric().withMessage('El precio debe ser un número'),
  body('stock_total').isInt().withMessage('El stock debe ser un número entero')
], validate, createProduct);

router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;