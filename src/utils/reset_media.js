import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adarsha_school';

async function resetMediaReferences() {
  console.log('Connecting to MongoDB at:', MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB successfully.');

  const db = mongoose.connection.db;

  // 1. SiteSettings
  const siteSettingsCol = db.collection('sitesettings');
  const settingsRes = await siteSettingsCol.updateMany({}, {
    $set: {
      heroImage: '',
      heroVideoUrl: '',
      heroYouTubeUrl: '',
      leadershipPhoto: '',
      logo: '',
      'seo.ogImage': ''
    }
  });
  console.log('SiteSettings updated:', settingsRes.modifiedCount);

  // 2. Faculty
  const facultyCol = db.collection('faculties');
  const facultyRes = await facultyCol.updateMany({}, {
    $set: {
      photo: '',
      imageUrl: ''
    }
  });
  console.log('Faculty records cleared of image URLs:', facultyRes.modifiedCount);

  // 3. Facilities
  const facilitiesCol = db.collection('facilities');
  const facilityRes = await facilitiesCol.updateMany({}, {
    $set: {
      imageKey: '',
      imageUrl: '',
      image: '',
      gallery: []
    }
  });
  console.log('Facility records cleared of image URLs:', facilityRes.modifiedCount);

  // 4. Academics
  const academicsCol = db.collection('academics');
  const academicRes = await academicsCol.updateMany({}, {
    $set: {
      imageKey: '',
      image: '',
      imageUrl: '',
      heroImage: '',
      gallery: []
    }
  });
  console.log('Academic records cleared of image URLs:', academicRes.modifiedCount);

  // 5. Achievements
  const achievementsCol = db.collection('achievements');
  const achRes = await achievementsCol.updateMany({}, {
    $set: {
      image: '',
      imageUrl: ''
    }
  });
  console.log('Achievement records cleared of image URLs:', achRes.modifiedCount);

  // 6. Events
  const eventsCol = db.collection('events');
  const eventRes = await eventsCol.updateMany({}, {
    $set: {
      coverImage: '',
      photos: [],
      images: []
    }
  });
  console.log('Event records cleared of image URLs:', eventRes.modifiedCount);

  // 7. Gallery
  const galleryCol = db.collection('galleries');
  const galRes = await galleryCol.deleteMany({});
  console.log('Gallery collection reset:', galRes.deletedCount);

  // 8. Media
  const mediaCol = db.collection('media');
  const mediaRes = await mediaCol.deleteMany({});
  console.log('Media collection reset:', mediaRes.deletedCount);

  console.log('DATABASE MEDIA RESET COMPLETE.');
  await mongoose.disconnect();
  process.exit(0);
}

resetMediaReferences().catch(err => {
  console.error('Error during media reset:', err);
  process.exit(1);
});
