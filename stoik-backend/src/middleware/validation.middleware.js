const Joi = require('joi');
const logger = require('../config/logger');
const { LOG_ACTIONS } = require('../config/logActions');
const { STOIK_COLORS, STOIK_SIZES } = require('../config/constants.js');
const { isValidColorQuantity, getAllowedQuantities } = require('../domain/plans/planRules.js');

/**
 * Validation Middleware Factory
 * Creates middleware that validates request data against Joi schemas
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const requestLogger = logger.addRequestId(req.requestId);

    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const validationErrors = error.details.map((detail) => ({
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

    req[property] = value;
    next();
  };
};

const registerSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    'any.required': 'Password is required'
  }),
  fullName: Joi.string().trim().min(2).max(100).required().messages({
    'string.min': 'Full name must be at least 2 characters long',
    'string.max': 'Full name cannot exceed 100 characters',
    'any.required': 'Full name is required'
  }),
  phone: Joi.string().trim().pattern(/^\+?[\d\s\-\(\)]+$/).optional().messages({
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

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required()
});

const subscriptionSchema = Joi.object({
  planId: Joi.string().trim().min(2).max(50).required().messages({
    'any.required': 'Plan ID is required'
  }),
  cadenceMonths: Joi.number().integer().min(1).max(6).default(1).messages({
    'number.min': 'Cadence months cannot be less than 1',
    'number.max': 'Cadence months cannot be greater than 6'
  }),
  commitmentMonths: Joi.number().integer().min(0).max(24).default(0).messages({
    'number.min': 'Commitment months cannot be negative',
    'number.max': 'Commitment months cannot exceed 24'
  }),
  startDate: Joi.date().iso().min('now').optional().messages({
    'date.min': 'Start date cannot be in the past'
  })
});

const fitProfileSchema = Joi.object({
  chest: Joi.number().positive().required(),
  waist: Joi.number().positive().required(),
  hips: Joi.number().positive().required(),
  height: Joi.number().positive().required()
});

const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'Invalid ID format'
});

const passwordUpdateSchema = Joi.object({
  currentPassword: Joi.string().min(8).max(128).required(),
  newPassword: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required()
});

const emailUpdateSchema = Joi.object({
  newEmail: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).max(128).required()
});

const billingAddressSchema = Joi.object({
  street: Joi.string().trim().min(2).max(120).required(),
  city: Joi.string().trim().min(2).max(80).required(),
  state: Joi.string().trim().min(2).max(80).required(),
  zipCode: Joi.string().trim().min(2).max(20).required(),
  country: Joi.string().trim().min(2).max(80).required()
});

const paymentMethodSchema = Joi.object({
  provider: Joi.string().trim().min(2).max(40).required(),
  brand: Joi.string().trim().min(2).max(40).required(),
  last4: Joi.string().trim().length(4).required(),
  expMonth: Joi.number().integer().min(1).max(12).required(),
  expYear: Joi.number().integer().min(2020).max(2100).required(),
  providerRef: Joi.string().trim().max(120).optional()
});

const subscriptionCadenceSchema = Joi.object({
  cadenceMonths: Joi.number().integer().min(1).max(6).required()
});

const subscriptionNextChargeSchema = Joi.object({
  nextBillingDate: Joi.date().iso().required()
});

const invoiceQuerySchema = Joi.object({
  reference: Joi.string().trim().max(120).optional(),
  status: Joi.string().valid('pending', 'paid', 'failed').optional(),
  from: Joi.date().iso().optional(),
  to: Joi.date().iso().optional()
});

const productCreateSchema = Joi.object({
  productId: Joi.string().trim().min(2).max(50).required(),
  name: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().max(1000).allow('').optional()
});

const skuCreateSchema = Joi.object({
  skuCode: Joi.string().trim().min(2).max(50).required(),
  productId: Joi.string().trim().min(2).max(50).required(),
  size: Joi.string().trim().uppercase().valid(...STOIK_SIZES).required(),
  color: Joi.string().trim().lowercase().valid(...STOIK_COLORS).required(),
  packCount: Joi.number().integer().min(1).max(12).required()
}).custom((value, helpers) => {
  if (!isValidColorQuantity(value.color, value.packCount)) {
    const allowed = getAllowedQuantities(value.color).join(', ');
    return helpers.message(`packCount ${value.packCount} is invalid for ${value.color}. Allowed: ${allowed}`);
  }
  return value;
});

const checkoutItemSchema = Joi.object({
  type: Joi.string().valid('plan').optional(),
  planId: Joi.string().trim().min(2).max(50).required(),
  quantity: Joi.number().integer().min(1).max(99).optional(),
  cadenceMonths: Joi.number().integer().min(1).max(6).optional()
});

const checkoutInitializeSchema = Joi.object({
  items: Joi.array().items(checkoutItemSchema).min(1).required(),
  cadenceMonths: Joi.number().integer().min(1).max(6).optional(),
  paymentMethod: Joi.string().valid('card', 'standard').optional(),
  customer: Joi.object({
    email: Joi.string().email().lowercase().trim().optional(),
    fullName: Joi.string().trim().max(120).optional(),
    phone: Joi.string().trim().max(50).optional()
  }).optional(),
  shipping: Joi.object({
    address: Joi.string().trim().max(200).optional(),
    city: Joi.string().trim().max(80).optional(),
    state: Joi.string().trim().max(80).optional(),
    zipCode: Joi.string().trim().max(20).optional(),
    country: Joi.string().trim().max(80).optional()
  }).optional()
});

module.exports = {
  validate,
  schemas: {
    register: registerSchema,
    login: loginSchema,
    subscription: subscriptionSchema,
    fitProfile: fitProfileSchema,
    objectId: objectIdSchema,
    passwordUpdate: passwordUpdateSchema,
    emailUpdate: emailUpdateSchema,
    billingAddress: billingAddressSchema,
    paymentMethod: paymentMethodSchema,
    subscriptionCadence: subscriptionCadenceSchema,
    subscriptionNextCharge: subscriptionNextChargeSchema,
    invoiceQuery: invoiceQuerySchema,
    productCreate: productCreateSchema,
    skuCreate: skuCreateSchema,
    checkoutInitialize: checkoutInitializeSchema
  }
};
