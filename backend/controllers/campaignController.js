import Campaign from '../models/Campaign.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/errorHandler.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Private
export const getCampaigns = asyncHandler(async (req, res) => {
  const { status, type, search } = req.query;
  const query = {};

  if (status) query.status = status;
  if (type) query.type = type;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const campaigns = await Campaign.find(query)
    .populate('createdBy', 'firstName lastName email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: campaigns.length,
    data: { campaigns },
  });
});

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Private
export const getCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id).populate(
    'createdBy',
    'firstName lastName email'
  );

  if (!campaign) {
    throw new AppError('Campaign not found', 404);
  }

  res.json({
    success: true,
    data: { campaign },
  });
});

// @desc    Create campaign
// @route   POST /api/campaigns
// @access  Private (Marketing Executive, Admin)
export const createCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.create({
    ...req.body,
    createdBy: req.user._id,
  });

  await campaign.populate('createdBy', 'firstName lastName email');

  await logActivity(req.user._id, 'CREATE', 'Campaign', campaign._id, {
    name: campaign.name,
  });

  res.status(201).json({
    success: true,
    message: 'Campaign created successfully',
    data: { campaign },
  });
});

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private
export const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('createdBy', 'firstName lastName email');

  if (!campaign) {
    throw new AppError('Campaign not found', 404);
  }

  await logActivity(req.user._id, 'UPDATE', 'Campaign', campaign._id, req.body);

  res.json({
    success: true,
    message: 'Campaign updated successfully',
    data: { campaign },
  });
});

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private
export const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    throw new AppError('Campaign not found', 404);
  }

  await Campaign.findByIdAndDelete(req.params.id);

  await logActivity(req.user._id, 'DELETE', 'Campaign', campaign._id, {
    name: campaign.name,
  });

  res.json({
    success: true,
    message: 'Campaign deleted successfully',
  });
});
