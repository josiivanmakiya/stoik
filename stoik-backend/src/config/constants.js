const SUBSCRIPTION_STATUS = {
  INACTIVE: 'inactive',
  ACTIVE: 'active',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
};

const SECURITY_DEFAULTS = {
  JSON_LIMIT: process.env.JSON_LIMIT || '1mb',
  URLENCODED_LIMIT: process.env.URLENCODED_LIMIT || '1mb',
  URLENCODED_PARAMETER_LIMIT: Number(process.env.URLENCODED_PARAMETER_LIMIT || 100),
  REQUEST_TIMEOUT_MS: Number(process.env.REQUEST_TIMEOUT_MS || 15000),
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX || 100),
  AUTH_RATE_LIMIT_MAX: Number(process.env.AUTH_RATE_LIMIT_MAX || 5),
  CHECKOUT_RATE_LIMIT_MAX: Number(process.env.CHECKOUT_RATE_LIMIT_MAX || 20)
};

module.exports = {
  SUBSCRIPTION_STATUS,
  SECURITY_DEFAULTS
};
