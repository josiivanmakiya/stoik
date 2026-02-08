const Joi = require('joi');
const logger = require('../config/logger');
const { LOG_ACTIONS } = require('../config/logActions');

/**
 * Validation Middleware Factory
 * Creates middleware that validates request data against Joi schemas
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const requestLogger = logger.addRequestId(req.requestId);
    
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all validation errors
      stripUnknown: true, // Remove unknown fields
      convert: true // Convert types when possible
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      requestLogger.warn('Validation failed', {
        action: LOG_ACTIONS.VALIDATION_ERROR,
        endpoint: `${req.method} ${req.originalUrl}`,
        errors: validationErrors,
        userId: req.user?.id
      });

      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validationErrors,
        timestamp: new Date().toISOString()
      });
    }

    // Replace request data with validated/sanitized data
    req[property] = value;
    next();
  };
};

/**
 * Joi Schemas for different endpoints
 */

// User registration schema
const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required'
    }),
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name cannot exceed 100 characters',
      'any.required': 'Full name is required'
    }),
  phone: Joi.string()
    .trim()
    .pattern(/^\+?[\d\s\-\(\)]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  address: Joi.object({
    street: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    zipCode: Joi.string().trim().required(),
    country: Joi.string().trim().required()
  }).optional()
});

// User login schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required(),
  password: Joi.string()
    .required()
});

// Subscription creation schema
const subscriptionSchema = Joi.object({
  planId: Joi.string()
    .valid('core', 'premium', 'enterprise')
    .required()
    .messages({
      'any.only': 'Plan must be one of: core, premium, enterprise',
      'any.required': 'Plan ID is required'
    }),
  commitmentMonths: Joi.number()
    .integer()
    .min(0)
    .max(24)
    .default(0)
    .messages({
      'number.min': 'Commitment months cannot be negative',
      'number.max': 'Commitment months cannot exceed 24'
    }),
  startDate: Joi.date()
    .iso()
    .min('now')
    .optional()
    .messages({
      'date.min': 'Start date cannot be in the past'
    })
});

// Fit profile schema
const fitProfileSchema = Joi.object({
  chest: Joi.number().positive().required(),
  waist: Joi.number().positive().required(),
  hips: Joi.number().positive().required(),
  height: Joi.number().positive().required()
});

// MongoDB ObjectId validation
const objectIdSchema = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    'string.pattern.base': 'Invalid ID format'
  });

module.exports = {
  validate,
  schemas: {
    register: registerSchema,
    login: loginSchema,
    subscription: subscriptionSchema,
    fitProfile: fitProfileSchema,
    objectId: objectIdSchema
  }
};
