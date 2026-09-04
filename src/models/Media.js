import mongoose from 'mongoose';

export const CANONICAL_CATEGORIES = [
  'Hero',
  'Faculty',
  'Facilities',
  'Achievements',
  'Events',
  'Gallery',
  'Videos',
  'Documents',
  'Campus',
  'Classrooms',
  'Laboratories',
  'Library',
  'Sports',
  'Activities',
  'Celebrations',
  'Students',
  'Other'
];

const mediaSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  caption: { type: String, default: "" },
  category: {
    type: String,
    enum: CANONICAL_CATEGORIES,
    default: 'Campus',
    index: true
  },
  type: { type: String, enum: ['image', 'video', 'document'], default: 'image' },
  source: { type: String, enum: ['upload', 'youtube', 'vimeo'], default: 'upload' },
  url: { type: String, required: true },
  provider: { type: String, default: 'r2', index: true },
  objectKey: { type: String, default: "", index: true },
  publicId: { type: String, default: "" },
  originalName: { type: String, default: "" },
  mimeType: { type: String, default: "" },
  size: { type: Number, default: 0 },
  cloudinaryPublicId: { type: String, default: "", index: true }, // Legacy backward-compatibility
  thumbnail: { type: String, default: "" },
  format: { type: String, default: "" },
  width: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published',
    index: true
  }
}, { timestamps: true });

mediaSchema.index({ status: 1, category: 1, createdAt: -1 });

export default mongoose.model('Media', mediaSchema);
