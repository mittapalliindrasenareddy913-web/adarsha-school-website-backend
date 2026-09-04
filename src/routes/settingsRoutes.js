import express from 'express';
import { getSettings, updateSettings, updateHomeSettings, updateAboutSettings } from '../controllers/settingsController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/', getSettings);
router.put('/home', updateHomeSettings);
router.put('/about', updateAboutSettings);
router.put('/', updateSettings);

export default router;
