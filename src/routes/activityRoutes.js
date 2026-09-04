import express from 'express';
import { getActivityLogs } from '../controllers/activityController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/', getActivityLogs);

export default router;
