import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  year: { type: String, required: true },
  category: {
    type: String,
    enum: ['Academic Excellence', 'Sports & Athletics', 'Science & Innovation', 'Cultural Arts', 'Awards'],
    default: 'Academic Excellence'
  },
  image: { type: String, default: "" },
  objectKey: { type: String, default: "" },
  cloudinaryPublicId: { type: String, default: "" },
  studentName: { type: String, default: "" },
  awardPosition: { type: String, default: "" },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published',
    index: true
  }
}, { timestamps: true });

export default mongoose.model('Achievement', achievementSchema);
