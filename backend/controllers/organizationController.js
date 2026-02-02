import Organization from '../models/Organization.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/errorHandler.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get organization settings
// @route   GET /api/organization
// @access  Private
export const getOrganization = asyncHandler(async (req, res) => {
  const organization = await Organization.getOrganization();

  res.json({
    success: true,
    data: { organization },
  });
});

// @desc    Update organization settings
// @route   PUT /api/organization
// @access  Private (Admin only)
export const updateOrganization = asyncHandler(async (req, res) => {
  const organization = await Organization.getOrganization();

  const updatedFields = {
    companyName: req.body.companyName,
    companyEmail: req.body.companyEmail,
    companyPhone: req.body.companyPhone,
    address: req.body.address,
    currency: req.body.currency,
    timezone: req.body.timezone,
    workingHours: req.body.workingHours,
    holidays: req.body.holidays,
    logo: req.body.logo,
    website: req.body.website,
  };

  Object.keys(updatedFields).forEach(
    (key) => updatedFields[key] === undefined && delete updatedFields[key]
  );

  const updated = await Organization.findByIdAndUpdate(
    organization._id,
    updatedFields,
    { new: true, runValidators: true }
  );

  await logActivity(
    req.user._id,
    'UPDATE',
    'Organization',
    updated._id,
    updatedFields
  );

  res.json({
    success: true,
    message: 'Organization updated successfully',
    data: { organization: updated },
  });
});
