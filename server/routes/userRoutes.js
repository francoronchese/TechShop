import { Router } from 'express';
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyEmail,
  verifyForgotPasswordOTP,
} from '../controllers/userController.js';
import { loginLimiter } from '../middlewares/rateLimitMiddleware.js';
import auth from '../middlewares/authMiddleware.js';

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/verify-email', verifyEmail);
userRouter.post('/login', loginLimiter, loginUser);
userRouter.post('/logout', auth, logoutUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/verify-forgot-password-otp', verifyForgotPasswordOTP);
userRouter.put('/reset-password', resetPassword);

export default userRouter;
