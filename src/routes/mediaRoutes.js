import express from 'express';
import {
  uploadMedia,
  getAdminMedia,
  updateMedia,
  deleteMedia
} from '../controllers/mediaController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/', getAdminMedia);
router.post('/upload', upload.single('file'), uploadMedia);
router.put('/:id', updateMedia);
router.delete('/:id', deleteMedia);

export default router;
