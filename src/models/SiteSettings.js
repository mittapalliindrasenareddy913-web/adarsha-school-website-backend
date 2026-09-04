import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  schoolName: { type: String, default: "Adarsha E.M. School" },
  schoolFullName: { type: String, default: "Adarsha English Medium School" },
  tagline: { type: String, default: "Where Curiosity Becomes Confidence." },
  subTagline: { type: String, default: "An environment where young minds learn, explore, create, and prepare for tomorrow." },
  
  heroMediaType: {
    type: String,
    enum: ['IMAGE', 'R2_VIDEO', 'CLOUDINARY_VIDEO', 'YOUTUBE'],
    default: 'IMAGE'
  },
  heroImage: { type: String, default: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1920&q=80" },
  heroVideoUrl: { type: String, default: "" },
  heroYouTubeUrl: { type: String, default: "" },
  leadershipPhoto: { type: String, default: "" },
  logo: { type: String, default: "" },
  admissionAcademicYear: { type: String, default: "2026–27" },

  location: {
    address: { type: String, default: "Kadiri Region, Anantapur District, Andhra Pradesh 515591, India" },
    landmark: { type: String, default: "Near Main Road, Kadiri" },
    googleMapsUrl: { type: String, default: "https://maps.app.goo.gl/SkHq86FABbvmB51J6" },
    embedMapUrl: { type: String, default: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15444.6!2d78.4483544!3d13.8244027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb2455cd9c3208f%3A0xed5d454df6a552a5!2sAdarsha%20E.M%20school!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" }
  },

  contact: {
    phonePrimary: { type: String, default: "+91 98765 43210" },
    phoneSecondary: { type: String, default: "+91 87654 32109" },
    whatsappNumber: { type: String, default: "919876543210" },
    email: { type: String, default: "info@adarshaemschool.edu.in" },
    admissionsEmail: { type: String, default: "admissions@adarshaemschool.edu.in" },
    workingHours: { type: String, default: "Monday to Saturday: 8:30 AM – 4:30 PM" }
  },

  seo: {
    siteTitle: { type: String, default: "Adarsha E.M. School | Where Curiosity Becomes Confidence" },
    metaDescription: { type: String, default: "Official portal of Adarsha English Medium School, Kadiri. Empowering young minds with academic rigor and moral values." },
    ogImage: { type: String, default: "" }
  },

  developerCredit: {
    text: { type: String, default: "Designed & Developed by" },
    brandName: { type: String, default: "ISR WEBDESIGN" },
    website: { type: String, default: "https://isrwebdesign.com/" }
  }
}, { timestamps: true });

export default mongoose.model('SiteSettings', siteSettingsSchema);
