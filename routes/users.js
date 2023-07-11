import express from 'express';
import {
  getAllUsers,
  googleAuth,
  register,
  login,
  additionalInfo,
} from '../controllers/users.js';
const router = express.Router();
router.get('/', getAllUsers);
router.post('/register', register);
router.post('/additionalInfo', additionalInfo);
router.post('/login', login);
router.post('/google', googleAuth);

export default router;
