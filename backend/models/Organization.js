import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    companyPhone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    workingHours: {
      start: {
        type: String,
        default: '09:00',
      },
      end: {
        type: String,
        default: '17:00',
      },
      days: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
    },
    holidays: [
      {
        date: Date,
        name: String,
      },
    ],
    logo: String,
    website: String,
  },
  {
    timestamps: true,
  }
);

// Ensure only one organization document exists
organizationSchema.statics.getOrganization = async function () {
  let org = await this.findOne();
  if (!org) {
    org = await this.create({
      companyName: 'CRM Organization',
      companyEmail: 'admin@crm.com',
    });
  }
  return org;
};

export default mongoose.model('Organization', organizationSchema);
