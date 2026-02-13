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
    const normalizedMessage = err.message === 'User already exists with this email'
      ? 'User already exists with this email'
      : 'Registration failed';
    const statusCode = normalizedMessage === 'User already exists with this email' ? 409 : 400;
    res.status(statusCode).json({ error: normalizedMessage, code: 'AUTH_REGISTER_FAILED' });
  }
});

// Login
router.post('/login', validate(schemas.login), async (req, res) => {
  const { email } = req.body;
  try {
    const { password } = req.body;
    const result = await loginUser({ email, password });
    logger.info(LOG_ACTIONS.USER_LOGIN_SUCCESS, { userId: result.user?.id || result.user?._id, email });
    res.json(result);
  } catch (err) {
    logger.warn(LOG_ACTIONS.USER_LOGIN_FAILED, { email, error: err.message });
    res.status(401).json({ error: 'Invalid email or password', code: 'AUTH_LOGIN_FAILED' });
  }
});

module.exports = router;
