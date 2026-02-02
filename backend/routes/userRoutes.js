import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get('/', authenticate, authorize('System Admin', 'Sales Manager'), getUsers);
router.get('/:id', authenticate, getUser);
router.post('/', authenticate, authorize('System Admin'), createUser);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, authorize('System Admin'), deleteUser);

export default router;
