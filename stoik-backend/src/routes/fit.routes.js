const express = require('express');
const { validate, schemas } = require('../middleware/validation.middleware');
const { upsertFitProfile, getFitProfile } = require('../domain/fit/fit.service.js');
const logger = require('../config/logger');
const { LOG_ACTIONS } = require('../config/logActions');
const { sendError } = require('../utils/http');

const router = express.Router();

// Get current user's fit profile
router.get('/me', async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const profile = await getFitProfile(userId);
    if (!profile) return res.status(404).json({ error: 'Fit profile not found' });
    res.json(profile);
  } catch (err) {
    return sendError(res, {
      status: 500,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      requestId: req.requestId
    });
  }
});

// Create or update current user's fit profile
router.post('/me', validate(schemas.fitProfile), async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const profile = await upsertFitProfile(userId, req.body);
    logger.info(LOG_ACTIONS.FIT_PROFILE_UPDATED, { userId: profile.userId });
    res.json(profile);
  } catch (err) {
    return sendError(res, {
      status: 400,
      message: 'Invalid fit profile payload',
      code: 'FIT_PROFILE_UPDATE_FAILED',
      requestId: req.requestId
    });
  }
});

module.exports = router;
