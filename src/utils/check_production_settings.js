import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import SiteSettings from '../models/SiteSettings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function inspectDoc() {
  await mongoose.connect(process.env.MONGODB_URI);
  const settings = await SiteSettings.findOne();
  console.log('--- CURRENT PRODUCTION SITESETTINGS DOCUMENT ---');
  console.log(JSON.stringify(settings, null, 2));
  await mongoose.disconnect();
  process.exit(0);
}

inspectDoc().catch(err => {
  console.error(err);
  process.exit(1);
});
