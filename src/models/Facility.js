import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  imageKey: { type: String, default: "smartClassroom" },
  image: { type: String, default: "" },
  objectKey: { type: String, default: "" },
  cloudinaryPublicId: { type: String, default: "" },
  icon: { type: String, default: "Tv" },
  features: [{ type: String }],
  displayOrder: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published',
    index: true
  }
}, { timestamps: true });

export default mongoose.model('Facility', facilitySchema);
