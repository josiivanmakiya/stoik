const express = require('express');
const Garment = require('../db/models/garment.model.js');
const ReturnRequest = require('../db/models/returnRequest.model.js');
const { sendError } = require('../utils/http');
const { requireAdmin } = require('../domain/auth/auth.middleware.js');
const {
  VERIFICATION_STATUS,
  GARMENT_STATUS,
  RETURN_PICKUP_STATUS,
  CREDIT_ENTRY_TYPE,
  CREDIT_ENTRY_SOURCE,
  STOIK_CREDIT_PER_GARMENT
} = require('../config/constants.js');
const { createCreditLedgerEntry } = require('../domain/credits/credit.service.js');

const router = express.Router();

const toObjectId = (user) => user?._id || user?.id;
const normalizeGarmentIds = (input) => (
  Array.isArray(input)
    ? Array.from(new Set(input.map((id) => String(id || '').trim().toUpperCase()).filter(Boolean)))
    : []
);

const computePotentialCredit = (garments) => garments.reduce((sum, garment) => {
  const color = garment.colorSnapshot || garment.skuId?.color;
  const credit = STOIK_CREDIT_PER_GARMENT[String(color || '').toLowerCase()] || 0;
  return sum + credit;
}, 0);

router.post('/quote', async (req, res) => {
  try {
    const userId = toObjectId(req.user);
    const garmentIds = normalizeGarmentIds(req.body?.garmentIds);
    if (!garmentIds.length) {
      return res.status(400).json({ error: 'garmentIds is required' });
    }

    const garments = await Garment.find({
      userId,
      garmentId: { $in: garmentIds },
      status: GARMENT_STATUS.ACTIVE
    }).populate('skuId', 'color');

    if (!garments.length) {
      return res.status(404).json({ error: 'No eligible garments found for quote' });
    }

    const potentialCredit = computePotentialCredit(garments);
    res.json({
      garmentCount: garments.length,
      potentialCredit,
      currency: 'NGN'
    });
  } catch (error) {
    return sendError(res, {
      status: 400,
      message: error.message || 'Failed to generate return quote',
      code: 'RETURN_QUOTE_FAILED',
      requestId: req.requestId
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = toObjectId(req.user);
    const isAdmin = req.user?.role === 'admin';
    if (!isAdmin && req.user?.verificationStatus !== VERIFICATION_STATUS.VERIFIED) {
      return res.status(403).json({ error: 'Verified Stoik account required to create returns' });
    }

    const garmentIds = normalizeGarmentIds(req.body?.garmentIds);
    if (!garmentIds.length) {
      return res.status(400).json({ error: 'garmentIds is required' });
    }

    const garments = await Garment.find({
      userId,
      garmentId: { $in: garmentIds },
      status: GARMENT_STATUS.ACTIVE
    }).populate('skuId', 'color');

    if (garments.length !== garmentIds.length) {
      return res.status(400).json({ error: 'One or more garments are not eligible for return' });
    }

    const potentialCredit = computePotentialCredit(garments);
    const returnRequest = await ReturnRequest.create({
      userId,
      subscriptionId: req.body?.subscriptionId,
      garmentIds,
      potentialCredit,
      scheduledPickupAt: req.body?.scheduledPickupAt || null,
      notes: req.body?.notes || ''
    });

    await Garment.updateMany(
      { userId, garmentId: { $in: garmentIds } },
      {
        status: GARMENT_STATUS.RETURN_REQUESTED,
        returnRequestId: returnRequest._id
      }
    );

    res.status(201).json(returnRequest);
  } catch (error) {
    return sendError(res, {
      status: 400,
      message: error.message || 'Failed to create return request',
      code: 'RETURN_CREATE_FAILED',
      requestId: req.requestId
    });
  }
});

router.get('/me', async (req, res) => {
  try {
    const userId = toObjectId(req.user);
    const requests = await ReturnRequest.find({ userId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    return sendError(res, {
      status: 400,
      message: error.message || 'Failed to fetch return requests',
      code: 'RETURN_LIST_FAILED',
      requestId: req.requestId
    });
  }
});

router.patch('/:id/picked-up', requireAdmin, async (req, res) => {
  try {
    const request = await ReturnRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Return request not found' });

    request.pickupStatus = RETURN_PICKUP_STATUS.PICKED_UP;
    await request.save();

    await Garment.updateMany(
      { userId: request.userId, garmentId: { $in: request.garmentIds } },
      { status: GARMENT_STATUS.RETURNED }
    );

    res.json(request);
  } catch (error) {
    return sendError(res, {
      status: 400,
      message: error.message || 'Failed to mark return request as picked up',
      code: 'RETURN_PICKUP_FAILED',
      requestId: req.requestId
    });
  }
});

router.patch('/:id/validate', requireAdmin, async (req, res) => {
  try {
    const request = await ReturnRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Return request not found' });
    if (request.pickupStatus === RETURN_PICKUP_STATUS.CLOSED) {
      return res.status(409).json({ error: 'Return request already closed' });
    }

    const approvedCredit = Number(req.body?.approvedCredit || request.potentialCredit || 0);
    if (!Number.isFinite(approvedCredit) || approvedCredit < 0) {
      return res.status(400).json({ error: 'approvedCredit must be a non-negative number' });
    }

    request.approvedCredit = approvedCredit;
    request.pickupStatus = RETURN_PICKUP_STATUS.CLOSED;
    request.completedAt = new Date();
    await request.save();

    await Garment.updateMany(
      { userId: request.userId, garmentId: { $in: request.garmentIds } },
      { status: GARMENT_STATUS.RECYCLED }
    );

    if (approvedCredit > 0) {
      await createCreditLedgerEntry({
        userId: request.userId,
        type: CREDIT_ENTRY_TYPE.EARN,
        source: CREDIT_ENTRY_SOURCE.RECYCLE_RETURN,
        amount: approvedCredit,
        referenceType: 'return_request',
        referenceId: request.requestId,
        description: `Recycled ${request.garmentIds.length} garment(s)`,
        metadata: {
          returnRequestId: request._id,
          garmentCount: request.garmentIds.length
        }
      });
    }

    res.json(request);
  } catch (error) {
    return sendError(res, {
      status: 400,
      message: error.message || 'Failed to validate return request',
      code: 'RETURN_VALIDATE_FAILED',
      requestId: req.requestId
    });
  }
});

module.exports = router;
