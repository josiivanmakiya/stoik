const FitProfile = require('../../db/models/fitProfile.model.js');

const calculateSize = ({ chest, waist }) => {
  if (chest <= 92 && waist <= 78) return 'XS';
  if (chest <= 96 && waist <= 82) return 'S';
  if (chest <= 100 && waist <= 86) return 'M';
  if (chest <= 105 && waist <= 91) return 'L';
  if (chest <= 110 && waist <= 96) return 'XL';
  return 'XXL';
};

const upsertFitProfile = async (userId, measurements) => {
  const sizeLabel = calculateSize(measurements);
  return FitProfile.findOneAndUpdate(
    { userId },
    { ...measurements, sizeLabel, userId },
    { new: true, upsert: true }
  );
};

const getFitProfile = async (userId) => {
  return FitProfile.findOne({ userId });
};

module.exports = {
  calculateSize,
  upsertFitProfile,
  getFitProfile
};
