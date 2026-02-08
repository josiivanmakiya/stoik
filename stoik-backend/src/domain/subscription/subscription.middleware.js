const { SUBSCRIPTION_STATUS } = require('../../config/constants.js');
const Subscription = require('../../db/models/subscription.model.js');

/**
 * REQUIRE ACTIVE SUBSCRIPTION MIDDLEWARE
 * Blocks access if user doesn't have an active subscription
 * 
 * Usage:
 * router.get('/protected-route', authenticateToken, requireActiveSubscription, handler);
 */
const requireActiveSubscription = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Find user's active subscription
    const subscription = await Subscription.findOne({
      userId,
      status: SUBSCRIPTION_STATUS.ACTIVE
    });

    if (!subscription) {
      return res.status(403).json({
        error: 'Active subscription required',
        code: 'SUBSCRIPTION_REQUIRED',
        message: 'You need an active subscription to access this resource'
      });
    }

    // Attach subscription to request for use in route handlers
    req.subscription = subscription;
    next();
  } catch (error) {
    console.error('Error in requireActiveSubscription middleware:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * CHECK SUBSCRIPTION STATUS MIDDLEWARE
 * Allows access but attaches subscription status to request
 * Useful for routes that need to know subscription status but don't require active subscription
 * 
 * Usage:
 * router.get('/route', authenticateToken, checkSubscriptionStatus, handler);
 */
const checkSubscriptionStatus = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (!userId) {
      req.subscriptionStatus = null;
      return next();
    }

    // Find user's subscription (any status)
    const subscription = await Subscription.findOne({ userId })
      .sort({ createdAt: -1 }); // Get most recent

    req.subscription = subscription;
    req.subscriptionStatus = subscription ? subscription.status : null;
    next();
  } catch (error) {
    console.error('Error in checkSubscriptionStatus middleware:', error);
    req.subscriptionStatus = null;
    next();
  }
};

/**
 * BLOCK INACTIVE USERS MIDDLEWARE
 * Blocks access for users with inactive, paused, cancelled, or expired subscriptions
 * 
 * Usage:
 * router.post('/some-protected-route', authenticateToken, blockInactiveUsers, handler);
 */
const blockInactiveUsers = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Find user's subscription
    const subscription = await Subscription.findOne({ userId })
      .sort({ createdAt: -1 });

    if (!subscription) {
      return res.status(403).json({
        error: 'Subscription required',
        code: 'NO_SUBSCRIPTION',
        message: 'You need to subscribe to access this resource'
      });
    }

    // Block inactive, paused, cancelled, and expired users
    const blockedStatuses = [
      SUBSCRIPTION_STATUS.INACTIVE,
      SUBSCRIPTION_STATUS.PAUSED,
      SUBSCRIPTION_STATUS.CANCELLED,
      SUBSCRIPTION_STATUS.EXPIRED
    ];

    if (blockedStatuses.includes(subscription.status)) {
      return res.status(403).json({
        error: 'Subscription not active',
        code: 'SUBSCRIPTION_INACTIVE',
        message: `Your subscription is ${subscription.status}. Please renew to continue.`,
        subscriptionStatus: subscription.status
      });
    }

    // Allow active users
    req.subscription = subscription;
    next();
  } catch (error) {
    console.error('Error in blockInactiveUsers middleware:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

module.exports = {
  requireActiveSubscription,
  checkSubscriptionStatus,
  blockInactiveUsers
};
