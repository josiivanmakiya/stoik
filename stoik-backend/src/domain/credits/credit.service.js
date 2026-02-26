const User = require('../../db/models/user.model.js');
const CreditLedger = require('../../db/models/creditLedger.model.js');
const { CREDIT_ENTRY_TYPE } = require('../../config/constants.js');

const normalizeSignedAmount = (type, amount) => {
  const value = Number(amount || 0);
  if (!Number.isFinite(value) || value === 0) throw new Error('Invalid credit amount');

  if (type === CREDIT_ENTRY_TYPE.EARN) return Math.abs(value);
  if (type === CREDIT_ENTRY_TYPE.SPEND || type === CREDIT_ENTRY_TYPE.EXPIRE) return -Math.abs(value);
  return value;
};

const createCreditLedgerEntry = async ({
  userId,
  type,
  source,
  amount,
  currency = 'NGN',
  referenceType = 'manual',
  referenceId,
  description,
  metadata
}) => {
  const signedAmount = normalizeSignedAmount(type, amount);
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const nextBalance = Math.max(0, Number(user.stoikCreditBalance || 0) + signedAmount);
  if (signedAmount < 0 && nextBalance === 0 && Math.abs(signedAmount) > Number(user.stoikCreditBalance || 0)) {
    throw new Error('Insufficient credits');
  }

  const ledgerEntry = await CreditLedger.create({
    userId,
    type,
    source,
    amount: signedAmount,
    currency,
    referenceType,
    referenceId,
    description,
    metadata
  });

  user.stoikCreditBalance = nextBalance;
  await user.save();

  return { ledgerEntry, balance: nextBalance };
};

const getCreditBalance = async (userId) => {
  const user = await User.findById(userId).select('stoikCreditBalance autoApplyCredits verificationStatus');
  if (!user) throw new Error('User not found');
  return {
    balance: Number(user.stoikCreditBalance || 0),
    autoApplyCredits: Boolean(user.autoApplyCredits),
    verificationStatus: user.verificationStatus
  };
};

const listCreditLedger = async (userId, { limit = 50, type } = {}) => {
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 50));
  const filter = { userId };
  if (type) filter.type = type;
  return CreditLedger.find(filter).sort({ createdAt: -1 }).limit(safeLimit);
};

const setAutoApplyCredits = async (userId, enabled) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { autoApplyCredits: Boolean(enabled) },
    { new: true }
  ).select('autoApplyCredits');
  if (!user) throw new Error('User not found');
  return user.autoApplyCredits;
};

module.exports = {
  createCreditLedgerEntry,
  getCreditBalance,
  listCreditLedger,
  setAutoApplyCredits
};
