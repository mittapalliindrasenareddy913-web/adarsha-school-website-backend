import express from 'express';
import {
  getSiteSettings,
  getAnnouncements,
  getAnnouncementBySlug,
  getEvents,
  getEventBySlug,
  getGallery,
  getFaculty,
  getAchievements,
  getFacilities,
  getAcademics
} from '../controllers/publicController.js';

const router = express.Router();

router.get('/settings', getSiteSettings);
router.get('/announcements', getAnnouncements);
router.get('/announcements/:slug', getAnnouncementBySlug);
router.get('/events', getEvents);
router.get('/events/:slug', getEventBySlug);
router.get('/gallery', getGallery);
router.get('/faculty', getFaculty);
router.get('/achievements', getAchievements);
router.get('/facilities', getFacilities);
router.get('/academics', getAcademics);

export default router;
