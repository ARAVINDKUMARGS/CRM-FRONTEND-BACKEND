import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/errorHandler.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin, Sales Manager)
export const getUsers = asyncHandler(async (req, res) => {
  const { role, isActive, search } = req.query;
  const query = {};

  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query).select('-password -refreshToken').sort({ createdAt: -1 });

  res.json({
    success: true,
    count: users.length,
    data: { users },
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -refreshToken');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: { user },
  });
});

// @desc    Create user
// @route   POST /api/users
// @access  Private (Admin only)
export const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, mobile, password, role, isActive } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
  if (existingUser) {
    throw new AppError('User with this email or mobile already exists', 400);
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    mobile,
    password,
    role: role || 'Sales Executive',
    isActive: isActive !== undefined ? isActive : true,
  });

  await logActivity(req.user._id, 'CREATE', 'User', user._id, { email, role });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        isActive: user.isActive,
      },
    },
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin only, or self)
export const updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, mobile, role, isActive } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if email/mobile already exists (excluding current user)
  if (email || mobile) {
    const existingUser = await User.findOne({
      _id: { $ne: req.params.id },
      $or: [{ email }, { mobile }],
    });
    if (existingUser) {
      throw new AppError('Email or mobile already in use', 400);
    }
  }

  const updateFields = {};
  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  if (email) updateFields.email = email.toLowerCase();
  if (mobile) updateFields.mobile = mobile;
  if (role && req.user.role === 'System Admin') updateFields.role = role;
  if (isActive !== undefined && req.user.role === 'System Admin')
    updateFields.isActive = isActive;

  const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
    runValidators: true,
  }).select('-password -refreshToken');

  await logActivity(req.user._id, 'UPDATE', 'User', updatedUser._id, updateFields);

  res.json({
    success: true,
    message: 'User updated successfully',
    data: { user: updatedUser },
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user._id.toString() === req.user._id.toString()) {
    throw new AppError('Cannot delete your own account', 400);
  }

  await User.findByIdAndDelete(req.params.id);

  await logActivity(req.user._id, 'DELETE', 'User', user._id, { email: user.email });

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});
