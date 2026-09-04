import SiteSettings from '../models/SiteSettings.js';
import Announcement from '../models/Announcement.js';
import Event from '../models/Event.js';
import Media from '../models/Media.js';
import Gallery from '../models/Gallery.js';
import Faculty from '../models/Faculty.js';
import Achievement from '../models/Achievement.js';
import Facility from '../models/Facility.js';
import Academic from '../models/Academic.js';

export async function getSiteSettings(req, res, next) {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

export async function getAnnouncements(req, res, next) {
  try {
    const now = new Date();
    const announcements = await Announcement.find({
      status: 'published',
      $and: [
        {
          $or: [
            { startDateTime: null },
            { startDateTime: { $lte: now } }
          ]
        },
        {
          $or: [
            { endDateTime: null },
            { endDateTime: { $gt: now } }
          ]
        },
        {
          $or: [
            { expiryDate: null },
            { expiryDate: { $gt: now } }
          ]
        }
      ]
    }).sort({ publishDate: -1, createdAt: -1 });

    return res.json({ success: true, data: announcements });
  } catch (error) {
    next(error);
  }
}

export async function getAnnouncementBySlug(req, res, next) {
  try {
    const now = new Date();
    const item = await Announcement.findOne({
      slug: req.params.slug,
      status: 'published',
      $and: [
        {
          $or: [
            { startDateTime: null },
            { startDateTime: { $lte: now } }
          ]
        },
        {
          $or: [
            { endDateTime: null },
            { endDateTime: { $gt: now } }
          ]
        },
        {
          $or: [
            { expiryDate: null },
            { expiryDate: { $gt: now } }
          ]
        }
      ]
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Announcement notice not found or expired.' });
    }

    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function getEvents(req, res, next) {
  try {
    const events = await Event.find({ status: 'published' }).sort({ date: 1 });
    return res.json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
}

export async function getEventBySlug(req, res, next) {
  try {
    const item = await Event.findOne({
      slug: req.params.slug,
      status: 'published'
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function getGallery(req, res, next) {
  try {
    const mediaItems = await Media.find({ status: 'published' }).sort({ displayOrder: 1, createdAt: -1 });
    return res.json({ success: true, data: mediaItems });
  } catch (error) {
    next(error);
  }
}

export async function getFaculty(req, res, next) {
  try {
    const faculty = await Faculty.find({ status: 'published' }).sort({ displayOrder: 1 });
    return res.json({ success: true, data: faculty });
  } catch (error) {
    next(error);
  }
}

export async function getAchievements(req, res, next) {
  try {
    const achievements = await Achievement.find({ status: 'published' }).sort({ createdAt: -1 });
    return res.json({ success: true, data: achievements });
  } catch (error) {
    next(error);
  }
}

export async function getFacilities(req, res, next) {
  try {
    const facilities = await Facility.find({ status: 'published' }).sort({ displayOrder: 1 });
    return res.json({ success: true, data: facilities });
  } catch (error) {
    next(error);
  }
}

export async function getAcademics(req, res, next) {
  try {
    const academics = await Academic.find({ status: 'published' }).sort({ displayOrder: 1 });
    return res.json({
      success: true,
      data: {
        overview: "Our academic curriculum blends conceptual clarity with practical inquiry, ensuring every student develops critical thinking and lifelong learning habits.",
        philosophy: "We believe education should spark curiosity rather than enforce passive memorization. Our teaching methodology combines interactive classroom dialogue, practical science experiments, digital learning modules, and regular assessment feedback.",
        levels: academics
      }
    });
  } catch (error) {
    next(error);
  }
}
