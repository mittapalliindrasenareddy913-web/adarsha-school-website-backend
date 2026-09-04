import Media, { CANONICAL_CATEGORIES } from '../models/Media.js';
import ActivityLog from '../models/ActivityLog.js';
import { uploadFileToR2, deleteFileFromR2 } from '../services/storageService.js';

/**
 * Normalizes input category strings to match the exact canonical Mongoose enum values.
 */
export function normalizeCategory(inputCategory) {
  if (!inputCategory || typeof inputCategory !== 'string') {
    return 'Campus';
  }
  const clean = inputCategory.trim().toLowerCase();
  
  const map = {
    'hero': 'Hero',
    'faculty': 'Faculty',
    'facility': 'Facilities',
    'facilities': 'Facilities',
    'achievement': 'Achievements',
    'achievements': 'Achievements',
    'event': 'Events',
    'events': 'Events',
    'gallery': 'Gallery',
    'video': 'Videos',
    'videos': 'Videos',
    'document': 'Documents',
    'documents': 'Documents',
    'campus': 'Campus',
    'classroom': 'Classrooms',
    'classrooms': 'Classrooms',
    'laboratory': 'Laboratories',
    'laboratories': 'Laboratories',
    'library': 'Library',
    'sport': 'Sports',
    'sports': 'Sports',
    'activity': 'Activities',
    'activities': 'Activities',
    'celebration': 'Celebrations',
    'celebrations': 'Celebrations',
    'student': 'Students',
    'students': 'Students',
    'other': 'Other',
    'general': 'Other'
  };

  if (map[clean]) {
    return map[clean];
  }

  const match = CANONICAL_CATEGORIES.find(c => c.toLowerCase() === clean);
  return match || 'Campus';
}

export async function uploadMedia(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file selected for upload.' });
    }

    const { title, caption, category, featured, displayOrder } = req.body;

    const normalizedCategory = normalizeCategory(category);

    let mediaType = 'image';
    if (req.file.mimetype.startsWith('video/')) {
      mediaType = 'video';
    } else if (req.file.mimetype === 'application/pdf') {
      mediaType = 'document';
    }

    // Upload file buffer to Cloudflare R2 S3 storage
    const uploadRes = await uploadFileToR2({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      category: normalizedCategory
    });

    const newMedia = await Media.create({
      title: title || req.file.originalname,
      caption: caption || "",
      category: normalizedCategory,
      type: mediaType,
      source: 'upload',
      url: uploadRes.url,
      provider: 'r2',
      objectKey: uploadRes.objectKey,
      publicId: uploadRes.objectKey,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size || req.file.buffer.length,
      cloudinaryPublicId: uploadRes.objectKey, // Retained for backward compatibility
      format: req.file.mimetype.split('/')[1] || '',
      featured: featured === 'true' || featured === true,
      displayOrder: Number(displayOrder) || 0,
      status: 'published'
    });

    await ActivityLog.create({
      action: 'Uploaded Media Asset',
      entity: 'Media',
      entityId: newMedia._id,
      details: `Title: ${newMedia.title} (${newMedia.type}) [Category: ${newMedia.category}]`
    });

    return res.status(201).json({ success: true, data: newMedia });
  } catch (error) {
    next(error);
  }
}

export async function getAdminMedia(req, res, next) {
  try {
    const { category, type, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = normalizeCategory(category);
    }
    if (type && type !== 'All') {
      query.type = type;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { caption: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Media.find(query).sort({ displayOrder: 1, createdAt: -1 });
    return res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

export async function updateMedia(req, res, next) {
  try {
    if (req.body.category) {
      req.body.category = normalizeCategory(req.body.category);
    }
    const item = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Media item not found.' });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function deleteMedia(req, res, next) {
  try {
    const item = await Media.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Media item not found.' });
    }

    // Delete object from Cloudflare R2 if objectKey (or publicId) exists
    const keyToDelete = item.objectKey || item.cloudinaryPublicId || item.publicId;
    if (keyToDelete) {
      try {
        await deleteFileFromR2(keyToDelete);
      } catch (r2Err) {
        console.warn(`[R2 Storage Warning] Unable to delete object key ${keyToDelete}:`, r2Err.message);
      }
    }

    // Delete MongoDB metadata record
    await Media.findByIdAndDelete(req.params.id);

    await ActivityLog.create({
      action: 'Deleted Media Asset',
      entity: 'Media',
      entityId: req.params.id,
      details: `Deleted ${item.title}`
    });

    return res.json({ success: true, message: 'Media deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
