import express from 'express';
import {
  getCommunications,
  createCommunication,
  updateCommunication,
  deleteCommunication,
} from '../controllers/communicationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/:entityType/:entityId', authenticate, getCommunications);
router.post('/', authenticate, createCommunication);
router.put('/:id', authenticate, updateCommunication);
router.delete('/:id', authenticate, deleteCommunication);

export default router;
