import UserModel from "../models/UserModel.js";

// Verify user has Admin or SuperAdmin role for protected admin routes
// Used after auth middleware (it requires req.userId to be set)
const isAdmin = async (req, res, next) => {
  try {
    // Find user by ID set by auth middleware
    const user = await UserModel.findById(req.userId);

    // Check if user exists and has Admin or SuperAdmin role
    if (!user || (user.role !== "Admin" && user.role !== "SuperAdmin")) {
      return res.status(403).json({
        message: "Access denied. Admin only.",
        error: true,
        success: false,
      });
    }

    // Attach role to request for use in controllers
    req.userRole = user.role;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Access denied. Admin only.",
      error: true,
      success: false,
    });
  }
};

export default isAdmin;
