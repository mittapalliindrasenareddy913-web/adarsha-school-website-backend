import express from 'express';
import {
  getAdminAcademics,
  createAcademic,
  updateAcademic,
  deleteAcademic
} from '../controllers/academicController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/', getAdminAcademics);
router.post('/', createAcademic);
router.put('/:id', updateAcademic);
router.delete('/:id', deleteAcademic);

export default router;
