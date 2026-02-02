import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    type: {
      type: String,
      enum: ['Task Reminder', 'Lead Assignment', 'Deal Stage Change', 'New Message', 'System Alert'],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    relatedTo: {
      entityType: {
        type: String,
        enum: ['Lead', 'Contact', 'Account', 'Deal', 'Task', 'Communication', null],
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
