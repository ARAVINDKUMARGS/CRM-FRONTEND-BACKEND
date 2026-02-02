import express from 'express';
import {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
} from '../controllers/accountController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAccounts);
router.get('/:id', authenticate, getAccount);
router.post('/', authenticate, createAccount);
router.put('/:id', authenticate, updateAccount);
router.delete('/:id', authenticate, deleteAccount);

export default router;
