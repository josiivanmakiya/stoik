const express = require('express');
const Product = require('../db/models/product.model.js');
const { authenticateToken, requireAdmin } = require('../domain/auth/auth.middleware.js');
const { validate, schemas } = require('../middleware/validation.middleware');
const { sendError } = require('../utils/http');

const router = express.Router();

// Public: list active products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (err) {
    return sendError(res, {
      status: 500,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      requestId: req.requestId
    });
  }
});

// Admin: create product
router.post('/', authenticateToken, requireAdmin, validate(schemas.productCreate), async (req, res) => {
  const { productId, name, description } = req.body;
  if (!productId || !name) {
    return res.status(400).json({ error: 'Missing required fields: productId, name' });
  }

  try {
    const existing = await Product.findOne({ productId });
    if (existing) return res.status(409).json({ error: 'Product already exists' });

    const product = await Product.create({ productId, name, description });
    res.status(201).json(product);
  } catch (err) {
    return sendError(res, {
      status: 400,
      message: 'Invalid product payload',
      code: 'PRODUCT_CREATE_FAILED',
      requestId: req.requestId
    });
  }
});

// Admin: deactivate product
router.patch('/:productId/deactivate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { productId: req.params.productId },
      { isActive: false },
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    return sendError(res, {
      status: 400,
      message: 'Failed to deactivate product',
      code: 'PRODUCT_DEACTIVATE_FAILED',
      requestId: req.requestId
    });
  }
});

module.exports = router;
