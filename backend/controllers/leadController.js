import Lead from '../models/Lead.js';
import Contact from '../models/Contact.js';
import Account from '../models/Account.js';
import Deal from '../models/Deal.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/errorHandler.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
export const getLeads = asyncHandler(async (req, res) => {
  const { status, assignedTo, search } = req.query;
  const query = {};

  if (status) query.status = status;
  if (assignedTo) query.assignedTo = assignedTo;
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  // Sales Executive can only see their own leads
  if (req.user.role === 'Sales Executive') {
    query.assignedTo = req.user._id;
  }

  const leads = await Lead.find(query)
    .populate('assignedTo', 'firstName lastName email')
    .populate('source', 'name type')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: leads.length,
    data: { leads },
  });
});

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id)
    .populate('assignedTo', 'firstName lastName email')
    .populate('source', 'name type');

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  // Check access
  if (req.user.role === 'Sales Executive' && lead.assignedTo?._id.toString() !== req.user._id.toString()) {
    throw new AppError('Access denied', 403);
  }

  res.json({
    success: true,
    data: { lead },
  });
});

// @desc    Create lead
// @route   POST /api/leads
// @access  Private
export const createLead = asyncHandler(async (req, res) => {
  const lead = await Lead.create({
    ...req.body,
    assignedTo: req.body.assignedTo || req.user._id,
  });

  await lead.populate('assignedTo', 'firstName lastName email');

  // Create notification if assigned to someone else
  if (lead.assignedTo && lead.assignedTo._id.toString() !== req.user._id.toString()) {
    await Notification.create({
      user: lead.assignedTo._id,
      type: 'Lead Assignment',
      title: 'New Lead Assigned',
      message: `You have been assigned a new lead: ${lead.firstName} ${lead.lastName}`,
      relatedTo: { entityType: 'Lead', entityId: lead._id },
      priority: 'High',
    });
  }

  await logActivity(req.user._id, 'CREATE', 'Lead', lead._id, { email: lead.email });

  res.status(201).json({
    success: true,
    message: 'Lead created successfully',
    data: { lead },
  });
});

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  // Check access
  if (req.user.role === 'Sales Executive' && lead.assignedTo?.toString() !== req.user._id.toString()) {
    throw new AppError('Access denied', 403);
  }

  const oldStatus = lead.status;
  const oldAssignedTo = lead.assignedTo?.toString();

  const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('assignedTo', 'firstName lastName email');

  // Notification for status change
  if (req.body.status && req.body.status !== oldStatus) {
    await Notification.create({
      user: updatedLead.assignedTo?._id || req.user._id,
      type: 'Lead Assignment',
      title: 'Lead Status Changed',
      message: `Lead ${updatedLead.firstName} ${updatedLead.lastName} status changed to ${req.body.status}`,
      relatedTo: { entityType: 'Lead', entityId: updatedLead._id },
    });
  }

  // Notification for reassignment
  if (req.body.assignedTo && req.body.assignedTo !== oldAssignedTo && req.body.assignedTo !== req.user._id.toString()) {
    await Notification.create({
      user: req.body.assignedTo,
      type: 'Lead Assignment',
      title: 'Lead Reassigned',
      message: `You have been assigned a lead: ${updatedLead.firstName} ${updatedLead.lastName}`,
      relatedTo: { entityType: 'Lead', entityId: updatedLead._id },
      priority: 'High',
    });
  }

  await logActivity(req.user._id, 'UPDATE', 'Lead', updatedLead._id, req.body);

  res.json({
    success: true,
    message: 'Lead updated successfully',
    data: { lead: updatedLead },
  });
});

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  await Lead.findByIdAndDelete(req.params.id);

  await logActivity(req.user._id, 'DELETE', 'Lead', lead._id, { email: lead.email });

  res.json({
    success: true,
    message: 'Lead deleted successfully',
  });
});

// @desc    Convert lead to contact/account/deal
// @route   POST /api/leads/:id/convert
// @access  Private
export const convertLead = asyncHandler(async (req, res) => {
  const { convertTo } = req.body; // ['contact', 'account', 'deal']
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  const converted = {};

  if (convertTo.includes('contact')) {
    const contact = await Contact.create({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      mobile: lead.mobile,
      jobTitle: lead.jobTitle,
      assignedTo: lead.assignedTo,
      notes: lead.notes,
    });
    converted.contact = contact._id;
  }

  if (convertTo.includes('account')) {
    const account = await Account.create({
      name: lead.company || `${lead.firstName} ${lead.lastName}`,
      email: lead.email,
      phone: lead.mobile,
      assignedTo: lead.assignedTo,
    });
    converted.account = account._id;
    
    // Link contact to account if both created
    if (converted.contact) {
      await Contact.findByIdAndUpdate(converted.contact, { account: account._id });
    }
  }

  if (convertTo.includes('deal')) {
    const deal = await Deal.create({
      name: `Deal - ${lead.firstName} ${lead.lastName}`,
      contact: converted.contact,
      account: converted.account,
      value: lead.value || 0,
      assignedTo: lead.assignedTo,
      stage: 'Prospecting',
    });
    converted.deal = deal._id;
  }

  // Update lead
  lead.convertedTo = converted;
  lead.convertedAt = new Date();
  lead.status = 'Qualified';
  await lead.save();

  await logActivity(req.user._id, 'CONVERT', 'Lead', lead._id, converted);

  res.json({
    success: true,
    message: 'Lead converted successfully',
    data: { converted, lead },
  });
});
