import express from 'express';
import {
  getAdminFacilities,
  createFacility,
  updateFacility,
  deleteFacility
} from '../controllers/facilityController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/', getAdminFacilities);
router.post('/', createFacility);
router.put('/:id', updateFacility);
router.delete('/:id', deleteFacility);

export default router;
