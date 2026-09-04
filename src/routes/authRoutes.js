import express from 'express';
import { login, logout, getMe } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' }
});

router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', requireAdmin, getMe);

export default router;
