import rateLimit from "express-rate-limit";

// Rate limiter for sensitive auth endpoints - 10 attempts every 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many attempts. Please try again in 15 minutes",
    error: true,
    success: false,
  },
});
