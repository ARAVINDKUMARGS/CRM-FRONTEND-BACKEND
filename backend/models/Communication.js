import mongoose from 'mongoose';

const communicationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Email', 'Call', 'Note', 'Meeting', 'Document'],
      required: [true, 'Communication type is required'],
    },
    subject: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    relatedTo: {
      entityType: {
        type: String,
        enum: ['Lead', 'Contact', 'Account', 'Deal'],
        required: true,
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    direction: {
      type: String,
      enum: ['Inbound', 'Outbound'],
      default: 'Outbound',
    },
    duration: Number, // For calls, in minutes
    attachments: [
      {
        filename: String,
        url: String,
        size: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

communicationSchema.index({ 'relatedTo.entityType': 1, 'relatedTo.entityId': 1 });
communicationSchema.index({ createdBy: 1 });

export default mongoose.model('Communication', communicationSchema);
