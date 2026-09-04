import Event from '../models/Event.js';
import ActivityLog from '../models/ActivityLog.js';
import { slugify } from '../utils/slugify.js';

export async function getAdminEvents(req, res, next) {
  try {
    const events = await Event.find().sort({ date: -1 });
    return res.json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
}

export async function createEvent(req, res, next) {
  try {
    const { name, category, date, time, location, shortDescription, description, coverImage, status, photos, videos } = req.body;

    if (!name || !shortDescription || !description) {
      return res.status(400).json({ success: false, message: 'Name and description fields are required.' });
    }

    let baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;
    while (await Event.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const eventDate = date ? new Date(date) : new Date();
    const dateFormatted = eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const newEvent = await Event.create({
      name,
      slug,
      category: category || "Celebration",
      date: eventDate,
      dateFormatted,
      time: time || "9:00 AM – 4:00 PM",
      location: location || "School Campus Grounds",
      shortDescription,
      description,
      coverImage: coverImage || "",
      status: status || "published",
      photos: Array.isArray(photos) ? photos : [],
      videos: Array.isArray(videos) ? videos : []
    });

    await ActivityLog.create({
      action: 'Created School Event',
      entity: 'Event',
      entityId: newEvent._id,
      details: `Event: ${newEvent.name}`
    });

    return res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    next(error);
  }
}

export async function updateEvent(req, res, next) {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event record not found.' });
    }

    await ActivityLog.create({
      action: 'Updated School Event',
      entity: 'Event',
      entityId: event._id,
      details: `Event: ${event.name} (Status: ${event.status})`
    });

    return res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
}

export async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event record not found.' });
    }

    await ActivityLog.create({
      action: 'Deleted School Event',
      entity: 'Event',
      entityId: req.params.id,
      details: `Deleted: ${event.name}`
    });

    return res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
