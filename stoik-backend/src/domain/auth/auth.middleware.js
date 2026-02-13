const { verifyToken, getUserFromToken } = require('./auth.service.js');

const readBearerToken = (authHeader) => {
  if (!authHeader || typeof authHeader !== 'string') return null;
  const [scheme, token] = authHeader.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'bearer') return null;
  if (!token || !token.trim()) return null;
  return token.trim();
};

/**
 * JWT AUTHENTICATION MIDDLEWARE
 */
const authenticateToken = async (req, res, next) => {
  try {
    const token = readBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ error: 'Access token required', code: 'AUTH_TOKEN_MISSING' });
    }

    // Verify token and get user
    const user = await getUserFromToken(token);
    if (!user || user.status !== 'active') {
      return res.status(403).json({ error: 'Account is not active', code: 'AUTH_USER_INACTIVE' });
    }
    req.user = user; // Attach user to request

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token', code: 'AUTH_TOKEN_INVALID' });
  }
};

/**
 * ADMIN-ONLY MIDDLEWARE
 */
const requireAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required', code: 'AUTH_ADMIN_REQUIRED' });
  }
  next();
};

/**
 * OPTIONAL AUTH MIDDLEWARE (for routes that work with or without auth)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = readBearerToken(req.headers.authorization);

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
