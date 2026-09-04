import mongoose from 'mongoose';

const contactEnquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, default: "", trim: true },
  subject: { type: String, default: "" },
  message: { type: String, required: true },
  ticketId: { type: String, required: true, unique: true, index: true },
  isRead: { type: Boolean, default: false, index: true },
  status: {
    type: String,
    enum: ['New', 'Read', 'Replied', 'Archived'],
    default: 'New',
    index: true
  }
}, { timestamps: true });

contactEnquirySchema.index({ createdAt: -1, status: 1 });

export default mongoose.model('ContactEnquiry', contactEnquirySchema);
