const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { SECURITY_DEFAULTS } = require('../config/constants.js');

/**
 * Security Middleware Configuration
 */

// Helmet configuration for security headers
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: () => ({
      error: message,
      code: 'RATE_LIMIT_EXCEEDED',
      timestamp: new Date().toISOString()
    }),
    standardHeaders: true,
    legacyHeaders: false
    // Use default key generator (handles IPv6 properly)
  });
};

// General API rate limit
const generalRateLimit = createRateLimit(
  SECURITY_DEFAULTS.RATE_LIMIT_WINDOW_MS,
  SECURITY_DEFAULTS.RATE_LIMIT_MAX,
  'Too many requests from this IP/user, please try again later'
);

// Auth endpoints rate limit (stricter)
const authRateLimit = createRateLimit(
  SECURITY_DEFAULTS.RATE_LIMIT_WINDOW_MS,
  SECURITY_DEFAULTS.AUTH_RATE_LIMIT_MAX,
  'Too many authentication attempts, please try again later'
);

// Checkout endpoints rate limit (payment abuse protection)
const checkoutRateLimit = createRateLimit(
  SECURITY_DEFAULTS.RATE_LIMIT_WINDOW_MS,
  SECURITY_DEFAULTS.CHECKOUT_RATE_LIMIT_MAX,
  'Too many checkout attempts, please try again later'
);

module.exports = {
  helmetConfig,
  generalRateLimit,
  authRateLimit,
  checkoutRateLimit
};
