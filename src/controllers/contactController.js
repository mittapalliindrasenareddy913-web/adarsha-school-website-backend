import ContactEnquiry from '../models/ContactEnquiry.js';
import ActivityLog from '../models/ActivityLog.js';

// Public endpoint: Submit contact form message
export async function submitContactEnquiry(req, res, next) {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Please complete all required fields.' });
    }

    const ticketId = 'TCK-' + Math.floor(100000 + Math.random() * 900000);

    const enquiry = await ContactEnquiry.create({
      name,
      phone,
      email,
      subject,
      message,
      ticketId,
      isRead: false,
      status: 'New'
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. We will reply to your query soon.',
      ticketId: enquiry.ticketId
    });
  } catch (error) {
    next(error);
  }
}

// Protected Admin endpoints
export async function getContactEnquiries(req, res, next) {
  try {
    const { status, readState, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (readState === 'unread') {
      query.isRead = false;
    } else if (readState === 'read') {
      query.isRead = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } }
      ];
    }

    const enquiries = await ContactEnquiry.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, data: enquiries });
  } catch (error) {
    next(error);
  }
}

export async function markContactRead(req, res, next) {
  try {
    const enquiry = await ContactEnquiry.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Contact record not found.' });
    }

    return res.json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
}

export async function updateContactStatus(req, res, next) {
  try {
    const { status, isRead } = req.body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (isRead !== undefined) updateData.isRead = isRead;

    const enquiry = await ContactEnquiry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Contact record not found.' });
    }

    await ActivityLog.create({
      action: 'Updated Contact Status',
      entity: 'ContactEnquiry',
      entityId: enquiry._id,
      details: `Ticket: ${enquiry.ticketId} -> Status: ${enquiry.status}`
    });

    return res.json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
}

export async function deleteContactEnquiry(req, res, next) {
  try {
    const enquiry = await ContactEnquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Contact record not found.' });
    }

    await ActivityLog.create({
      action: 'Deleted Contact Enquiry',
      entity: 'ContactEnquiry',
      entityId: req.params.id,
      details: `Ticket: ${enquiry.ticketId}`
    });

    return res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
