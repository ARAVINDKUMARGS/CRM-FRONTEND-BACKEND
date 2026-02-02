import Task from '../models/Task.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/errorHandler.js';
import { logActivity } from '../utils/auditLogger.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, type, assignedTo, dueDate, relatedTo } = req.query;
  const query = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (type) query.type = type;
  if (assignedTo) query.assignedTo = assignedTo;
  if (dueDate) {
    const date = new Date(dueDate);
    query.dueDate = {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lte: new Date(date.setHours(23, 59, 59, 999)),
    };
  }
  if (relatedTo) {
    const [entityType, entityId] = relatedTo.split(':');
    query['relatedTo.entityType'] = entityType;
    query['relatedTo.entityId'] = entityId;
  }

  // Sales Executive can only see their own tasks
  if (req.user.role === 'Sales Executive') {
    query.assignedTo = req.user._id;
  }

  const tasks = await Task.find(query)
    .populate('assignedTo', 'firstName lastName email')
    .sort({ dueDate: 1, priority: -1 });

  res.json({
    success: true,
    count: tasks.length,
    data: { tasks },
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate(
    'assignedTo',
    'firstName lastName email'
  );

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.json({
    success: true,
    data: { task },
  });
});

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    ...req.body,
    assignedTo: req.body.assignedTo || req.user._id,
  });

  await task.populate('assignedTo', 'firstName lastName email');

  // Create notification
  if (task.assignedTo && task.assignedTo._id.toString() !== req.user._id.toString()) {
    await Notification.create({
      user: task.assignedTo._id,
      type: 'Task Reminder',
      title: 'New Task Assigned',
      message: `You have been assigned a new task: ${task.title}`,
      relatedTo: { entityType: 'Task', entityId: task._id },
      priority: task.priority === 'Urgent' || task.priority === 'High' ? 'High' : 'Medium',
    });
  }

  await logActivity(req.user._id, 'CREATE', 'Task', task._id, { title: task.title });

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: { task },
  });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  // Check access
  if (req.user.role === 'Sales Executive' && task.assignedTo.toString() !== req.user._id.toString()) {
    throw new AppError('Access denied', 403);
  }

  // If marking as completed, set completedAt
  if (req.body.status === 'Completed' && task.status !== 'Completed') {
    req.body.completedAt = new Date();
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('assignedTo', 'firstName lastName email');

  await logActivity(req.user._id, 'UPDATE', 'Task', updatedTask._id, req.body);

  res.json({
    success: true,
    message: 'Task updated successfully',
    data: { task: updatedTask },
  });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  await Task.findByIdAndDelete(req.params.id);

  await logActivity(req.user._id, 'DELETE', 'Task', task._id, { title: task.title });

  res.json({
    success: true,
    message: 'Task deleted successfully',
  });
});
