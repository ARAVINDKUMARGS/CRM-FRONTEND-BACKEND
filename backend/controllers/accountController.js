import Account from '../models/Account.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/errorHandler.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get all accounts
// @route   GET /api/accounts
// @access  Private
export const getAccounts = asyncHandler(async (req, res) => {
  const { type, industry, assignedTo, search } = req.query;
  const query = {};

  if (type) query.type = type;
  if (industry) query.industry = industry;
  if (assignedTo) query.assignedTo = assignedTo;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { industry: { $regex: search, $options: 'i' } },
    ];
  }

  if (req.user.role === 'Sales Executive') {
    query.assignedTo = req.user._id;
  }

  const accounts = await Account.find(query)
    .populate('assignedTo', 'firstName lastName email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: accounts.length,
    data: { accounts },
  });
});

// @desc    Get single account
// @route   GET /api/accounts/:id
// @access  Private
export const getAccount = asyncHandler(async (req, res) => {
  const account = await Account.findById(req.params.id).populate(
    'assignedTo',
    'firstName lastName email'
  );

  if (!account) {
    throw new AppError('Account not found', 404);
  }

  res.json({
    success: true,
    data: { account },
  });
});

// @desc    Create account
// @route   POST /api/accounts
// @access  Private
export const createAccount = asyncHandler(async (req, res) => {
  const account = await Account.create({
    ...req.body,
    assignedTo: req.body.assignedTo || req.user._id,
  });

  await account.populate('assignedTo', 'firstName lastName email');

  await logActivity(req.user._id, 'CREATE', 'Account', account._id, { name: account.name });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: { account },
  });
});

// @desc    Update account
// @route   PUT /api/accounts/:id
// @access  Private
export const updateAccount = asyncHandler(async (req, res) => {
  const account = await Account.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('assignedTo', 'firstName lastName email');

  if (!account) {
    throw new AppError('Account not found', 404);
  }

  await logActivity(req.user._id, 'UPDATE', 'Account', account._id, req.body);

  res.json({
    success: true,
    message: 'Account updated successfully',
    data: { account },
  });
});

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private
export const deleteAccount = asyncHandler(async (req, res) => {
  const account = await Account.findById(req.params.id);
  if (!account) {
    throw new AppError('Account not found', 404);
  }

  await Account.findByIdAndDelete(req.params.id);

  await logActivity(req.user._id, 'DELETE', 'Account', account._id, { name: account.name });

  res.json({
    success: true,
    message: 'Account deleted successfully',
  });
});
