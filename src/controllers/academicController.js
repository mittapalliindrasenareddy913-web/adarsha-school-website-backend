import Academic from '../models/Academic.js';
import ActivityLog from '../models/ActivityLog.js';

export async function getAdminAcademics(req, res, next) {
  try {
    const items = await Academic.find().sort({ displayOrder: 1 });
    return res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

export async function createAcademic(req, res, next) {
  try {
    const { id, title, grades, description, highlights, imageKey, image, galleryImages, displayOrder, status } = req.body;
    if (!id || !title || !description) {
      return res.status(400).json({ success: false, message: 'ID, title, and description are required.' });
    }

    const item = await Academic.create({
      id,
      title,
      grades: grades || "Foundational Level",
      description,
      highlights: Array.isArray(highlights) ? highlights : [],
      imageKey: imageKey || "primarySchool",
      image: image || "",
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      displayOrder: Number(displayOrder) || 0,
      status: status || "published"
    });

    await ActivityLog.create({
      action: 'Created Academic Program',
      entity: 'Academic',
      entityId: item._id,
      details: `Program: ${item.title}`
    });

    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function updateAcademic(req, res, next) {
  try {
    const item = await Academic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Academic program not found.' });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function deleteAcademic(req, res, next) {
  try {
    const item = await Academic.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Academic program not found.' });
    }
    return res.json({ success: true, message: 'Academic program deleted.' });
  } catch (error) {
    next(error);
  }
}
