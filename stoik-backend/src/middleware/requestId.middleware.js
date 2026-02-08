const { v4: uuidv4 } = require('uuid');

/**
 * Request ID Middleware
 * Adds a unique request ID to each request for tracing
 */
const requestIdMiddleware = (req, res, next) => {
  // Generate unique request ID
  const requestId = uuidv4();
  
  // Add to request object
  req.requestId = requestId;
  
  // Add to response headers for client debugging
  res.setHeader('X-Request-ID', requestId);
  
  next();
};

module.exports = requestIdMiddleware;