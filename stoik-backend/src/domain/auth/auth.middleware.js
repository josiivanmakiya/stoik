const { verifyToken, getUserFromToken } = require('./auth.service.js');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const AUTH_BYPASS_ENABLED = process.env.AUTH_BYPASS === 'true';

if (IS_PRODUCTION && AUTH_BYPASS_ENABLED) {
  throw new Error('AUTH_BYPASS must be false in production');
}

const DEV_BYPASS_USER = {
  id: process.env.AUTH_BYPASS_USER_ID || '000000000000000000000001',
  _id: process.env.AUTH_BYPASS_USER_ID || '000000000000000000000001',
  email: process.env.AUTH_BYPASS_USER_EMAIL || 'preview@stoik.local',
  fullName: process.env.AUTH_BYPASS_USER_NAME || 'Preview User',
  role: process.env.AUTH_BYPASS_USER_ROLE || 'admin',
  status: 'active'
};

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
      if (AUTH_BYPASS_ENABLED && !IS_PRODUCTION) {
        req.user = DEV_BYPASS_USER;
        return next();
      }
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
    if (AUTH_BYPASS_ENABLED && !IS_PRODUCTION) {
      req.user = DEV_BYPASS_USER;
      return next();
    }
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
    } else if (AUTH_BYPASS_ENABLED && !IS_PRODUCTION) {
      req.user = DEV_BYPASS_USER;
    }

    next();
  } catch (error) {
    if (AUTH_BYPASS_ENABLED && !IS_PRODUCTION) {
      req.user = DEV_BYPASS_USER;
    }
    // Ignore auth errors for optional auth.
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin
};
