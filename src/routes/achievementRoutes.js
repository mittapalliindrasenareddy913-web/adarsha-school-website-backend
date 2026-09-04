import express from 'express';
import {
  getAdminAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement
} from '../controllers/achievementController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/', getAdminAchievements);
router.post('/', createAchievement);
router.put('/:id', updateAchievement);
router.delete('/:id', deleteAchievement);

export default router;
