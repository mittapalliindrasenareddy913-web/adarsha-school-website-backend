import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import SiteSettings from '../models/SiteSettings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function restoreProductionSettings() {
  console.log('--- RESTORING REAL PRODUCTION SITESETTINGS CONTENT ---');

  await mongoose.connect(process.env.MONGODB_URI);
  let settings = await SiteSettings.findOne();

  if (!settings) {
    console.error('No SiteSettings document found to update!');
    process.exit(1);
  }

  const realHome = {
    heroTagline: "Where Curiosity Becomes Confidence.",
    heroSubTagline: "An environment where young minds learn, explore, create, and prepare for tomorrow.",
    heroMediaType: "R2_VIDEO",
    heroImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1920&q=80",
    heroVideoUrl: "https://pub-178f89930dcd42dc9acf32d9cb439925.r2.dev/school/hero/adarsha-school-video-2556c2ed-06fc-4864-a5e4-609446c81df2.mp4",
    heroYouTubeUrl: "",
    aboutSectionHeading: "Welcome to Adarsha High School",
    aboutText: "At Adarsha High School, we foster an educational culture that balances conceptual understanding with moral values, physical well-being, and creative expression. Every student is encouraged to discover their unique strengths in a safe, inspiring environment."
  };

  const realAbout = {
    heroSubtitle: "Adarsha High School provides a structured, supportive learning environment dedicated to developing curious, responsible, and ethical students.",
    introduction: "Adarsha High School was established with a vision to deliver quality, value-based education to children in Thamballapalle and surrounding regions. We believe education is a transformation process that nurtures character, intellect, and physical well-being.",
    history: "Founded over two decades ago, Adarsha High School started as a modest vision to bring comprehensive English medium education to the rural and semi-urban youth. Over the years, through unwavering commitment to academic discipline and community support, the school has grown into a trusted institution with modern amenities and qualified faculty.",
    vision: "To be a leading educational institution in the region recognized for fostering academic excellence, moral integrity, and modern technological readiness in young learners.",
    mission: "To empower every student through conceptual learning, disciplined habits, sports participation, and moral values in a supportive, safe educational atmosphere.",
    philosophy: "We place the child at the center of the learning process. Our educational philosophy combines conceptual mastery with practical application, character building, and individual attention to foster confident, lifelong learners.",
    approach: "Our teachers use interactive, activity-guided instruction, regular continuous evaluation, audio-visual aids, and individual counseling to ensure every student develops at their highest potential.",
    studentDevelopment: "Beyond academics, we focus on physical education, sports events, cultural participation, science fairs, and moral assemblies to ensure complete physical, mental, and emotional growth.",
    additionalInfo: "Adarsha High School is recognized by the State Board of Education, operating in English Medium from Nursery to Grade 10.",
    aboutImage: "",
    journey: [
      { year: "2005", title: "Foundation", description: "Established with primary grades to serve local families." },
      { year: "2012", title: "High School Expansion", description: "Upgraded facility to High School state board recognition." },
      { year: "2020", title: "Digital Infrastructure", description: "Introduced smart classrooms and computer lab facilities." },
      { year: "2026", title: "Modern Campus Upgrade", description: "Expanded campus facilities and sports infrastructure." }
    ],
    values: [
      { name: "Excellence", desc: "Striving for high standards in academic and personal growth." },
      { name: "Integrity", desc: "Upholding honesty, respect, and ethical principles in all actions." },
      { name: "Curiosity", desc: "Encouraging continuous questioning, discovery, and active learning." },
      { name: "Compassion", desc: "Fostering empathy, kindness, and strong community responsibility." }
    ]
  };

  const updatePayload = {
    tagline: "Where Curiosity Becomes Confidence.",
    subTagline: "An environment where young minds learn, explore, create, and prepare for tomorrow.",
    heroMediaType: "R2_VIDEO",
    heroImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1920&q=80",
    home: realHome,
    about: realAbout
  };

  const updatedDoc = await SiteSettings.findByIdAndUpdate(
    settings._id,
    { $set: updatePayload },
    { returnDocument: 'after', runValidators: true }
  );

  console.log('Restoration complete!');
  console.log('Restored tagline:', updatedDoc.tagline);
  console.log('Restored subTagline:', updatedDoc.subTagline);
  console.log('Restored home.heroTagline:', updatedDoc.home.heroTagline);
  console.log('Restored home.heroSubTagline:', updatedDoc.home.heroSubTagline);
  console.log('Restored about.introduction:', updatedDoc.about.introduction);
  console.log('Restored about.history:', updatedDoc.about.history);

  await mongoose.disconnect();
  process.exit(0);
}

restoreProductionSettings().catch(err => {
  console.error('Error during restoration:', err);
  process.exit(1);
});
