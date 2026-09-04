import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { requireAdmin } from './middleware/authMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import admissionRoutes from './routes/admissionRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

import announcementRoutes from './routes/announcementRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import facilityRoutes from './routes/facilityRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import activityRoutes from './routes/activityRoutes.js';

import Media from './models/Media.js';
import Event from './models/Event.js';
import Announcement from './models/Announcement.js';
import Faculty from './models/Faculty.js';
import Achievement from './models/Achievement.js';
import AdmissionEnquiry from './models/AdmissionEnquiry.js';
import ContactEnquiry from './models/ContactEnquiry.js';
import ActivityLog from './models/ActivityLog.js';

dotenv.config();

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false
}));

// CORS Configuration
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// Request Body & Cookie Parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Base Health Check
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'Adarsha School Backend Server Online', timestamp: new Date() });
});

// Mount Public & Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/contact', contactRoutes);

// Mount Protected Admin CRUD Routes
app.use('/api/admin/announcements', announcementRoutes);
app.use('/api/admin/events', eventRoutes);
app.use('/api/admin/media', mediaRoutes);
app.use('/api/admin/gallery', galleryRoutes);
app.use('/api/admin/faculty', facultyRoutes);
app.use('/api/admin/achievements', achievementRoutes);
app.use('/api/admin/facilities', facilityRoutes);
app.use('/api/admin/academics', academicRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/admin/activity-logs', activityRoutes);

// Admin Dashboard Real-Time MongoDB Analytics Stats Endpoint
app.get('/api/admin/dashboard-stats', requireAdmin, async (req, res, next) => {
  try {
    const totalPhotos = await Media.countDocuments({ type: 'image' });
    const totalVideos = await Media.countDocuments({ type: 'video' });
    const totalAnnouncements = await Announcement.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: 'published', date: { $gte: new Date() } });
    const totalFaculty = await Faculty.countDocuments();
    const totalAchievements = await Achievement.countDocuments();
    const admissionEnquiries = await AdmissionEnquiry.countDocuments({ status: 'New' });
    const contactEnquiries = await ContactEnquiry.countDocuments({ status: 'New' });

    const recentActivity = await ActivityLog.find().sort({ createdAt: -1 }).limit(10);
    const recentUploads = await Media.find().sort({ createdAt: -1 }).limit(6);
    const upcomingEventList = await Event.find({ status: 'published' }).sort({ date: 1 }).limit(5);
    const latestAnnouncements = await Announcement.find({ status: 'published' }).sort({ createdAt: -1 }).limit(5);

    return res.json({
      success: true,
      data: {
        stats: {
          totalPhotos,
          totalVideos,
          totalAnnouncements,
          upcomingEvents,
          totalFaculty,
          totalAchievements,
          admissionEnquiries,
          contactEnquiries
        },
        recentActivity,
        recentUploads,
        upcomingEventList,
        latestAnnouncements
      }
    });
  } catch (error) {
    next(error);
  }
});

// Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;
