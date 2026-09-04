import express from 'express';
import {
  submitAdmissionEnquiry,
  getAdmissionEnquiries,
  updateAdmissionStatus,
  deleteAdmissionEnquiry,
  markAdmissionRead,
  getUnreadCounts
} from '../controllers/admissionController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const enquiryLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { success: false, message: 'Too many enquiry submissions. Please wait a minute.' }
});

// Public submission
router.post('/', enquiryLimiter, submitAdmissionEnquiry);

// Protected Admin CRUD
router.get('/admin', requireAdmin, getAdmissionEnquiries);
router.get('/admin/unread-count', requireAdmin, getUnreadCounts);
router.patch('/admin/:id/read', requireAdmin, markAdmissionRead);
router.patch('/admin/:id', requireAdmin, updateAdmissionStatus);
router.delete('/admin/:id', requireAdmin, deleteAdmissionEnquiry);

export default router;
