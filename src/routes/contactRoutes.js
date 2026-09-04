import express from 'express';
import {
  submitContactEnquiry,
  getContactEnquiries,
  updateContactStatus,
  deleteContactEnquiry,
  markContactRead
} from '../controllers/contactController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many messages sent. Please wait a minute.' }
});

// Public submission
router.post('/', contactLimiter, submitContactEnquiry);

// Protected Admin CRUD
router.get('/admin', requireAdmin, getContactEnquiries);
router.patch('/admin/:id/read', requireAdmin, markContactRead);
router.patch('/admin/:id', requireAdmin, updateContactStatus);
router.delete('/admin/:id', requireAdmin, deleteContactEnquiry);

export default router;
