import { Router } from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyEmail,
} from '../controllers/userController.js';
import { loginLimiter } from '../middlewares/rateLimitMiddleware.js';
import auth from '../middlewares/authMiddleware.js';

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/verify-email', verifyEmail);
userRouter.post('/login', loginLimiter, loginUser);
userRouter.get('/logout', auth, logoutUser);

export default userRouter;
