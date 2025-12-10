import { Router } from 'express';
import {
  forgotPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateProfile,
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
userRouter.get('/user-details', auth, getCurrentUser);
userRouter.put('/update-profile', updateProfile);

export default userRouter;
