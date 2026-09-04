import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, default: "" },
  coverImage: { type: String, required: true },
  date: { type: String, default: "" },
  category: { type: String, default: "Events" },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published',
    index: true
  },
  photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }]
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);
