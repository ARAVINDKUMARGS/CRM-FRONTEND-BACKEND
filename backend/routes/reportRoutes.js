import express from 'express';
import {
  getSalesReport,
  getLeadsReport,
  getProductivityReport,
  getCampaignReport,
} from '../controllers/reportController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get('/sales', authenticate, authorize('Sales Manager', 'System Admin', 'Sales Executive'), getSalesReport);
router.get('/leads', authenticate, getLeadsReport);
router.get('/productivity', authenticate, authorize('Sales Manager', 'System Admin'), getProductivityReport);
router.get('/campaigns', authenticate, authorize('Marketing Executive', 'System Admin'), getCampaignReport);

export default router;
