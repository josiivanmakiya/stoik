const express = require('express');
const { updateUser, getUserById } = require('../domain/user/user.model.js');
const logger = require('../config/logger');
const { LOG_ACTIONS } = require('../config/logActions');

const router = express.Router();

// Get current user
router.get('/me', async (req, res) => {
  try {
    const user = await getUserById(req.user._id || req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    if (status) updates.status = status;

    const updatedUser = await updateUser(req.user._id || req.user.id, updates);
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    logger.info(LOG_ACTIONS.USER_PROFILE_UPDATED, { userId: updatedUser._id });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
