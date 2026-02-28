const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
let fileLoggingEnabled = true;
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (error) {
  fileLoggingEnabled = false;
  // Fallback to console-only logging when filesystem is restricted.
  console.error('File logging disabled:', error.message);
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, requestId, userId, ...meta }) => {
    let logEntry = `${timestamp} [${level.toUpperCase()}]`;
    
    if (requestId) logEntry += ` [${requestId}]`;
    if (userId) logEntry += ` [User:${userId}]`;
    
    logEntry += ` ${message}`;
    
    if (Object.keys(meta).length > 0) {
      logEntry += ` ${JSON.stringify(meta)}`;
    }
    
    return logEntry;
  })
);

// Console transport for development
const consoleTransport = new winston.transports.Console({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    logFormat
  )
});

const fileTransports = fileLoggingEnabled
  ? [
      new DailyRotateFile({
        filename: path.join(logsDir, 'stoik-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
        level: 'info',
        format: logFormat
      }),
      new DailyRotateFile({
        filename: path.join(logsDir, 'stoik-error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '30d',
        level: 'error',
        format: logFormat
      })
    ]
  : [];

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [consoleTransport, ...fileTransports],
  // Handle uncaught exceptions
  exceptionHandlers: fileLoggingEnabled
    ? [
        new DailyRotateFile({
          filename: path.join(logsDir, 'stoik-exceptions-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '30d'
        })
      ]
    : [consoleTransport],
  // Handle unhandled promise rejections
  rejectionHandlers: fileLoggingEnabled
    ? [
        new DailyRotateFile({
          filename: path.join(logsDir, 'stoik-rejections-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '30d'
        })
      ]
    : [consoleTransport]
});

// Add request ID to logger context
logger.addRequestId = (requestId) => {
  return logger.child({ requestId });
};

// Add user ID to logger context
logger.addUserId = (userId) => {
  return logger.child({ userId });
};

module.exports = logger;
