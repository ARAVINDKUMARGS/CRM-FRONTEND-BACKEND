import Lead from '../models/Lead.js';
import Deal from '../models/Deal.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Campaign from '../models/Campaign.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get sales reports
// @route   GET /api/reports/sales
// @access  Private (Sales Manager, Admin)
export const getSalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = {};

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  // Sales Executive can only see their own data
  if (req.user.role === 'Sales Executive') {
    query.assignedTo = req.user._id;
  }

  const deals = await Deal.find(query);
  const totalDeals = deals.length;
  const wonDeals = deals.filter((d) => d.stage === 'Closed Won');
  const lostDeals = deals.filter((d) => d.stage === 'Closed Lost');
  const totalValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
  const wonValue = wonDeals.reduce((sum, d) => sum + (d.value || 0), 0);

  // Pipeline stages
  const pipeline = {
    Prospecting: deals.filter((d) => d.stage === 'Prospecting').length,
    Proposal: deals.filter((d) => d.stage === 'Proposal').length,
    Negotiation: deals.filter((d) => d.stage === 'Negotiation').length,
    'Closed Won': wonDeals.length,
    'Closed Lost': lostDeals.length,
  };

  // Deal value by stage
  const valueByStage = {
    Prospecting: deals
      .filter((d) => d.stage === 'Prospecting')
      .reduce((sum, d) => sum + (d.value || 0), 0),
    Proposal: deals
      .filter((d) => d.stage === 'Proposal')
      .reduce((sum, d) => sum + (d.value || 0), 0),
    Negotiation: deals
      .filter((d) => d.stage === 'Negotiation')
      .reduce((sum, d) => sum + (d.value || 0), 0),
    'Closed Won': wonValue,
    'Closed Lost': lostDeals.reduce((sum, d) => sum + (d.value || 0), 0),
  };

  res.json({
    success: true,
    data: {
      summary: {
        totalDeals,
        wonDeals: wonDeals.length,
        lostDeals: lostDeals.length,
        totalValue,
        wonValue,
        winRate: totalDeals > 0 ? ((wonDeals.length / totalDeals) * 100).toFixed(2) : 0,
      },
      pipeline,
      valueByStage,
    },
  });
});

// @desc    Get leads report
// @route   GET /api/reports/leads
// @access  Private
export const getLeadsReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = {};

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  if (req.user.role === 'Sales Executive') {
    query.assignedTo = req.user._id;
  }

  const leads = await Lead.find(query);

  const statusCount = {
    New: leads.filter((l) => l.status === 'New').length,
    Contacted: leads.filter((l) => l.status === 'Contacted').length,
    Qualified: leads.filter((l) => l.status === 'Qualified').length,
    Lost: leads.filter((l) => l.status === 'Lost').length,
  };

  const convertedLeads = leads.filter((l) => l.convertedTo).length;
  const conversionRate = leads.length > 0 ? ((convertedLeads / leads.length) * 100).toFixed(2) : 0;

  // Leads by source
  const leadsBySource = {};
  for (const lead of leads) {
    if (lead.source) {
      const sourceId = lead.source.toString();
      leadsBySource[sourceId] = (leadsBySource[sourceId] || 0) + 1;
    }
  }

  res.json({
    success: true,
    data: {
      summary: {
        totalLeads: leads.length,
        convertedLeads,
        conversionRate,
      },
      statusCount,
      leadsBySource,
    },
  });
});

// @desc    Get user productivity report
// @route   GET /api/reports/productivity
// @access  Private (Sales Manager, Admin)
export const getProductivityReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const dateQuery = {};

  if (startDate || endDate) {
    dateQuery.createdAt = {};
    if (startDate) dateQuery.createdAt.$gte = new Date(startDate);
    if (endDate) dateQuery.createdAt.$lte = new Date(endDate);
  }

  const users = await User.find({ role: { $in: ['Sales Executive', 'Sales Manager'] } });

  const productivity = await Promise.all(
    users.map(async (user) => {
      const userQuery = { ...dateQuery, assignedTo: user._id };

      const [leads, deals, tasks, completedTasks] = await Promise.all([
        Lead.countDocuments(userQuery),
        Deal.countDocuments(userQuery),
        Task.countDocuments(userQuery),
        Task.countDocuments({ ...userQuery, status: 'Completed' }),
      ]);

      const wonDeals = await Deal.countDocuments({
        ...userQuery,
        stage: 'Closed Won',
      });

      const dealValue = await Deal.aggregate([
        { $match: { ...userQuery, stage: 'Closed Won' } },
        { $group: { _id: null, total: { $sum: '$value' } } },
      ]);

      return {
        userId: user._id,
        userName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        leads,
        deals,
        wonDeals,
        dealValue: dealValue[0]?.total || 0,
        tasks,
        completedTasks,
        completionRate: tasks > 0 ? ((completedTasks / tasks) * 100).toFixed(2) : 0,
      };
    })
  );

  res.json({
    success: true,
    data: { productivity },
  });
});

// @desc    Get campaign performance report
// @route   GET /api/reports/campaigns
// @access  Private (Marketing Executive, Admin)
export const getCampaignReport = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find().populate('createdBy', 'firstName lastName');

  const campaignPerformance = campaigns.map((campaign) => ({
    campaignId: campaign._id,
    campaignName: campaign.name,
    type: campaign.type,
    status: campaign.status,
    budget: campaign.budget,
    leadsGenerated: campaign.leadsGenerated,
    leadsConverted: campaign.leadsConverted,
    revenue: campaign.revenue,
    roi: campaign.budget > 0 ? (((campaign.revenue - campaign.budget) / campaign.budget) * 100).toFixed(2) : 0,
    conversionRate:
      campaign.leadsGenerated > 0
        ? ((campaign.leadsConverted / campaign.leadsGenerated) * 100).toFixed(2)
        : 0,
  }));

  res.json({
    success: true,
    data: { campaignPerformance },
  });
});
