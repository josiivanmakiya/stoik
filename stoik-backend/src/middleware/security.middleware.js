const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

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
    message: {
      error: message,
      code: 'RATE_LIMIT_EXCEEDED',
      timestamp: new Date().toISOString()
    },
    standardHeaders: true,
    legacyHeaders: false
    // Use default key generator (handles IPv6 properly)
  });
};

// General API rate limit
const generalRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP/user to 100 requests per windowMs
  'Too many requests from this IP/user, please try again later'
);

// Auth endpoints rate limit (stricter)
const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  'Too many authentication attempts, please try again later'
);

module.exports = {
  helmetConfig,
  generalRateLimit,
  authRateLimit
};
