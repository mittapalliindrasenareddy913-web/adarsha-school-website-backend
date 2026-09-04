import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { uploadFileToR2 } from '../services/storageService.js';
import mongoose from 'mongoose';
import Faculty from '../models/Faculty.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

async function testR2AndFacultyUpload() {
  console.log('Testing Cloudflare R2 connection & Faculty upload...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB.');

  // Create a dummy test image buffer (1x1 transparent PNG)
  const dummyBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  
  console.log('1. Uploading test image buffer to Cloudflare R2 (Faculty folder)...');
  const uploadResult = await uploadFileToR2({
    buffer: dummyBuffer,
    originalname: 'test_faculty_photo.png',
    mimetype: 'image/png',
    category: 'Faculty'
  });

  console.log('R2 Upload Result URL:', uploadResult.url);

  if (!uploadResult.url) {
    throw new Error('R2 Upload failed: No URL returned');
  }

  console.log('2. Creating Faculty record in MongoDB with R2 photo URL...');
  const facultyMember = await Faculty.create({
    name: 'Test Faculty Educator',
    designation: 'Senior Science Teacher',
    qualification: 'M.Sc. Physics',
    subject: 'Physics',
    photo: uploadResult.url,
    bio: 'Test faculty bio for upload verification.',
    status: 'published'
  });

  console.log('Faculty Record Created:', facultyMember._id, facultyMember.name, facultyMember.photo);

  console.log('3. Cleaning up test faculty record...');
  await Faculty.findByIdAndDelete(facultyMember._id);

  console.log('R2 & FACULTY UPLOAD TEST PASSED CLEANLY!');
  await mongoose.disconnect();
  process.exit(0);
}

testR2AndFacultyUpload().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
