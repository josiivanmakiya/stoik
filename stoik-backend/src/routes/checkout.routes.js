const express = require('express');
const logger = require('../config/logger');
const Plan = require('../db/models/plan.model.js');
const Consumable = require('../db/models/consumable.model.js');
const Order = require('../db/models/order.model.js');
const { subscribeUser, activateSubscription } = require('../domain/subscription/subscription.service.js');
const { validate, schemas } = require('../middleware/validation.middleware');
const { sendError } = require('../utils/http');

const router = express.Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const PAYSTACK_CALLBACK_URL = process.env.PAYSTACK_CALLBACK_URL || `${FRONTEND_URL}/success`;

const toKobo = (amount) => Math.round(Number(amount || 0) * 100);

const clampCadence = (value) => {
  const parsed = Number(value || 1);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(6, Math.max(1, Math.round(parsed)));
};

const normalizePaymentMethod = (value) => (value === 'standard' ? 'standard' : 'card');
const deriveSubscriptionCadence = (items = [], fallback = 1) => {
  const cadenceValues = items.map((item) => clampCadence(item.cadenceMonths || fallback));
  if (!cadenceValues.length) return clampCadence(fallback);
  return Math.min(...cadenceValues);
};

const normalizeItems = async (items = []) => {
  const normalized = [];
  const seen = new Set();

  for (const raw of items) {
    if (!raw) continue;

    const type = raw.type === 'consumable' || raw.consumableId ? 'consumable' : 'plan';

    if (type === 'plan') {
      if (!raw.planId) continue;
      const key = `plan:${raw.planId}`;
      if (seen.has(key)) continue;

      const plan = await Plan.findOne({ planId: raw.planId, isActive: true });
      if (!plan) continue;

      const quantity = Math.max(1, Math.min(99, Number(raw.quantity) || 1));
      normalized.push({
        type: 'plan',
        itemRef: plan.planId,
        planId: plan.planId,
        name: plan.name,
        unitPrice: plan.monthlyPrice,
        quantity,
        cadenceMonths: clampCadence(raw.cadenceMonths || 1)
      });
      seen.add(key);
      continue;
    }

    if (!raw.consumableId) continue;
    const key = `consumable:${raw.consumableId}`;
    if (seen.has(key)) continue;

    const consumable = await Consumable.findOne({ consumableId: raw.consumableId, isActive: true });
    if (!consumable) continue;

    const quantity = Math.max(1, Math.min(99, Number(raw.quantity) || 1));
    normalized.push({
      type: 'consumable',
      itemRef: consumable.consumableId,
      consumableId: consumable.consumableId,
      name: consumable.name,
      category: consumable.category,
      tooltip: consumable.tooltip,
      unitPrice: consumable.unitPrice,
      quantity,
      cadenceMonths: clampCadence(raw.cadenceMonths || consumable.defaultCadenceMonths || 1)
    });
    seen.add(key);
  }

  return normalized;
};

const initializePaystack = async (payload) => {
  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!data.status) {
    throw new Error(data.message || 'Paystack initialization failed');
  }

  return data.data;
};

const verifyPaystack = async (reference) => {
  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
    }
  });

  const data = await res.json();
  if (!data.status) {
    throw new Error(data.message || 'Paystack verification failed');
  }

  return data.data;
};

const createOrAttachSubscription = async (order) => {
  if (order.subscriptionId || !order.userId || !order.items.length) {
    return order.subscriptionId || null;
  }

  const fallbackPlanId = order.items.find((item) => item.type === 'plan')?.planId || 'custom-bag';
  const subscription = await subscribeUser({
    userId: order.userId,
    planId: fallbackPlanId,
    cadenceMonths: deriveSubscriptionCadence(order.items, order.cadenceMonths || 1),
    bagSnapshot: order.items.map((item) => ({
      type: item.type,
      itemRef: item.itemRef,
      planId: item.planId,
      consumableId: item.consumableId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      cadenceMonths: clampCadence(item.cadenceMonths || order.cadenceMonths || 1)
    }))
  });

  const active = await activateSubscription(subscription._id);
  order.subscriptionId = active._id;
  await order.save();
  return active._id;
};

router.post('/initialize', validate(schemas.checkoutInitialize), async (req, res) => {
  const requestLogger = logger.addRequestId(req.requestId);

  try {
    const userId = req.user?._id || req.user?.id || null;
    const customer = req.body?.customer || {};
    const shipping = req.body?.shipping || {};
    const cadenceMonths = clampCadence(req.body?.cadenceMonths);
    const paymentMethod = normalizePaymentMethod(req.body?.paymentMethod);
    const items = await normalizeItems(req.body?.items || []);

    if (!items.length) {
      return res.status(400).json({ error: 'Bag is empty' });
    }

    const email = customer.email || req.user?.email;
    if (!email) {
      return res.status(400).json({ error: 'Customer email is required' });
    }

    const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const amount = toKobo(total);
    const reference = `stoik_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    const order = await Order.create({
      userId,
      email,
      amount,
      cadenceMonths,
      currency: 'NGN',
      reference,
      status: paymentMethod === 'card' ? 'pending' : 'paid',
      items,
      shipping: {
        address: shipping.address,
        city: shipping.city,
        state: shipping.state,
        zipCode: shipping.zipCode,
        country: shipping.country || 'NG'
      },
      customer: {
        fullName: customer.fullName,
        phone: customer.phone
      },
      paymentMethod,
      provider: paymentMethod === 'card' ? 'paystack' : 'standard'
    });

    if (paymentMethod === 'standard') {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required', code: 'AUTH_ADMIN_REQUIRED' });
      }
      const subscriptionId = await createOrAttachSubscription(order);
      return res.json({
        authorization_url: `${FRONTEND_URL}/success?reference=${reference}`,
        reference,
        subscriptionId
      });
    }

    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ error: 'Paystack is not configured' });
    }

    const paystackPayload = {
      email,
      amount,
      currency: 'NGN',
      reference,
      callback_url: PAYSTACK_CALLBACK_URL,
      metadata: {
        orderId: order._id.toString(),
        itemCount: items.length,
        cadenceMonths
      }
    };

    const paystackData = await initializePaystack(paystackPayload);

    order.providerData = {
      access_code: paystackData.access_code,
      paystack_reference: paystackData.reference
    };
    await order.save();

    res.json({
      authorization_url: paystackData.authorization_url,
      reference: paystackData.reference
    });
  } catch (error) {
    requestLogger.error('Failed to initialize checkout', { error: error.message });
    return sendError(res, {
      status: 500,
      message: 'Failed to initialize checkout',
      code: 'CHECKOUT_INIT_FAILED',
      requestId: req.requestId
    });
  }
});

router.get('/verify/:reference', async (req, res) => {
  const requestLogger = logger.addRequestId(req.requestId);

  try {
    const { reference } = req.params;
    const order = await Order.findOne({ reference });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.paymentMethod === 'standard' || order.provider === 'standard') {
      const subscriptionId = await createOrAttachSubscription(order);
      return res.json({ status: 'success', orderId: order._id, subscriptionId });
    }

    if (order.status === 'paid') {
      return res.json({ status: 'success', orderId: order._id, subscriptionId: order.subscriptionId || null });
    }

    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ error: 'Paystack is not configured' });
    }

    const verification = await verifyPaystack(reference);

    if (verification.status !== 'success') {
      order.status = 'failed';
      order.providerData = { ...order.providerData, verification };
      await order.save();
      return res.status(402).json({ status: 'failed', message: 'Payment not successful' });
    }

    if (verification.amount !== order.amount) {
      order.status = 'failed';
      order.providerData = { ...order.providerData, verification };
      await order.save();
      return res.status(400).json({ status: 'failed', message: 'Amount mismatch' });
    }

    order.status = 'paid';
    order.providerData = { ...order.providerData, verificationId: verification.id };
    await order.save();

    const subscriptionId = await createOrAttachSubscription(order);

    res.json({ status: 'success', orderId: order._id, subscriptionId });
  } catch (error) {
    requestLogger.error('Failed to verify checkout', { error: error.message });
    return sendError(res, {
      status: 500,
      message: 'Verification failed',
      code: 'CHECKOUT_VERIFY_FAILED',
      requestId: req.requestId
    });
  }
});

module.exports = router;
