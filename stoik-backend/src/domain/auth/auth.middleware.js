const { verifyToken, getUserFromToken } = require('./auth.service.js');

/**
 * JWT AUTHENTICATION MIDDLEWARE
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify token and get user
    const user = await getUserFromToken(token);
    req.user = user; // Attach user to request

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

/**
 * ADMIN-ONLY MIDDLEWARE
 */
const requireAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

/**
 * OPTIONAL AUTH MIDDLEWARE (for routes that work with or without auth)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const user = await getUserFromToken(token);
      req.user = user;
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin
};
