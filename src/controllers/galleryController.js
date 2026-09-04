import Gallery from '../models/Gallery.js';
import ActivityLog from '../models/ActivityLog.js';
import { slugify } from '../utils/slugify.js';

export async function getAdminGalleryAlbums(req, res, next) {
  try {
    const albums = await Gallery.find().populate('photos').sort({ createdAt: -1 });
    return res.json({ success: true, data: albums });
  } catch (error) {
    next(error);
  }
}

export async function createGalleryAlbum(req, res, next) {
  try {
    const { title, description, coverImage, date, category, status, photos } = req.body;
    if (!title || !coverImage) {
      return res.status(400).json({ success: false, message: 'Album title and cover image are required.' });
    }

    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await Gallery.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const album = await Gallery.create({
      title,
      slug,
      description: description || "",
      coverImage,
      date: date || new Date().toLocaleDateString(),
      category: category || "Events",
      status: status || "published",
      photos: Array.isArray(photos) ? photos : []
    });

    await ActivityLog.create({
      action: 'Created Gallery Album',
      entity: 'Gallery',
      entityId: album._id,
      details: `Album: ${album.title}`
    });

    return res.status(201).json({ success: true, data: album });
  } catch (error) {
    next(error);
  }
}

export async function updateGalleryAlbum(req, res, next) {
  try {
    const album = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('photos');
    if (!album) {
      return res.status(404).json({ success: false, message: 'Gallery album not found.' });
    }

    return res.json({ success: true, data: album });
  } catch (error) {
    next(error);
  }
}

export async function deleteGalleryAlbum(req, res, next) {
  try {
    const album = await Gallery.findByIdAndDelete(req.params.id);
    if (!album) {
      return res.status(404).json({ success: false, message: 'Gallery album not found.' });
    }

    await ActivityLog.create({
      action: 'Deleted Gallery Album',
      entity: 'Gallery',
      entityId: req.params.id,
      details: `Album: ${album.title}`
    });

    return res.json({ success: true, message: 'Gallery album deleted.' });
  } catch (error) {
    next(error);
  }
}
