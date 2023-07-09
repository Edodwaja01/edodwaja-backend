import express from 'express';
import {
  getAllUsers,
  googleAuth,
  register,
  login,
} from '../controllers/users.js';
const router = express.Router();
router.get('/', getAllUsers);
router.post('/register', register);
router.post('/login', login);

router.post('/google', googleAuth);

export default router;
