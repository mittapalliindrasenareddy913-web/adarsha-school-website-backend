import Facility from '../models/Facility.js';
import ActivityLog from '../models/ActivityLog.js';

export async function getAdminFacilities(req, res, next) {
  try {
    const facilities = await Facility.find().sort({ displayOrder: 1 });
    return res.json({ success: true, data: facilities });
  } catch (error) {
    next(error);
  }
}

export async function createFacility(req, res, next) {
  try {
    const { title, description, imageKey, image, icon, features, displayOrder, status } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Facility title and description are required.' });
    }

    const item = await Facility.create({
      title,
      description,
      imageKey: imageKey || "smartClassroom",
      image: image || "",
      icon: icon || "Tv",
      features: Array.isArray(features) ? features : [],
      displayOrder: Number(displayOrder) || 0,
      status: status || "published"
    });

    await ActivityLog.create({
      action: 'Created Facility Item',
      entity: 'Facility',
      entityId: item._id,
      details: `Facility: ${item.title}`
    });

    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function updateFacility(req, res, next) {
  try {
    const item = await Facility.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Facility not found.' });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function deleteFacility(req, res, next) {
  try {
    const item = await Facility.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Facility not found.' });
    }
    return res.json({ success: true, message: 'Facility item deleted.' });
  } catch (error) {
    next(error);
  }
}
