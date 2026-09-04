import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
