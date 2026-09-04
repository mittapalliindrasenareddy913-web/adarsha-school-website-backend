import express from 'express';
import {
  getAdminFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty
} from '../controllers/facultyController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/', getAdminFaculty);
router.post('/', createFaculty);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);

export default router;
