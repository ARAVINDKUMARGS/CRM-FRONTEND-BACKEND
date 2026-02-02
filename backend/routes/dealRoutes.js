import express from 'express';
import {
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
} from '../controllers/dealController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getDeals);
router.get('/:id', authenticate, getDeal);
router.post('/', authenticate, createDeal);
router.put('/:id', authenticate, updateDeal);
router.delete('/:id', authenticate, deleteDeal);

export default router;
