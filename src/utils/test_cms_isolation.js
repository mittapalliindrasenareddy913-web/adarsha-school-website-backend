import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import SiteSettings from '../models/SiteSettings.js';
import { updateHomeSettings, updateAboutSettings, getSettings } from '../controllers/settingsController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function runIsolationTests() {
  console.log('--- STARTING CMS DATA SEPARATION TESTS ---');

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set!');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas.');

  // Mock Request / Response helper
  const createMockReqRes = (body) => {
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

  // Setup initial settings document
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }

  const initialAboutObj = JSON.parse(JSON.stringify(settings.toObject().about || {}));

  // TEST A: Save Home
  console.log('\n[TEST A] Saving Home Content (changing Hero Subheadline to "Test Hero Subheadline")...');
  const testA = createMockReqRes({
    home: {
      heroTagline: "Test Hero Tagline",
      heroSubTagline: "Test Hero Subheadline",
      heroMediaType: "IMAGE",
      heroImage: "https://example.com/hero.jpg",
      aboutSectionHeading: "Welcome Heading",
      aboutText: "Home Experience Text"
    }
  });

  await updateHomeSettings(testA.req, testA.res, testA.next);
  const resA = testA.getResponse();

  if (!resA.success) {
    throw new Error('Test A failed: updateHomeSettings returned success=false');
  }

  const docAfterA = await SiteSettings.findById(settings._id);
  const aboutAfterAObj = JSON.parse(JSON.stringify(docAfterA.toObject().about || {}));

  console.log('Doc after Test A home.heroSubTagline:', docAfterA.home?.heroSubTagline);
  console.log('Doc after Test A tagline:', docAfterA.tagline);
  console.log('Doc after Test A subTagline:', docAfterA.subTagline);

  if (docAfterA.home?.heroSubTagline !== "Test Hero Subheadline") {
    throw new Error(`TEST A FAILED: home.heroSubTagline is "${docAfterA.home?.heroSubTagline}", expected "Test Hero Subheadline"`);
  }

  if (JSON.stringify(aboutAfterAObj) !== JSON.stringify(initialAboutObj)) {
    console.log('Initial About:', initialAboutObj);
    console.log('About After A:', aboutAfterAObj);
    throw new Error('TEST A FAILED: about object was mutated when saving Home!');
  }
  console.log('PASSED TEST A: Home updated cleanly, About object remains logically unchanged.');

  // TEST B: Save About
  console.log('\n[TEST B] Saving About Content (changing Introduction to "Test About Introduction")...');
  const testB = createMockReqRes({
    about: {
      heroSubtitle: "Test About Subtitle",
      introduction: "Test About Introduction",
      history: "Test About History",
      vision: "Test About Vision",
      mission: "Test About Mission",
      journey: [{ year: "2026", title: "Test Landmark", description: "Test Desc" }],
      values: [{ name: "Test Value", desc: "Test Val Desc" }]
    }
  });

  await updateAboutSettings(testB.req, testB.res, testB.next);
  const resB = testB.getResponse();

  if (!resB.success) {
    throw new Error('Test B failed: updateAboutSettings returned success=false');
  }

  const docAfterB = await SiteSettings.findById(settings._id);
  console.log('Doc after Test B about.introduction:', docAfterB.about?.introduction);
  console.log('Doc after Test B home.heroSubTagline:', docAfterB.home?.heroSubTagline);

  if (docAfterB.about?.introduction !== "Test About Introduction") {
    throw new Error(`TEST B FAILED: about.introduction is "${docAfterB.about?.introduction}", expected "Test About Introduction"`);
  }

  if (docAfterB.home?.heroSubTagline !== "Test Hero Subheadline") {
    throw new Error(`TEST B FAILED: home.heroSubTagline changed to "${docAfterB.home?.heroSubTagline}", expected "Test Hero Subheadline"`);
  }
  console.log('PASSED TEST B: About updated cleanly, Home object remains logically unchanged.');

  // TEST C: Fetch Settings Persistence
  console.log('\n[TEST C] Fetching settings via getSettings to verify persistence...');
  const testC = createMockReqRes({});
  await getSettings(testC.req, testC.res, testC.next);
  const resC = testC.getResponse();

  if (!resC.success) {
    throw new Error('Test C failed: getSettings returned success=false');
  }

  const fetched = resC.data;
  console.log('Fetched home.heroSubTagline:', fetched.home?.heroSubTagline);
  console.log('Fetched about.introduction:', fetched.about?.introduction);

  if (fetched.home?.heroSubTagline !== "Test Hero Subheadline" || fetched.about?.introduction !== "Test About Introduction") {
    throw new Error('TEST C FAILED: Saved settings did not persist correctly!');
  }

  console.log('PASSED TEST C: Both Home and About settings persist independently!');

  console.log('\nALL CMS ISOLATION TESTS PASSED SUCCESSFULLY!');
  await mongoose.disconnect();
  process.exit(0);
}

runIsolationTests().catch((err) => {
  console.error('\nTEST FAILED WITH ERROR:', err);
  process.exit(1);
});
