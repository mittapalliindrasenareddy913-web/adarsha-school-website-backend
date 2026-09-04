import AdmissionEnquiry from '../models/AdmissionEnquiry.js';
import ContactEnquiry from '../models/ContactEnquiry.js';
import ActivityLog from '../models/ActivityLog.js';
import SiteSettings from '../models/SiteSettings.js';

// Public endpoint: Submit admission enquiry
export async function submitAdmissionEnquiry(req, res, next) {
  try {
    const { parentName, studentName, phone, email, targetClass, message } = req.body;

    if (!parentName || !studentName || !phone || !targetClass) {
      return res.status(400).json({ success: false, message: 'Please complete all required fields.' });
    }

    const referenceId = 'ENQ-' + Math.floor(100000 + Math.random() * 900000);

    const settings = await SiteSettings.findOne();
    const academicYear = req.body.academicYear || settings?.admissionAcademicYear || '2026–27';

    const enquiry = await AdmissionEnquiry.create({
      parentName,
      studentName,
      phone,
      email,
      targetClass,
      message,
      referenceId,
      academicYear,
      isRead: false,
      status: 'New'
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your admission enquiry has been logged successfully. Our admissions team will get in touch shortly.',
      referenceId: enquiry.referenceId
    });
  } catch (error) {
    next(error);
  }
}

// Protected Admin endpoints
export async function getAdmissionEnquiries(req, res, next) {
  try {
    const { status, academicYear, readState, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (academicYear && academicYear !== 'All') {
      query.academicYear = academicYear;
    }

    if (readState === 'unread') {
      query.isRead = false;
    } else if (readState === 'read') {
      query.isRead = true;
    }

    if (search) {
      query.$or = [
        { parentName: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { referenceId: { $regex: search, $options: 'i' } }
      ];
    }

    const enquiries = await AdmissionEnquiry.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, data: enquiries });
  } catch (error) {
    next(error);
  }
}

export async function markAdmissionRead(req, res, next) {
  try {
    const enquiry = await AdmissionEnquiry.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry record not found.' });
    }

    return res.json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
}

export async function getUnreadCounts(req, res, next) {
  try {
    const unreadAdmissions = await AdmissionEnquiry.countDocuments({ isRead: false });
    const unreadContacts = await ContactEnquiry.countDocuments({ isRead: false });

    return res.json({
      success: true,
      unreadAdmissions,
      unreadContacts,
      totalUnread: unreadAdmissions + unreadContacts
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAdmissionStatus(req, res, next) {
  try {
    const { status, isRead } = req.body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (isRead !== undefined) updateData.isRead = isRead;

    const enquiry = await AdmissionEnquiry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry record not found.' });
    }

    await ActivityLog.create({
      action: 'Updated Admission Enquiry',
      entity: 'AdmissionEnquiry',
      entityId: enquiry._id,
      details: `Reference: ${enquiry.referenceId} -> Status: ${enquiry.status}`
    });

    return res.json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
}

export async function deleteAdmissionEnquiry(req, res, next) {
  try {
    const enquiry = await AdmissionEnquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry record not found.' });
    }

    await ActivityLog.create({
      action: 'Deleted Admission Enquiry',
      entity: 'AdmissionEnquiry',
      entityId: req.params.id,
      details: `Reference: ${enquiry.referenceId}`
    });

    return res.json({ success: true, message: 'Enquiry deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
