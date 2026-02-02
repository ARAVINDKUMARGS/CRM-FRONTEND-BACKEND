import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
    },
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    value: {
      type: Number,
      default: 0,
    },
    notes: String,
    convertedTo: {
      type: {
        contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
        account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
        deal: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' },
      },
      default: null,
    },
    convertedAt: Date,
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ email: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ status: 1 });

export default mongoose.model('Lead', leadSchema);
