// src/index.js

const express = require('express');
const cors = require('cors');

// Load environment variables
require('dotenv').config();

// Import logger and middleware
const logger = require('./config/logger');
const requestIdMiddleware = require('./middleware/requestId.middleware');
const {
  helmetConfig,
  generalRateLimit,
  authRateLimit,
  checkoutRateLimit
} = require('./middleware/security.middleware');
const { SECURITY_DEFAULTS } = require('./config/constants.js');

// Database connection
const { connectDB } = require('./db/connection.js');

// Authentication
const authRoutes = require('./routes/auth.routes.js');
const { authenticateToken, optionalAuth } = require('./domain/auth/auth.middleware.js');

const usersRoutes = require('./routes/users.routes');
const plansRoutes = require('./routes/plans.routes');
const subscriptionsRoutes = require('./routes/subscriptions.routes');
const fitRoutes = require('./routes/fit.routes');
const productsRoutes = require('./routes/products.routes');
const skusRoutes = require('./routes/skus.routes');
const consumablesRoutes = require('./routes/consumables.routes');
const bagRoutes = require('./routes/bag.routes');
const checkoutRoutes = require('./routes/checkout.routes');
const paystackRoutes = require('./routes/paystack.routes');
const invoicesRoutes = require('./routes/invoices.routes');

const app = express();
const PORT = process.env.PORT || 3002;

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware (MUST be first)
app.use(helmetConfig);

// Request ID middleware (for tracing)
app.use(requestIdMiddleware);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const requestLogger = logger.addRequestId(req.requestId);
  
  requestLogger.info('Request started', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'info';
    
    requestLogger[level]('Request completed', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length')
    });
  });

  next();
});

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:5173')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    // Allow server-to-server and same-origin calls without Origin header.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
}));

// General rate limiting
app.use(generalRateLimit);

// API Versioning
const API_PREFIX = '/v1';

// Paystack webhook needs raw body for signature verification
app.use(`${API_PREFIX}/paystack/webhook`, express.raw({ type: 'application/json' }));

// Request timeout and body parsing boundaries
app.use((req, res, next) => {
  req.setTimeout(SECURITY_DEFAULTS.REQUEST_TIMEOUT_MS);
  res.setTimeout(SECURITY_DEFAULTS.REQUEST_TIMEOUT_MS);
  next();
});
app.use(express.json({ limit: SECURITY_DEFAULTS.JSON_LIMIT }));
app.use(express.urlencoded({
  extended: true,
  limit: SECURITY_DEFAULTS.URLENCODED_LIMIT,
  parameterLimit: SECURITY_DEFAULTS.URLENCODED_PARAMETER_LIMIT
}));

// Routes with specific rate limiting
app.use(`${API_PREFIX}/auth`, authRateLimit, authRoutes);
app.use(`${API_PREFIX}/users`, authenticateToken, usersRoutes);
app.use(`${API_PREFIX}/plans`, plansRoutes);
app.use(`${API_PREFIX}/subscriptions`, authenticateToken, subscriptionsRoutes);
app.use(`${API_PREFIX}/fit`, authenticateToken, fitRoutes);
app.use(`${API_PREFIX}/products`, productsRoutes);
app.use(`${API_PREFIX}/skus`, skusRoutes);
app.use(`${API_PREFIX}/consumables`, consumablesRoutes);
app.use(`${API_PREFIX}/bag`, authenticateToken, bagRoutes);
app.use(`${API_PREFIX}/checkout`, checkoutRateLimit, optionalAuth, checkoutRoutes);
app.use(`${API_PREFIX}/paystack`, paystackRoutes);
app.use(`${API_PREFIX}/invoices`, authenticateToken, invoicesRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    requestId: req.requestId
  });
});

// 404 handler
app.use('*', (req, res) => {
  logger.warn('Route not found', {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });
  
  res.status(404).json({
    error: 'Route not found',
    code: 'ROUTE_NOT_FOUND',
    timestamp: new Date().toISOString(),
    requestId: req.requestId
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const requestLogger = logger.addRequestId(req.requestId);
  
  requestLogger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.id
  });

  if (err?.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'Origin not allowed',
      code: 'CORS_ORIGIN_BLOCKED',
      timestamp: new Date().toISOString(),
      requestId: req.requestId
    });
  }

  if (err?.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Request payload too large',
      code: 'PAYLOAD_TOO_LARGE',
      timestamp: new Date().toISOString(),
      requestId: req.requestId
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
    requestId: req.requestId
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('Connected to MongoDB successfully');

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`🚀 Stoik backend v1.0.0 running on port ${PORT}`, { 
        port: PORT, 
        apiPrefix: API_PREFIX,
        nodeEnv: process.env.NODE_ENV 
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();
