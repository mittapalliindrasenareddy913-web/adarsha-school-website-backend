import SiteSettings from '../models/SiteSettings.js';
import ActivityLog from '../models/ActivityLog.js';

export async function getSettings(req, res, next) {
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

export async function updateSettings(req, res, next) {
  try {
    let settings = await SiteSettings.findOne();
    
    // Strip immutable / system fields to prevent Mongoose update errors
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    if (!settings) {
      settings = await SiteSettings.create(updateData);
    } else {
      settings = await SiteSettings.findByIdAndUpdate(
        settings._id,
        updateData,
        { returnDocument: 'after', runValidators: true }
      );
    }

    await ActivityLog.create({
      action: 'Updated Site Settings',
      entity: 'SiteSettings',
      entityId: settings._id,
      details: 'Website settings updated'
    });

    return res.json({ success: true, message: 'Website settings saved successfully.', data: settings });
  } catch (error) {
    next(error);
  }
}
