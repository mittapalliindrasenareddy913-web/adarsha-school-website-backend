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

  leadership: {
    correspondent: {
      name: { type: String, default: "" },
      designation: { type: String, default: "Correspondent" },
      photo: { type: String, default: "" },
      message: { type: String, default: "" },
      quote: { type: String, default: "" },
      enabled: { type: Boolean, default: true }
    },
    principal: {
      name: { type: String, default: "" },
      designation: { type: String, default: "Principal" },
      photo: { type: String, default: "" },
      message: { type: String, default: "" },
      quote: { type: String, default: "" },
      enabled: { type: Boolean, default: true }
    }
  },

  location: {
    address: { type: String, default: "Cross Road, Thamballapalle, Andhra Pradesh, India" },
    landmark: { type: String, default: "Cross Road, Thamballapalle" },
    googleMapsUrl: { type: String, default: "https://maps.app.goo.gl/SkHq86FABbvmB51J6" },
    embedMapUrl: { type: String, default: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15444.6!2d78.4483544!3d13.8244027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb2455cd9c3208f%3A0xed5d454df6a552a5!2sAdarsha%20E.M%20school!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" }
  },

  contact: {
    phonePrimary: { type: String, default: "+91 98765 43210" },
    phoneSecondary: { type: String, default: "" },
    whatsappNumber: { type: String, default: "919876543210" },
    email: { type: String, default: "info@adarshaemschool.edu.in" },
    admissionsEmail: { type: String, default: "admissions@adarshaemschool.edu.in" },
    workingHours: { type: String, default: "Monday to Saturday: 8:30 AM – 4:30 PM" }
  },

  seo: {
    siteTitle: { type: String, default: "Adarsha High School | Where Curiosity Becomes Confidence" },
    metaDescription: { type: String, default: "Official portal of Adarsha High School, Thamballapalle. Empowering young minds with academic rigor and moral values." },
    ogImage: { type: String, default: "" }
  },

  home: {
    heroTagline: { type: String, default: "Where Curiosity Becomes Confidence." },
    heroSubTagline: { type: String, default: "An environment where young minds learn, explore, create, and prepare for tomorrow." },
    heroMediaType: {
      type: String,
      enum: ['IMAGE', 'R2_VIDEO', 'CLOUDINARY_VIDEO', 'YOUTUBE'],
      default: 'IMAGE'
    },
    heroImage: { type: String, default: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1920&q=80" },
    heroVideoUrl: { type: String, default: "" },
    heroYouTubeUrl: { type: String, default: "" },
    aboutSectionHeading: { type: String, default: "Welcome to Adarsha High School" },
    aboutText: { type: String, default: "" }
  },

  about: {
    heroSubtitle: { type: String, default: "Adarsha High School provides a structured, supportive learning environment dedicated to developing curious, responsible, and ethical students." },
    introduction: { type: String, default: "" },
    history: { type: String, default: "" },
    vision: { type: String, default: "To be a leading educational institution in the region recognized for fostering academic excellence, moral integrity, and modern technological readiness in young learners." },
    mission: { type: String, default: "To empower every student through conceptual learning, disciplined habits, sports participation, and moral values in a supportive, safe educational atmosphere." },
    philosophy: { type: String, default: "" },
    approach: { type: String, default: "" },
    studentDevelopment: { type: String, default: "" },
    additionalInfo: { type: String, default: "" },
    aboutImage: { type: String, default: "" },
    journey: [{
      year: { type: String, default: "" },
      title: { type: String, default: "" },
      description: { type: String, default: "" }
    }],
    values: [{
      name: { type: String, default: "" },
      desc: { type: String, default: "" }
    }]
  },

  developerCredit: {
    text: { type: String, default: "Designed & Developed by" },
    brandName: { type: String, default: "ISR WEBDESIGN" },
    website: { type: String, default: "https://isrwebdesign.com/" }
  }
}, { timestamps: true });

export default mongoose.model('SiteSettings', siteSettingsSchema);
