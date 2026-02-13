const Plan = require('../../db/models/plan.model.js');

const normalizePlanId = function(planId) {
  return String(planId || '').trim().toLowerCase();
};

const getPlanById = async function(planId) {
  return await Plan.findOne({ planId: normalizePlanId(planId), isActive: true });
};

const getAllPlans = async function() {
  return await Plan.find({ isActive: true });
};

const createPlan = async function({ planId, name, monthlyPrice, unitsPerMonth, description, includedSkus }) {
  const normalizedPlanId = normalizePlanId(planId);
  const existingPlan = await Plan.findOne({ planId: normalizedPlanId });
  if (existingPlan) {
    throw new Error('Plan already exists');
  }

  const plan = new Plan({
    planId: normalizedPlanId,
    name,
    monthlyPrice,
    unitsPerMonth: unitsPerMonth || 1,
    description: description || '',
    includedSkus: Array.isArray(includedSkus) ? includedSkus : []
  });

  try {
    return await plan.save();
  } catch (error) {
    if (error && error.code === 11000) {
      throw new Error('Plan already exists');
    }
    throw error;
  }
};

const updatePlanPrice = async function(planId, newPrice) {
  const normalizedPlanId = normalizePlanId(planId);
  const plan = await Plan.findOne({ planId: normalizedPlanId });
  if (!plan) {
    throw new Error('Plan not found');
  }

  plan.monthlyPrice = newPrice;
  return await plan.save();
};

module.exports = {
  getPlanById,
  getAllPlans,
  createPlan,
  updatePlanPrice
};
