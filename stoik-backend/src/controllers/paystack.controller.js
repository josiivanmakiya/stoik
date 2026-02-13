const crypto = require('crypto');
const { SUBSCRIPTION_STATUS } = require('../config/constants.js');
const { paystackClient } = require('../config/paystack.js');
const Subscription = require('../db/models/subscription.model.js');
const Invoice = require('../db/models/invoice.model.js');

const ok = (res, data, status = 200) => res.status(status).json(data);
const fail = (res, message, status = 400) =>
  res.status(status).json({ success: false, message });

const parsePaystackDate = (value) => {
  if (!value) return null;
  const dt = new Date(value);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

const createPlan = async (req, res) => {
  try {
    const { name, amountKobo, interval = 'monthly', description } = req.body;
    if (!name || !amountKobo) {
      return fail(res, 'name and amountKobo are required');
    }

    const { data } = await paystackClient.post('/plan', {
      name,
      amount: Number(amountKobo),
      interval,
      description
    });

    return ok(res, data);
  } catch (error) {
    const message =
      error?.response?.data?.message || error.message || 'Failed to create plan';
    return fail(res, message);
  }
};

const initializeSubscription = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { email, planId } = req.body;
    const defaultPlanCode = process.env.PAYSTACK_DEFAULT_PLAN_CODE;

    if (!userId) return fail(res, 'userId not found on request');
    if (!email) return fail(res, 'email is required');
    if (!defaultPlanCode) {
      return fail(res, 'PAYSTACK_DEFAULT_PLAN_CODE is not configured', 500);
    }

    const { data } = await paystackClient.post('/transaction/initialize', {
      email,
      plan: defaultPlanCode,
      metadata: { userId, planId: planId || 'paystack' }
    });

    return ok(res, data);
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      'Failed to initialize subscription';
    return fail(res, message);
  }
};

const verifyTransaction = async (req, res) => {
  try {
    const { reference } = req.params;
    if (!reference) return fail(res, 'reference is required');

    const { data } = await paystackClient.get(`/transaction/verify/${reference}`);
    return ok(res, data);
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      'Failed to verify transaction';
    return fail(res, message);
  }
};

const upsertSubscriptionFromEvent = async (eventData, status) => {
  const userId = eventData?.customer?.metadata?.userId || eventData?.metadata?.userId;
  if (!userId) return null;

  const nextBillingDate = parsePaystackDate(
    eventData?.next_payment_date || eventData?.next_payment_date_time
  );

  const update = {
    userId,
    planId: eventData?.metadata?.planId || eventData?.plan?.plan_code || 'paystack',
    planName: eventData?.plan?.name || 'Stoik Plan',
    paystackPlanCode: eventData?.plan?.plan_code || eventData?.plan?.code || '',
    paystackSubscriptionCode:
      eventData?.subscription_code || eventData?.subscription?.subscription_code,
    paystackEmailToken: eventData?.email_token || eventData?.subscription?.email_token,
    authorizationCode:
      eventData?.authorization?.authorization_code ||
      eventData?.authorization_code ||
      null,
    status,
    nextBillingDate,
    metadata: eventData
  };

  if (!update.paystackPlanCode) {
    return null;
  }

  return Subscription.findOneAndUpdate(
    {
      userId,
      paystackPlanCode: update.paystackPlanCode
    },
    { $set: update, $setOnInsert: { startDate: new Date() } },
    { upsert: true, new: true }
  );
};

const upsertInvoiceFromEvent = async (eventData, status, paid) => {
  const userId =
    eventData?.customer?.metadata?.userId ||
    eventData?.subscription?.customer?.metadata?.userId ||
    eventData?.metadata?.userId;
  if (!userId) return null;

  const sub = await Subscription.findOne({
    userId,
    paystackSubscriptionCode:
      eventData?.subscription?.subscription_code || eventData?.subscription_code,
  });

  const amount = Number(
    eventData?.amount || eventData?.charged_amount || eventData?.invoice?.amount || 0
  );

  return Invoice.findOneAndUpdate(
    {
      user: userId,
      paystackInvoiceCode: eventData?.invoice_code || eventData?.invoice?.invoice_code,
    },
    {
      $set: {
        subscription: sub?._id,
        amount,
        status,
        paid,
        paidAt: paid ? new Date() : null,
        dueDate: parsePaystackDate(eventData?.due_date),
        paystackReference: eventData?.reference || eventData?.transaction?.reference,
        rawEvent: eventData
      },
      $setOnInsert: {
        currency: 'NGN'
      },
    },
    { upsert: true, new: true }
  );
};

const paystackWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-paystack-signature"];
    if (!signature) return res.status(400).send('Missing signature');

    const payload =
      Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}));

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(payload)
      .digest("hex");

    if (hash !== signature) return res.status(400).send('Invalid signature');

    const event = Buffer.isBuffer(req.body)
      ? JSON.parse(req.body.toString("utf8"))
      : req.body;

    switch (event.event) {
      case "subscription.create":
      case "subscription.not_renew":
        await upsertSubscriptionFromEvent(event.data, SUBSCRIPTION_STATUS.ACTIVE);
        break;
      case "subscription.disable":
        await upsertSubscriptionFromEvent(event.data, SUBSCRIPTION_STATUS.CANCELLED);
        break;
      case "invoice.payment_failed":
        await upsertSubscriptionFromEvent(event.data, SUBSCRIPTION_STATUS.PAUSED);
        await upsertInvoiceFromEvent(event.data, 'failed', false);
        break;
      case "invoice.create":
        await upsertInvoiceFromEvent(event.data, 'pending', false);
        break;
      case "invoice.update":
      case "invoice.payment_success":
        await upsertSubscriptionFromEvent(event.data, SUBSCRIPTION_STATUS.ACTIVE);
        await upsertInvoiceFromEvent(event.data, 'paid', true);
        break;
      default:
        break;
    }

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error.message || 'Webhook handler failed');
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { subscriptionCode, emailToken } = req.body;

    if (!subscriptionCode || !emailToken) {
      return fail(res, 'subscriptionCode and emailToken are required');
    }

    const { data } = await paystackClient.post('/subscription/disable', {
      code: subscriptionCode,
      token: emailToken
    });

    if (userId) {
      await Subscription.findOneAndUpdate(
        { userId, paystackSubscriptionCode: subscriptionCode },
        { $set: { status: SUBSCRIPTION_STATUS.CANCELLED, cancelledAt: new Date() } },
        { new: true }
      );
    }

    return ok(res, data);
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      'Failed to cancel subscription';
    return fail(res, message);
  }
};

module.exports = {
  createPlan,
  initializeSubscription,
  verifyTransaction,
  paystackWebhook,
  cancelSubscription
};
