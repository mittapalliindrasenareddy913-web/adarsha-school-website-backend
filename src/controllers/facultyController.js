import Faculty from '../models/Faculty.js';
import ActivityLog from '../models/ActivityLog.js';

export async function getAdminFaculty(req, res, next) {
  try {
    const faculty = await Faculty.find().sort({ displayOrder: 1, createdAt: -1 });
    return res.json({ success: true, data: faculty });
  } catch (error) {
    next(error);
  }
}

export async function createFaculty(req, res, next) {
  try {
    const { name, photo, designation, qualification, subject, bio, displayOrder, status } = req.body;
    if (!name || !designation || !qualification || !subject) {
      return res.status(400).json({ success: false, message: 'Name, designation, qualification, and subject are required.' });
    }

    const member = await Faculty.create({
      name,
      photo: photo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      designation,
      qualification,
      subject,
      bio: bio || "",
      displayOrder: Number(displayOrder) || 0,
      status: status || "published"
    });

    await ActivityLog.create({
      action: 'Added Faculty Profile',
      entity: 'Faculty',
      entityId: member._id,
      details: `Name: ${member.name} (${member.designation})`
    });

    return res.status(201).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
}

export async function updateFaculty(req, res, next) {
  try {
    const member = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Faculty profile not found.' });
    }

    await ActivityLog.create({
      action: 'Updated Faculty Profile',
      entity: 'Faculty',
      entityId: member._id,
      details: `Name: ${member.name}`
    });

    return res.json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
}

export async function deleteFaculty(req, res, next) {
  try {
    const member = await Faculty.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Faculty profile not found.' });
    }

    await ActivityLog.create({
      action: 'Deleted Faculty Profile',
      entity: 'Faculty',
      entityId: req.params.id,
      details: `Deleted: ${member.name}`
    });

    return res.json({ success: true, message: 'Faculty profile deleted.' });
  } catch (error) {
    next(error);
  }
}
