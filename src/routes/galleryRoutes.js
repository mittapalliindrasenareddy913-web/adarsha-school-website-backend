import express from 'express';
import {
  getAdminGalleryAlbums,
  createGalleryAlbum,
  updateGalleryAlbum,
  deleteGalleryAlbum
} from '../controllers/galleryController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/', getAdminGalleryAlbums);
router.post('/', createGalleryAlbum);
router.put('/:id', updateGalleryAlbum);
router.delete('/:id', deleteGalleryAlbum);

export default router;
