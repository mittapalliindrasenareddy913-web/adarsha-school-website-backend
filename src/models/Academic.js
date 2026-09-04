import mongoose from 'mongoose';

const academicSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  grades: { type: String, required: true },
  description: { type: String, required: true },
  highlights: [{ type: String }],
  imageKey: { type: String, default: "primarySchool" },
  image: { type: String, default: "" },
  galleryImages: [{ type: String }],
  displayOrder: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published',
    index: true
  }
}, { timestamps: true });

export default mongoose.model('Academic', academicSchema);
