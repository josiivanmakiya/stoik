const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../domain/auth/auth.service');
const { validate, schemas } = require('../middleware/validation.middleware');
const logger = require('../config/logger');
const { LOG_ACTIONS } = require('../config/logActions');

// Register
router.post('/register', validate(schemas.register), async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    const result = await registerUser({ email, fullName, password });
    logger.info(LOG_ACTIONS.USER_REGISTERED, { userId: result.user?.id || result.user?._id, email });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', validate(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    logger.info(LOG_ACTIONS.USER_LOGIN_SUCCESS, { userId: result.user?.id || result.user?._id, email });
    res.json(result);
  } catch (err) {
    logger.warn(LOG_ACTIONS.USER_LOGIN_FAILED, { email, error: err.message });
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
