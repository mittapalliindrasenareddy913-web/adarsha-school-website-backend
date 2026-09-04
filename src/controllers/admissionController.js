import AdmissionEnquiry from '../models/AdmissionEnquiry.js';
import ContactEnquiry from '../models/ContactEnquiry.js';
import ActivityLog from '../models/ActivityLog.js';
import SiteSettings from '../models/SiteSettings.js';

export const CANONICAL_TARGET_CLASSES = ['Pre-Primary', 'Primary', 'High School'];

/**
 * Normalizes input grade labels to canonical database values:
 * - Pre-Primary
 * - Primary
 * - High School
 */
export function normalizeTargetClass(inputClass) {
  if (!inputClass || typeof inputClass !== 'string') return '';
  const clean = inputClass.trim();
  const lower = clean.toLowerCase();

  if (lower.includes('pre-primary') || lower.includes('nursery') || lower.includes('lkg') || lower.includes('ukg')) {
    return 'Pre-Primary';
  }
  if (lower.includes('high school') || lower.includes('secondary') || lower.includes('middle') || lower.includes('grade 6') || lower.includes('grade vi') || lower.includes('grade 9') || lower.includes('grade ix') || lower.includes('grade 10') || lower.includes('grade x')) {
    return 'High School';
  }
  if (lower.includes('primary') || lower.includes('grade 1') || lower.includes('grade i') || lower.includes('grade 5') || lower.includes('grade v')) {
    return 'Primary';
  }

  return clean;
}

// Public endpoint: Submit admission enquiry
export async function submitAdmissionEnquiry(req, res, next) {
  try {
    const { parentName, studentName, phone, email, targetClass, message } = req.body;

    if (!parentName || !studentName || !phone || !targetClass) {
      return res.status(400).json({ success: false, message: 'Please complete all required fields.' });
    }

    const canonicalTargetClass = normalizeTargetClass(targetClass);

    if (!CANONICAL_TARGET_CLASSES.includes(canonicalTargetClass)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid target class category. Please select Pre-Primary, Primary, or High School.'
      });
    }

    const referenceId = 'ENQ-' + Math.floor(100000 + Math.random() * 900000);

    const settings = await SiteSettings.findOne();
    const academicYear = req.body.academicYear || settings?.admissionAcademicYear || '2026–27';

    const enquiry = await AdmissionEnquiry.create({
      parentName,
      studentName,
      phone,
      email,
      targetClass: canonicalTargetClass,
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
    const { status, academicYear, readState, targetClass, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (academicYear && academicYear !== 'All') {
      query.academicYear = academicYear;
    }

    if (targetClass && targetClass !== 'All') {
      query.$or = [
        { targetClass: targetClass },
        { targetClass: { $regex: targetClass, $options: 'i' } }
      ];
    }

    if (readState === 'unread') {
      query.isRead = false;
    } else if (readState === 'read') {
      query.isRead = true;
    }

    if (search) {
      const searchConditions = [
        { parentName: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { referenceId: { $regex: search, $options: 'i' } },
        { targetClass: { $regex: search, $options: 'i' } }
      ];

      if (query.$or) {
        query = { $and: [query, { $or: searchConditions }] };
      } else {
        query.$or = searchConditions;
      }
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
