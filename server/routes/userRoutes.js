import { Router } from "express";
import {
  deleteUser,
  forgotPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  resetPassword,
  updateProfile,
  verifyEmail,
  verifyForgotPasswordOTP,
} from "../controllers/userController.js";
import { authLimiter } from "../middlewares/rateLimitMiddleware.js";
import auth from "../middlewares/authMiddleware.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/login", authLimiter, loginUser);
userRouter.post("/logout", auth, logoutUser);
userRouter.post("/forgot-password", authLimiter, forgotPassword);
userRouter.post(
  "/verify-forgot-password-otp",
  authLimiter,
  verifyForgotPasswordOTP,
);
userRouter.put("/reset-password", resetPassword);
userRouter.get("/user-details", auth, getCurrentUser);
userRouter.put("/update-profile", auth, updateProfile);
userRouter.post("/refresh-token", refreshToken);
userRouter.delete("/delete-account", auth, deleteUser);

export default userRouter;
