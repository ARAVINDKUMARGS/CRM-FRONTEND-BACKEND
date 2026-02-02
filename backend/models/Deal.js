import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Deal name is required'],
      trim: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
    },
    stage: {
      type: String,
      enum: ['Prospecting', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
      default: 'Prospecting',
    },
    value: {
      type: Number,
      required: [true, 'Deal value is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    expectedCloseDate: {
      type: Date,
    },
    actualCloseDate: {
      type: Date,
    },
    probability: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    description: String,
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
    },
  },
  {
    timestamps: true,
  }
);

dealSchema.index({ stage: 1 });
dealSchema.index({ assignedTo: 1 });
dealSchema.index({ expectedCloseDate: 1 });

export default mongoose.model('Deal', dealSchema);
