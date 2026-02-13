const express = require('express');
const bcrypt = require('bcryptjs');
const { updateUser, getUserById } = require('../domain/user/user.model.js');
const User = require('../db/models/user.model.js');
const logger = require('../config/logger');
const { LOG_ACTIONS } = require('../config/logActions');
const { sendError } = require('../utils/http');
const { validate, schemas } = require('../middleware/validation.middleware');

const router = express.Router();

const sanitizeUser = (userDoc) => {
  if (!userDoc) return userDoc;
  const obj = userDoc.toObject ? userDoc.toObject() : userDoc;
  const { password, ...rest } = obj;
  return rest;
};

// Get current user
router.get('/me', async (req, res) => {
  try {
    const user = await getUserById(req.user._id || req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(sanitizeUser(user));
  } catch (err) {
    return sendError(res, {
      status: 500,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      requestId: req.requestId
    });
  }
});

// Update current user
router.patch('/me', async (req, res) => {
  try {
    const { email, phone, fullName, address, status } = req.body;
    const updates = {};
    if (email) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (fullName) updates.fullName = fullName;
    if (address !== undefined) updates.address = address;
    if (status) {
      const role = req.user?.role;
      if (role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required', code: 'AUTH_ADMIN_REQUIRED' });
      }
      updates.status = status;
    }

    const updatedUser = await updateUser(req.user._id || req.user.id, updates);
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    logger.info(LOG_ACTIONS.USER_PROFILE_UPDATED, { userId: updatedUser._id });
    res.json(sanitizeUser(updatedUser));
  } catch (err) {
    return sendError(res, {
      status: 400,
      message: 'Invalid user update payload',
      code: 'USER_UPDATE_FAILED',
      requestId: req.requestId
    });
  }
});

// Update password
router.patch('/me/password', validate(schemas.passwordUpdate), async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    user.password = hashed;
    await user.save();

    logger.info(LOG_ACTIONS.USER_PROFILE_UPDATED, { userId });
    return res.json({ status: 'ok' });
  } catch (err) {
    return sendError(res, {
      status: 400,
      message: 'Password update failed',
      code: 'PASSWORD_UPDATE_FAILED',
      requestId: req.requestId
    });
  }
});

// Update email
router.patch('/me/email', validate(schemas.emailUpdate), async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { newEmail, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Password is incorrect' });
    }

    const existing = await User.findOne({ email: newEmail });
    if (existing && existing._id.toString() !== userId.toString()) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    user.email = newEmail;
    await user.save();

    logger.info(LOG_ACTIONS.USER_PROFILE_UPDATED, { userId });
    return res.json(sanitizeUser(user));
  } catch (err) {
    return sendError(res, {
      status: 400,
      message: 'Email update failed',
      code: 'EMAIL_UPDATE_FAILED',
      requestId: req.requestId
    });
  }
});

// Update billing address
router.patch('/me/billing-address', validate(schemas.billingAddress), async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const updated = await updateUser(userId, { billingAddress: req.body });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    logger.info(LOG_ACTIONS.USER_PROFILE_UPDATED, { userId });
    return res.json(sanitizeUser(updated));
  } catch (err) {
    return sendError(res, {
      status: 400,
      message: 'Billing address update failed',
      code: 'BILLING_ADDRESS_UPDATE_FAILED',
      requestId: req.requestId
    });
  }
});

// Update payment method (store summary only)
router.patch('/me/payment-method', validate(schemas.paymentMethod), async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const updated = await updateUser(userId, { paymentMethod: req.body });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    logger.info(LOG_ACTIONS.USER_PROFILE_UPDATED, { userId });
    return res.json(sanitizeUser(updated));
  } catch (err) {
    return sendError(res, {
      status: 400,
      message: 'Payment method update failed',
      code: 'PAYMENT_METHOD_UPDATE_FAILED',
      requestId: req.requestId
    });
  }
});

module.exports = router;
