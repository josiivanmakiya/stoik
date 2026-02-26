const { STOIK_PLAN_RULES } = require('../../config/constants.js');

const normalizeColor = (color) => String(color || '').trim().toLowerCase();

const getAllowedQuantities = (color) => {
  const normalizedColor = normalizeColor(color);
  return STOIK_PLAN_RULES[normalizedColor] || [];
};

const isValidColorQuantity = (color, quantity) => {
  const allowed = getAllowedQuantities(color);
  const normalizedQuantity = Number(quantity);
  return Number.isFinite(normalizedQuantity) && allowed.includes(normalizedQuantity);
};

const assertValidColorQuantity = (color, quantity, label = 'configuration') => {
  if (!isValidColorQuantity(color, quantity)) {
    const allowed = getAllowedQuantities(color);
    throw new Error(`Invalid ${label}: ${normalizeColor(color)} does not support ${quantity}. Allowed: ${allowed.join(', ')}`);
  }
};

const getPlanQuantity = (plan) => {
  const quantity = Number(plan?.monthlyQuantity ?? plan?.unitsPerMonth ?? 0);
  return Number.isFinite(quantity) ? quantity : 0;
};

const assertValidPlanDocument = (plan, label = 'plan configuration') => {
  assertValidColorQuantity(plan?.color, getPlanQuantity(plan), label);
};

module.exports = {
  normalizeColor,
  getAllowedQuantities,
  isValidColorQuantity,
  assertValidColorQuantity,
  getPlanQuantity,
  assertValidPlanDocument
};
