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
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
} from "../controllers/userController.js";
import { authLimiter } from "../middlewares/rateLimitMiddleware.js";
import auth from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";

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

// Protected routes (Admin only)
userRouter.get("/admin/get", auth, isAdmin, getAllUsers);
userRouter.get("/admin/get/:id", auth, isAdmin, getUserById);
userRouter.put("/admin/update-status", auth, isAdmin, updateUserStatus);
userRouter.put("/admin/update-role", auth, isAdmin, updateUserRole);

export default userRouter;
