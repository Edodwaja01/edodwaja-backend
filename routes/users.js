import express from 'express';
import {
  getAllUsers,
  googleAuth,
  register,
  login,
  additionalInfo,
  reportIssue,
  validUser,
  getUser,
} from '../controllers/users.js';
import { AuthenticateUser } from '../middlewares/user.js';
const router = express.Router();
router.get('/', getAllUsers);
router.post('/register', register);
router.patch('/additionalInfo', additionalInfo);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/reportIssue', reportIssue);
router.get('/validUser', AuthenticateUser, validUser);
router.get('/user/:userId', getUser);

export default router;
