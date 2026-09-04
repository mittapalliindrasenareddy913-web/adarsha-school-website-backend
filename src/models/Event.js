import mongoose from 'mongoose';

const eventPhotoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  objectKey: { type: String, default: "" },
  cloudinaryPublicId: { type: String, default: "" },
  caption: { type: String, default: "" }
});

const eventVideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  thumbnail: { type: String, default: "" },
  videoUrl: { type: String, required: true },
  objectKey: { type: String, default: "" },
  source: { type: String, enum: ['r2', 'upload', 'cloudinary', 'youtube', 'vimeo'], default: 'youtube' }
});

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  category: {
    type: String,
    enum: ['Annual Day', 'Sports Day', 'Cultural Event', 'Science Exhibition', 'Independence Day', 'Republic Day', 'Celebration', 'Competition', 'Workshop', 'Other'],
    default: 'Celebration'
  },
  date: { type: Date, required: true, index: true },
  dateFormatted: { type: String, required: true },
  time: { type: String, default: "9:00 AM – 4:00 PM" },
  location: { type: String, default: "School Campus Grounds" },
  coverImage: { type: String, default: "" },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled', 'archived'],
    default: 'published',
    index: true
  },
  photos: [eventPhotoSchema],
  videos: [eventVideoSchema]
}, { timestamps: true });

eventSchema.index({ status: 1, date: -1 });

export default mongoose.model('Event', eventSchema);
