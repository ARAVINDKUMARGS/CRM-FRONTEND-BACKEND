import Communication from '../models/Communication.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/errorHandler.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get communications for an entity
// @route   GET /api/communications/:entityType/:entityId
// @access  Private
export const getCommunications = asyncHandler(async (req, res) => {
  const { entityType, entityId } = req.params;

  const validTypes = ['Lead', 'Contact', 'Account', 'Deal'];
  if (!validTypes.includes(entityType)) {
    throw new AppError('Invalid entity type', 400);
  }

  const communications = await Communication.find({
    'relatedTo.entityType': entityType,
    'relatedTo.entityId': entityId,
  })
    .populate('createdBy', 'firstName lastName email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: communications.length,
    data: { communications },
  });
});

// @desc    Create communication
// @route   POST /api/communications
// @access  Private
export const createCommunication = asyncHandler(async (req, res) => {
  const { type, subject, content, relatedTo, direction, duration, attachments } = req.body;

  const communication = await Communication.create({
    type,
    subject,
    content,
    relatedTo,
    direction: direction || 'Outbound',
    duration,
    attachments,
    createdBy: req.user._id,
  });

  await communication.populate('createdBy', 'firstName lastName email');

  await logActivity(req.user._id, 'CREATE', 'Communication', communication._id, {
    type,
    entityType: relatedTo.entityType,
  });

  res.status(201).json({
    success: true,
    message: 'Communication logged successfully',
    data: { communication },
  });
});

// @desc    Update communication
// @route   PUT /api/communications/:id
// @access  Private
export const updateCommunication = asyncHandler(async (req, res) => {
  const communication = await Communication.findById(req.params.id);
  if (!communication) {
    throw new AppError('Communication not found', 404);
  }

  // Only creator can update
  if (communication.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'System Admin') {
    throw new AppError('Access denied', 403);
  }

  const updatedCommunication = await Communication.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate('createdBy', 'firstName lastName email');

  await logActivity(req.user._id, 'UPDATE', 'Communication', updatedCommunication._id, req.body);

  res.json({
    success: true,
    message: 'Communication updated successfully',
    data: { communication: updatedCommunication },
  });
});

// @desc    Delete communication
// @route   DELETE /api/communications/:id
// @access  Private
export const deleteCommunication = asyncHandler(async (req, res) => {
  const communication = await Communication.findById(req.params.id);
  if (!communication) {
    throw new AppError('Communication not found', 404);
  }

  // Only creator or admin can delete
  if (communication.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'System Admin') {
    throw new AppError('Access denied', 403);
  }

  await Communication.findByIdAndDelete(req.params.id);

  await logActivity(req.user._id, 'DELETE', 'Communication', communication._id);

  res.json({
    success: true,
    message: 'Communication deleted successfully',
  });
});
