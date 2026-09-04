import Achievement from '../models/Achievement.js';
import ActivityLog from '../models/ActivityLog.js';

export async function getAdminAchievements(req, res, next) {
  try {
    const achievements = await Achievement.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: achievements });
  } catch (error) {
    next(error);
  }
}

export async function createAchievement(req, res, next) {
  try {
    const { title, description, year, category, image, studentName, awardPosition, status } = req.body;
    if (!title || !description || !year) {
      return res.status(400).json({ success: false, message: 'Title, description, and year are required.' });
    }

    const item = await Achievement.create({
      title,
      description,
      year,
      category: category || "Academic Excellence",
      image: image || "",
      studentName: studentName || "",
      awardPosition: awardPosition || "",
      status: status || "published"
    });

    await ActivityLog.create({
      action: 'Created Achievement Record',
      entity: 'Achievement',
      entityId: item._id,
      details: `Title: ${item.title}`
    });

    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function updateAchievement(req, res, next) {
  try {
    const item = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Achievement not found.' });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function deleteAchievement(req, res, next) {
  try {
    const item = await Achievement.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Achievement not found.' });
    }
    return res.json({ success: true, message: 'Achievement record deleted.' });
  } catch (error) {
    next(error);
  }
}
