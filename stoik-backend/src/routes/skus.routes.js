const express = require('express');
const Sku = require('../db/models/sku.model.js');
const Product = require('../db/models/product.model.js');
const { authenticateToken, requireAdmin } = require('../domain/auth/auth.middleware.js');
const { validate, schemas } = require('../middleware/validation.middleware');
const { sendError } = require('../utils/http');

const router = express.Router();
const normalizeSkuCode = (value) => String(value || '').trim().toUpperCase();
const normalizeAttribute = (value) => String(value || '').trim();

// Public: list active skus (optionally by productId)
router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.productId) {
      const product = await Product.findOne({ productId: req.query.productId });
      if (!product) return res.status(404).json({ error: 'Product not found' });
      filter.productId = product._id;
    }
    const skus = await Sku.find(filter).populate('productId', 'productId name');
    res.json(skus);
  } catch (err) {
    return sendError(res, {
      status: 500,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      requestId: req.requestId
    });
  }
});

// Admin: create sku
router.post('/', authenticateToken, requireAdmin, validate(schemas.skuCreate), async (req, res) => {
  const { skuCode, productId, size, color, packCount } = req.body;
  if (!skuCode || !productId || !size || !color) {
    return res.status(400).json({ error: 'Missing required fields: skuCode, productId, size, color' });
  }

  try {
    const product = await Product.findOne({ productId });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const normalizedSkuCode = normalizeSkuCode(skuCode);
    const existing = await Sku.findOne({ skuCode: normalizedSkuCode });
    if (existing) return res.status(409).json({ error: 'SKU already exists' });

    const sku = await Sku.create({
      skuCode: normalizedSkuCode,
      productId: product._id,
      size: normalizeAttribute(size),
      color: normalizeAttribute(color),
      packCount: packCount || 1
    });
    res.status(201).json(sku);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'SKU already exists' });
    }
    return sendError(res, {
      status: 400,
      message: 'Invalid SKU payload',
      code: 'SKU_CREATE_FAILED',
      requestId: req.requestId
    });
  }
});

// Admin: deactivate sku
router.patch('/:skuCode/deactivate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const sku = await Sku.findOneAndUpdate(
      { skuCode: normalizeSkuCode(req.params.skuCode) },
      { isActive: false },
      { new: true }
    );
    if (!sku) return res.status(404).json({ error: 'SKU not found' });
    res.json(sku);
  } catch (err) {
    return sendError(res, {
      status: 400,
      message: 'Failed to deactivate SKU',
      code: 'SKU_DEACTIVATE_FAILED',
      requestId: req.requestId
    });
  }
});

module.exports = router;
