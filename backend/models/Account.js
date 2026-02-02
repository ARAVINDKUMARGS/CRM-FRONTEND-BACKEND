import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Account name is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    website: String,
    industry: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Customer', 'Partner', 'Competitor', 'Reseller', 'Other'],
      default: 'Customer',
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    description: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    annualRevenue: Number,
    employeeCount: Number,
  },
  {
    timestamps: true,
  }
);

accountSchema.index({ name: 1 });
accountSchema.index({ assignedTo: 1 });

export default mongoose.model('Account', accountSchema);
