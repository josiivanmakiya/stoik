const Subscription = require('../db/models/subscription.model.js');

const requireActiveSubscription = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.params.userId || req.body.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const sub = await Subscription.findOne({ userId }).sort({ createdAt: -1 });
    if (!sub || sub.status !== 'active') {
      return res.status(403).json({ message: 'Subscription required' });
    }

    req.subscription = sub;
    return next();
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Subscription check failed' });
  }
};

module.exports = requireActiveSubscription;
