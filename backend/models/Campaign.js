import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Campaign name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Email', 'Social Media', 'Webinar', 'Trade Show', 'Advertisement', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['Planning', 'Active', 'Completed', 'Cancelled'],
      default: 'Planning',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    budget: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    leadsGenerated: {
      type: Number,
      default: 0,
    },
    leadsConverted: {
      type: Number,
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

campaignSchema.index({ status: 1 });
campaignSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model('Campaign', campaignSchema);
