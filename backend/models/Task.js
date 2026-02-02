import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: String,
    type: {
      type: String,
      enum: ['Call', 'Meeting', 'Email', 'Follow-up', 'Other'],
      default: 'Other',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    completedAt: Date,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must be assigned to a user'],
    },
    relatedTo: {
      entityType: {
        type: String,
        enum: ['Lead', 'Contact', 'Account', 'Deal', null],
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    reminder: {
      enabled: {
        type: Boolean,
        default: false,
      },
      reminderDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });

export default mongoose.model('Task', taskSchema);
