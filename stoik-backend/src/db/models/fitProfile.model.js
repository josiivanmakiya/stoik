const mongoose = require('mongoose');

const fitProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  chest: { type: Number, required: true },
  waist: { type: Number, required: true },
  hips: { type: Number, required: true },
  height: { type: Number, required: true },
  sizeLabel: { type: String, required: true }
}, {
  timestamps: true,
  collection: 'fit_profiles'
});

fitProfileSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('FitProfile', fitProfileSchema);
