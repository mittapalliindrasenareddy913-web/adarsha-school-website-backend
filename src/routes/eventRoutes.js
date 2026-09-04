import express from 'express';
import {
  getAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/', getAdminEvents);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
