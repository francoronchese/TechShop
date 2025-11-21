import rateLimit from 'express-rate-limit';

// Rate limiter for login - 10 attempts every 10 minutes
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: {
    message:
      'Too many login attempts. Please try again in 10 minutes or reset your password',
    error: true,
    success: false,
  },
});
