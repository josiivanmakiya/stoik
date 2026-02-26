const SUBSCRIPTION_STATUS = {
  INACTIVE: 'inactive',
  ACTIVE: 'active',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
};

const STOIK_COLORS = ['white', 'grey', 'black'];
const STOIK_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const STOIK_PLAN_RULES = Object.freeze({
  white: [3, 6, 9],
  grey: [2],
  black: [2]
});

const VERIFICATION_STATUS = Object.freeze({
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
});

const GARMENT_STATUS = Object.freeze({
  ACTIVE: 'active',
  RETURN_REQUESTED: 'return_requested',
  RETURNED: 'returned',
  RECYCLED: 'recycled',
  REJECTED: 'rejected'
});

const RETURN_PICKUP_STATUS = Object.freeze({
  SCHEDULED: 'scheduled',
  PICKED_UP: 'picked_up',
  RECEIVED: 'received',
  VALIDATED: 'validated',
  CLOSED: 'closed'
});

const CREDIT_ENTRY_TYPE = Object.freeze({
  EARN: 'earn',
  SPEND: 'spend',
  REVERSE: 'reverse',
  EXPIRE: 'expire'
});

const CREDIT_ENTRY_SOURCE = Object.freeze({
  RECYCLE_RETURN: 'recycle_return',
  BILLING_AUTO_APPLY: 'billing_auto_apply',
  MANUAL_ADJUSTMENT: 'manual_adjustment'
});

const STOIK_CREDIT_PER_GARMENT = Object.freeze({
  white: 500,
  grey: 500,
  black: 500
});

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
  SECURITY_DEFAULTS,
  STOIK_COLORS,
  STOIK_SIZES,
  STOIK_PLAN_RULES,
  VERIFICATION_STATUS,
  GARMENT_STATUS,
  RETURN_PICKUP_STATUS,
  CREDIT_ENTRY_TYPE,
  CREDIT_ENTRY_SOURCE,
  STOIK_CREDIT_PER_GARMENT
};
