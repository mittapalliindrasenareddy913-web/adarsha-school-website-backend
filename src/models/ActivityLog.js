import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g. "Login", "Create Announcement", "Upload Media", "Delete Event"
  entity: { type: String, default: "" },   // e.g. "Announcement", "Event", "Media", "Faculty"
  entityId: { type: String, default: "" },
  adminIdentifier: { type: String, default: "System Admin" },
  details: { type: String, default: "" },
  ip: { type: String, default: "" }
}, { timestamps: true });

activityLogSchema.index({ createdAt: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);
