import ActivityLog from '../models/ActivityLog.js';

export async function getActivityLogs(req, res, next) {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(50);
    return res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
}
