// src/index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Load environment variables
require('dotenv').config();

// Import logger and middleware
const logger = require('./config/logger');
const requestIdMiddleware = require('./middleware/requestId.middleware');
const {
  helmetConfig,
  generalRateLimit,
  authRateLimit
} = require('./middleware/security.middleware');

// Database connection
const { connectDB } = require('./db/connection.js');

// Authentication
const authRoutes = require('./routes/auth.routes.js');
const { authenticateToken } = require('./domain/auth/auth.middleware.js');

const usersRoutes = require('./routes/users.routes');
const plansRoutes = require('./routes/plans.routes');
const subscriptionsRoutes = require('./routes/subscriptions.routes');
const fitRoutes = require('./routes/fit.routes');
const productsRoutes = require('./routes/products.routes');
const skusRoutes = require('./routes/skus.routes');

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
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
}));

// General rate limiting
app.use(generalRateLimit);

// API Versioning
const API_PREFIX = '/v1';

// Parse JSON for all other routes with size limits
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Routes with specific rate limiting
app.use(`${API_PREFIX}/auth`, authRateLimit, authRoutes);
app.use(`${API_PREFIX}/users`, authenticateToken, usersRoutes);
app.use(`${API_PREFIX}/plans`, plansRoutes);
app.use(`${API_PREFIX}/subscriptions`, authenticateToken, subscriptionsRoutes);
app.use(`${API_PREFIX}/fit`, authenticateToken, fitRoutes);
app.use(`${API_PREFIX}/products`, productsRoutes);
app.use(`${API_PREFIX}/skus`, skusRoutes);

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
