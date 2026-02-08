const Plan = require('../../db/models/plan.model.js');

const getPlanById = async function(planId) {
  return await Plan.findOne({ planId, isActive: true });
};

const getAllPlans = async function() {
  return await Plan.find({ isActive: true });
};

const createPlan = async function({ planId, name, monthlyPrice, unitsPerMonth, description, includedSkus }) {
  const existingPlan = await Plan.findOne({ planId });
  if (existingPlan) {
    throw new Error('Plan already exists');
  }

  const plan = new Plan({
    planId,
    name,
    monthlyPrice,
    unitsPerMonth: unitsPerMonth || 1,
    description: description || '',
    includedSkus: Array.isArray(includedSkus) ? includedSkus : []
  });

  return await plan.save();
};

const updatePlanPrice = async function(planId, newPrice) {
  const plan = await Plan.findOne({ planId });
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
