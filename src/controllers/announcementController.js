import Announcement from '../models/Announcement.js';
import ActivityLog from '../models/ActivityLog.js';
import { slugify } from '../utils/slugify.js';

export async function getAdminAnnouncements(req, res, next) {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: announcements });
  } catch (error) {
    next(error);
  }
}

export async function createAnnouncement(req, res, next) {
  try {
    const { title, shortDescription, fullDescription, category, priority, status, showPopup, displayMode, startDateTime, endDateTime, popupStart, popupEnd, expiryDate } = req.body;

    if (!title || !shortDescription || !fullDescription) {
      return res.status(400).json({ success: false, message: 'Title, short description, and full description are required.' });
    }

    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      if (end <= start) {
        return res.status(400).json({ success: false, message: 'End date and time must be after the start date and time.' });
      }
    }

    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await Announcement.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const dateFormatted = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const newAnnouncement = await Announcement.create({
      title,
      slug,
      shortDescription,
      fullDescription,
      category: category || "Important Notice",
      priority: priority || "Medium",
      dateFormatted,
      status: status || "published",
      showPopup: showPopup === 'true' || showPopup === true,
      displayMode: displayMode || 'Popup',
      startDateTime: startDateTime ? new Date(startDateTime) : null,
      endDateTime: endDateTime ? new Date(endDateTime) : null,
      popupStart: popupStart ? new Date(popupStart) : null,
      popupEnd: popupEnd ? new Date(popupEnd) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null
    });

    await ActivityLog.create({
      action: 'Created Announcement Notice',
      entity: 'Announcement',
      entityId: newAnnouncement._id,
      details: `Title: ${newAnnouncement.title}`
    });

    return res.status(201).json({ success: true, data: newAnnouncement });
  } catch (error) {
    next(error);
  }
}

export async function updateAnnouncement(req, res, next) {
  try {
    const { startDateTime, endDateTime } = req.body;
    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      if (end <= start) {
        return res.status(400).json({ success: false, message: 'End date and time must be after the start date and time.' });
      }
    }

    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    await ActivityLog.create({
      action: 'Updated Announcement Notice',
      entity: 'Announcement',
      entityId: announcement._id,
      details: `Title: ${announcement.title} (Status: ${announcement.status})`
    });

    return res.json({ success: true, data: announcement });
  } catch (error) {
    next(error);
  }
}

export async function deleteAnnouncement(req, res, next) {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    await ActivityLog.create({
      action: 'Deleted Announcement Notice',
      entity: 'Announcement',
      entityId: req.params.id,
      details: `Deleted: ${announcement.title}`
    });

    return res.json({ success: true, message: 'Announcement deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
