import express from 'express';
import { getOrganization, updateOrganization } from '../controllers/organizationController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get('/', authenticate, getOrganization);
router.put('/', authenticate, authorize('System Admin'), updateOrganization);

export default router;
