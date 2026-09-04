import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  photo: { type: String, required: true },
  objectKey: { type: String, default: "" },
  cloudinaryPublicId: { type: String, default: "" },
  designation: { type: String, required: true },
  qualification: { type: String, required: true },
  subject: { type: String, required: true },
  bio: { type: String, default: "" },
  displayOrder: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published',
    index: true
  }
}, { timestamps: true });

export default mongoose.model('Faculty', facultySchema);
