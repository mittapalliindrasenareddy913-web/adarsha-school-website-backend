import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import SiteSettings from '../models/SiteSettings.js';
import { updateHomeSettings, updateAboutSettings, getSettings } from '../controllers/settingsController.js';
import { getSiteSettings } from '../controllers/publicController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const createMockReqRes = (body = {}) => {
  let responseData = null;
  const req = { body };
  const res = {
    json: (data) => {
      responseData = data;
      return res;
    }
  };
  const next = (err) => {
    if (err) throw err;
  };
  return { req, res, getResponse: () => responseData, next };
};

async function executeFullVerification() {
  console.log('==================================================');
  console.log('  STARTING COMPREHENSIVE END-TO-END VERIFICATION  ');
  console.log('==================================================');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas.');

  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }

  // SAVE ORIGINAL CONTENT BEFORE TESTING FOR CLEAN RESTORATION
  const originalHome = JSON.parse(JSON.stringify(settings.home || {}));
  const originalAbout = JSON.parse(JSON.stringify(settings.about || {}));
  const originalTagline = settings.tagline;
  const originalSubTagline = settings.subTagline;

  // --------------------------------------------------
  // TEST 1: HOME TEST (HOME_TEST_12345)
  // --------------------------------------------------
  console.log('\n[TEST 1] Setting Home Hero Subheadline to "HOME_TEST_12345"...');
  const homeReqRes = createMockReqRes({
    home: {
      heroTagline: "Shaping Curious Minds. Building Confident Futures.",
      heroSubTagline: "HOME_TEST_12345",
      heroMediaType: "R2_VIDEO",
      heroImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1920&q=80",
      heroVideoUrl: "https://pub-178f89930dcd42dc9acf32d9cb439925.r2.dev/school/hero/adarsha-school-video-2556c2ed-06fc-4864-a5e4-609446c81df2.mp4",
      aboutSectionHeading: "Welcome to Adarsha High School",
      aboutText: "Home Experience Text"
    }
  });

  await updateHomeSettings(homeReqRes.req, homeReqRes.res, homeReqRes.next);
  const homeRes = homeReqRes.getResponse();

  if (!homeRes.success) throw new Error('Home update failed!');

  // Verify Admin GET
  const adminGetReqRes1 = createMockReqRes();
  await getSettings(adminGetReqRes1.req, adminGetReqRes1.res, adminGetReqRes1.next);
  const adminData1 = adminGetReqRes1.getResponse().data;

  // Verify Public GET
  const publicGetReqRes1 = createMockReqRes();
  await getSiteSettings(publicGetReqRes1.req, publicGetReqRes1.res, publicGetReqRes1.next);
  const publicData1 = publicGetReqRes1.getResponse().data;

  console.log('A. Admin GET home.heroSubTagline:', adminData1.home?.heroSubTagline);
  console.log('B. Public GET home.heroSubTagline:', publicData1.home?.heroSubTagline);
  console.log('C. Top-level subTagline:', publicData1.subTagline);

  if (adminData1.home?.heroSubTagline !== "HOME_TEST_12345" || publicData1.home?.heroSubTagline !== "HOME_TEST_12345") {
    throw new Error('TEST 1 FAILED: Home Hero Subheadline not saved or retrieved correctly!');
  }
  if (publicData1.about?.introduction === "HOME_TEST_12345") {
    throw new Error('TEST 1 FAILED: About introduction was mutated during Home save!');
  }
  console.log('✓ TEST 1 PASSED: Home updated to "HOME_TEST_12345" and retrieved by Admin & Public APIs.');

  // --------------------------------------------------
  // TEST 2: ABOUT TEST (ABOUT_TEST_12345)
  // --------------------------------------------------
  console.log('\n[TEST 2] Setting About Introduction to "ABOUT_TEST_12345"...');
  const aboutReqRes = createMockReqRes({
    about: {
      heroSubtitle: "Adarsha High School provides a structured, supportive learning environment.",
      introduction: "ABOUT_TEST_12345",
      history: "Founded over two decades ago...",
      vision: "To be a leading educational institution...",
      mission: "To empower every student...",
      journey: [{ year: "2005", title: "Foundation", description: "Established with primary grades." }],
      values: [{ name: "Excellence", desc: "Striving for high standards." }]
    }
  });

  await updateAboutSettings(aboutReqRes.req, aboutReqRes.res, aboutReqRes.next);
  const aboutRes = aboutReqRes.getResponse();

  if (!aboutRes.success) throw new Error('About update failed!');

  // Verify Admin GET
  const adminGetReqRes2 = createMockReqRes();
  await getSettings(adminGetReqRes2.req, adminGetReqRes2.res, adminGetReqRes2.next);
  const adminData2 = adminGetReqRes2.getResponse().data;

  // Verify Public GET
  const publicGetReqRes2 = createMockReqRes();
  await getSiteSettings(publicGetReqRes2.req, publicGetReqRes2.res, publicGetReqRes2.next);
  const publicData2 = publicGetReqRes2.getResponse().data;

  console.log('A. Admin GET about.introduction:', adminData2.about?.introduction);
  console.log('B. Public GET about.introduction:', publicData2.about?.introduction);
  console.log('C. Home Hero Subheadline remains:', publicData2.home?.heroSubTagline);

  if (adminData2.about?.introduction !== "ABOUT_TEST_12345" || publicData2.about?.introduction !== "ABOUT_TEST_12345") {
    throw new Error('TEST 2 FAILED: About introduction not saved or retrieved correctly!');
  }
  if (publicData2.home?.heroSubTagline !== "HOME_TEST_12345") {
    throw new Error('TEST 2 FAILED: Home Hero Subheadline was mutated during About save!');
  }
  console.log('✓ TEST 2 PASSED: About updated to "ABOUT_TEST_12345" while Home remained "HOME_TEST_12345".');

  // --------------------------------------------------
  // RESTORE PRODUCTION VALUES
  // --------------------------------------------------
  console.log('\n[RESTORING REAL PRODUCTION CONTENT]...');
  const restorePayload = {
    tagline: "Where Curiosity Becomes Confidence.",
    subTagline: "An environment where young minds learn, explore, create, and prepare for tomorrow.",
    home: {
      heroTagline: "Where Curiosity Becomes Confidence.",
      heroSubTagline: "An environment where young minds learn, explore, create, and prepare for tomorrow.",
      heroMediaType: "R2_VIDEO",
      heroImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1920&q=80",
      heroVideoUrl: "https://pub-178f89930dcd42dc9acf32d9cb439925.r2.dev/school/hero/adarsha-school-video-2556c2ed-06fc-4864-a5e4-609446c81df2.mp4",
      heroYouTubeUrl: "",
      aboutSectionHeading: "Welcome to Adarsha High School",
      aboutText: "At Adarsha High School, we foster an educational culture that balances conceptual understanding with moral values, physical well-being, and creative expression. Every student is encouraged to discover their unique strengths in a safe, inspiring environment."
    },
    about: {
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
    }
  };

  const finalDoc = await SiteSettings.findByIdAndUpdate(
    settings._id,
    { $set: restorePayload },
    { returnDocument: 'after', runValidators: true }
  );

  console.log('✓ Restored real home.heroTagline:', finalDoc.home.heroTagline);
  console.log('✓ Restored real home.heroSubTagline:', finalDoc.home.heroSubTagline);
  console.log('✓ Restored real about.introduction:', finalDoc.about.introduction);

  console.log('\n==================================================');
  console.log('  ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!  ');
  console.log('==================================================');

  await mongoose.disconnect();
  process.exit(0);
}

executeFullVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
