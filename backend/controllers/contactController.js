import Contact from '../models/Contact.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/errorHandler.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
export const getContacts = asyncHandler(async (req, res) => {
  const { account, assignedTo, search } = req.query;
  const query = {};

  if (account) query.account = account;
  if (assignedTo) query.assignedTo = assignedTo;
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { jobTitle: { $regex: search, $options: 'i' } },
    ];
  }

  if (req.user.role === 'Sales Executive') {
    query.assignedTo = req.user._id;
  }

  const contacts = await Contact.find(query)
    .populate('account', 'name email')
    .populate('assignedTo', 'firstName lastName email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: contacts.length,
    data: { contacts },
  });
});

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private
export const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)
    .populate('account', 'name email')
    .populate('assignedTo', 'firstName lastName email');

  if (!contact) {
    throw new AppError('Contact not found', 404);
  }

  res.json({
    success: true,
    data: { contact },
  });
});

// @desc    Create contact
// @route   POST /api/contacts
// @access  Private
export const createContact = asyncHandler(async (req, res) => {
  const contact = await Contact.create({
    ...req.body,
    assignedTo: req.body.assignedTo || req.user._id,
  });

  await contact.populate('account', 'name email');
  await contact.populate('assignedTo', 'firstName lastName email');

  await logActivity(req.user._id, 'CREATE', 'Contact', contact._id, {
    email: contact.email,
  });

  res.status(201).json({
    success: true,
    message: 'Contact created successfully',
    data: { contact },
  });
});

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
export const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('account', 'name email')
    .populate('assignedTo', 'firstName lastName email');

  if (!contact) {
    throw new AppError('Contact not found', 404);
  }

  await logActivity(req.user._id, 'UPDATE', 'Contact', contact._id, req.body);

  res.json({
    success: true,
    message: 'Contact updated successfully',
    data: { contact },
  });
});

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    throw new AppError('Contact not found', 404);
  }

  await Contact.findByIdAndDelete(req.params.id);

  await logActivity(req.user._id, 'DELETE', 'Contact', contact._id, {
    email: contact.email,
  });

  res.json({
    success: true,
    message: 'Contact deleted successfully',
  });
});
