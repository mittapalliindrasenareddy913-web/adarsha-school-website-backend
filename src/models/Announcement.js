import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  category: { type: String, default: "Important Notice" },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dateFormatted: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  attachmentUrl: { type: String, default: "" },
  publishDate: { type: Date, default: Date.now, index: true },
  expiryDate: { type: Date, default: null, index: true },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled', 'expired', 'archived'],
    default: 'published',
    index: true
  },
  showPopup: { type: Boolean, default: false },
  displayMode: {
    type: String,
    enum: ['None', 'Popup', 'Scrolling Bar', 'Both'],
    default: 'Popup'
  },
  startDateTime: { type: Date, default: null, index: true },
  endDateTime: { type: Date, default: null, index: true },
  popupStart: { type: Date, default: null },
  popupEnd: { type: Date, default: null }
}, { timestamps: true });

announcementSchema.index({ status: 1, publishDate: -1 });

export default mongoose.model('Announcement', announcementSchema);
