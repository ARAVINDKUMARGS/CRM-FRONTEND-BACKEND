import AuditLog from '../models/AuditLog.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get audit logs
// @route   GET /api/audit-logs
// @access  Private (Admin only)
export const getAuditLogs = asyncHandler(async (req, res) => {
  const { userId, action, entityType, startDate, endDate, limit = 100 } = req.query;
  const query = {};

  if (userId) query.userId = userId;
  if (action) query.action = action;
  if (entityType) query.entityType = entityType;
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const logs = await AuditLog.find(query)
    .populate('userId', 'firstName lastName email role')
    .sort({ timestamp: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    count: logs.length,
    data: { logs },
  });
});
