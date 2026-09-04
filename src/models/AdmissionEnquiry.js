import mongoose from 'mongoose';

const admissionEnquirySchema = new mongoose.Schema({
  parentName: { type: String, required: true, trim: true },
  studentName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, default: "", trim: true },
  targetClass: { type: String, required: true },
  message: { type: String, default: "" },
  referenceId: { type: String, required: true, unique: true, index: true },
  academicYear: { type: String, default: "", trim: true },
  isRead: { type: Boolean, default: false, index: true },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'In Progress', 'Converted', 'Closed'],
    default: 'New',
    index: true
  }
}, { timestamps: true });

admissionEnquirySchema.index({ createdAt: -1, status: 1 });

export default mongoose.model('AdmissionEnquiry', admissionEnquirySchema);
