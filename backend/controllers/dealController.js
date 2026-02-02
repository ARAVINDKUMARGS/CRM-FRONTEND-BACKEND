import Deal from '../models/Deal.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/errorHandler.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get all deals
// @route   GET /api/deals
// @access  Private
export const getDeals = asyncHandler(async (req, res) => {
  const { stage, assignedTo, search } = req.query;
  const query = {};

  if (stage) query.stage = stage;
  if (assignedTo) query.assignedTo = assignedTo;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (req.user.role === 'Sales Executive') {
    query.assignedTo = req.user._id;
  }

  const deals = await Deal.find(query)
    .populate('account', 'name email')
    .populate('contact', 'firstName lastName email')
    .populate('assignedTo', 'firstName lastName email')
    .populate('source', 'name type')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: deals.length,
    data: { deals },
  });
});

// @desc    Get single deal
// @route   GET /api/deals/:id
// @access  Private
export const getDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id)
    .populate('account', 'name email')
    .populate('contact', 'firstName lastName email')
    .populate('assignedTo', 'firstName lastName email')
    .populate('source', 'name type');

  if (!deal) {
    throw new AppError('Deal not found', 404);
  }

  res.json({
    success: true,
    data: { deal },
  });
});

// @desc    Create deal
// @route   POST /api/deals
// @access  Private
export const createDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.create({
    ...req.body,
    assignedTo: req.body.assignedTo || req.user._id,
  });

  await deal.populate('account', 'name email');
  await deal.populate('contact', 'firstName lastName email');
  await deal.populate('assignedTo', 'firstName lastName email');

  await logActivity(req.user._id, 'CREATE', 'Deal', deal._id, {
    name: deal.name,
    value: deal.value,
  });

  res.status(201).json({
    success: true,
    message: 'Deal created successfully',
    data: { deal },
  });
});

// @desc    Update deal
// @route   PUT /api/deals/:id
// @access  Private
export const updateDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) {
    throw new AppError('Deal not found', 404);
  }

  const oldStage = deal.stage;
  const oldAssignedTo = deal.assignedTo?.toString();

  const updatedDeal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('account', 'name email')
    .populate('contact', 'firstName lastName email')
    .populate('assignedTo', 'firstName lastName email');

  // Notification for stage change
  if (req.body.stage && req.body.stage !== oldStage) {
    await Notification.create({
      user: updatedDeal.assignedTo?._id || req.user._id,
      type: 'Deal Stage Change',
      title: 'Deal Stage Updated',
      message: `Deal "${updatedDeal.name}" moved to ${req.body.stage}`,
      relatedTo: { entityType: 'Deal', entityId: updatedDeal._id },
      priority: 'High',
    });
  }

  // Notification for reassignment
  if (req.body.assignedTo && req.body.assignedTo !== oldAssignedTo && req.body.assignedTo !== req.user._id.toString()) {
    await Notification.create({
      user: req.body.assignedTo,
      type: 'Deal Stage Change',
      title: 'Deal Reassigned',
      message: `You have been assigned deal: ${updatedDeal.name}`,
      relatedTo: { entityType: 'Deal', entityId: updatedDeal._id },
      priority: 'High',
    });
  }

  await logActivity(req.user._id, 'UPDATE', 'Deal', updatedDeal._id, req.body);

  res.json({
    success: true,
    message: 'Deal updated successfully',
    data: { deal: updatedDeal },
  });
});

// @desc    Delete deal
// @route   DELETE /api/deals/:id
// @access  Private
export const deleteDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) {
    throw new AppError('Deal not found', 404);
  }

  await Deal.findByIdAndDelete(req.params.id);

  await logActivity(req.user._id, 'DELETE', 'Deal', deal._id, { name: deal.name });

  res.json({
    success: true,
    message: 'Deal deleted successfully',
  });
});
