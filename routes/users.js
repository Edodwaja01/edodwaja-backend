import express from 'express';
import {
  getAllUsers,
  googleAuth,
  register,
  login,
  additionalInfo,
  reportIssue,
  validUser,
} from '../controllers/users.js';
import { AuthenticateUser } from '../middlewares/user.js';
const router = express.Router();
router.get('/', getAllUsers);
router.post('/register', register);
router.post('/additionalInfo', additionalInfo);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/reportIssue', reportIssue);
router.get('/validUser', AuthenticateUser, validUser);

export default router;
