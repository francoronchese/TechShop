import UserModel from '../models/UserModel.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../services/sendEmail.js';
import asyncHandler from '../utils/asyncHandler.js';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import generateAccessToken from '../utils/generateAccessToken.js';
import generateRefreshToken from '../utils/generateRefreshToken.js';
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js';

//REGISTER CONTROLLERS
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, avatar } = req.body;

  // Validate required fields for register
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      message: 'Provide name, email and password',
      error: true,
      success: false,
    });
  }

  // Check if email has valid format;
  const emailRegex = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: 'Please provide a valid email address',
      error: true,
      success: false,
    });
  }

  // Validate password length (min 8 characters)
  if (password.length < 8) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long',
      error: true,
      success: false,
    });
  }

  //Validate password and confirm password match
  if (password !== confirmPassword) {
    return res.status(400).json({
      message: 'Passwords do not match',
      error: true,
      success: false,
    });
  }

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      message: 'Email already registered',
      error: true,
      success: false,
    });
  }

  // Hash password for security
  const hashPassword = await bcryptjs.hash(password, 14);

  // Create new user object
  const userData = {
    name,
    email,
    password: hashPassword,
    avatar,
  };
  // Save user to database
  const newUser = await UserModel.create(userData);

  // Generate verification email URL with user ID
  const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?userId=${newUser._id}`;

  // Send verification email
  const verifyEmail = await sendEmail({
    sendTo: email,
    subject: 'Verify email from TechShop',
    html: verifyEmailTemplate({
      name,
      url: verifyEmailUrl,
    }),
  });

  // Return success response with user data
  return res.json({
    message: 'User registered successfully',
    error: false,
    success: true,
    data: newUser,
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  //userId comes from the registerUser function where it's sent in the verification email
  //Frontend extracts userId from URL and sends it in request body
  //Example: http://localhost:5173/verify-email?userId=507f1f77bcf86cd799439011
  const { userId } = req.body;

  // Find user by ID from verification link
  const user = await UserModel.findOne({ _id: userId });

  // Check if user exists
  if (!user) {
    return res.status(400).json({
      message: 'Invalid verification link',
      error: true,
      success: false,
    });
  }

  // Check if email is already verified
  if (user.verify_email) {
    return res.status(400).json({
      message: 'Email already verified',
      error: true,
      success: false,
    });
  }

  // Update user to mark email as verified
  const updateUser = await UserModel.findByIdAndUpdate(userId, {
    verify_email: true,
  });

  // Return success response
  return res.json({
    message: 'Email verified successfully',
    error: false,
    success: true,
  });
});

//LOGIN CONTROLLER
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields for login
  if (!email || !password) {
    return res.status(400).json({
      message: 'Provide email and password',
      error: true,
      success: false,
    });
  }

  // Find user by email
  const user = await UserModel.findOne({ email });

  // Check if user exists
  if (!user) {
    return res.status(400).json({
      message: 'Invalid email or password',
      error: true,
      success: false,
    });
  }

  // Check if email is verified
  if (!user.verify_email) {
    return res.status(400).json({
      message:
        'Email verification required. Please check your inbox or spam folder for the verification email',
      error: true,
      success: false,
    });
  }

  // Check user account status
  if (user.status === 'Inactive') {
    return res.status(400).json({
      message: 'Account is inactive. Please contact support',
      error: true,
      success: false,
    });
  } else if (user.status === 'Suspended') {
    return res.status(400).json({
      message: 'Account is suspended. Please contact support',
      error: true,
      success: false,
    });
  }

  // Verify password matches hashed password in database
  const checkPassword = await bcryptjs.compare(password, user.password);

  if (!checkPassword) {
    return res.status(400).json({
      message: 'Invalid email or password',
      error: true,
      success: false,
    });
  }

  // Generate JWT tokens for authentication
  const accessToken = await generateAccessToken(user._id);
  const refreshToken = await generateRefreshToken(user._id);

  // Update last login timestamp
  await UserModel.findByIdAndUpdate(user._id, {
    last_login_date: new Date(),
  });

  // Configure dynamic secure cookie options based on environment
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true, // Prevent XSS attacks
    secure: isProduction, // true only in production (HTTPS), false in development (HTTP)
    sameSite: isProduction ? 'None' : 'Lax', // 'None' for cross-site in production, 'Lax' for local development
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days - persists even after browser closes
  };

  // Set tokens as HTTP-only cookies
  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, cookieOptions);

  // Return success response with user data and tokens
  return res.json({
    message: 'Login successfully',
    error: false,
    success: true,
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
});

//LOGOUT CONTROLLER
export const logoutUser = asyncHandler(async (req, res) => {
  // Get userId from authentication middleware
  const userId = req.userId;

  // Clear authentication cookies to log user out
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true, // Prevent XSS attacks
    secure: isProduction, // true only in production (HTTPS), false in development (HTTP)
    sameSite: isProduction ? 'None' : 'Lax', // 'None' for cross-site in production, 'Lax' for local development
  };

  // Remove access and refresh tokens from cookies
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  // Clear refresh_token from database for security
  await UserModel.findByIdAndUpdate(userId, {
    refresh_token: null,
  });

  // Return success response
  return res.json({
    message: 'Logout successfully',
    error: false,
    success: true,
  });
});

//REFRESH TOKEN CONTROLLER
export const refreshToken = asyncHandler(async (req, res) => {
  // Get refresh token from browser cookies
  const token = req.cookies.refreshToken;

  // Check if refresh token exists in request
  if (!token) {
    return res.status(401).json({
      message: 'Refresh token required',
      error: true,
      success: false,
    });
  }

  // Verify refresh token validity and decode user information
  const decode = await jwt.verify(token, process.env.SECRET_KEY_REFRESH_TOKEN);
  const userId = decode.userId;

  // Find user and verify refresh token matches database
  const user = await UserModel.findOne({
    _id: userId,
    refresh_token: token,
  });

  // Check if user exists with matching token
  if (!user) {
    return res.status(401).json({
      message: 'Invalid refresh token',
      error: true,
      success: false,
    });
  }

  // Generate new access token
  const newAccessToken = await generateAccessToken(userId);

  // Configure dynamic secure cookie options based on environment
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true, // Prevent XSS attacks
    secure: isProduction, // true only in production (HTTPS), false in development (HTTP)
    sameSite: isProduction ? 'None' : 'Lax', // 'None' for cross-site in production, 'Lax' for local development
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days - persists even after browser closes
  };

  // Set new access token as HTTP-only cookie
  res.cookie('accessToken', newAccessToken, cookieOptions);

  // Return success response with new access token
  return res.json({
    message: 'New access token generated',
    error: false,
    success: true,
    data: {
      accessToken: newAccessToken,
    },
  });
});

//FORGOT PASSWORD CONTROLLERS
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user by email to check if account exists
  const user = await UserModel.findOne({ email });

  // Check if user exists
  if (!user) {
    return res.status(400).json({
      message: 'No account found with this email address',
      error: true,
      success: false,
    });
  }

  // Generate cryptographically secure 6-digit OTP
  // OTP range: 100000 to 999999
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiry = new Date(Date.now() + 15 * 60 * 1000); //15min

  // Store OTP and expiration in database
  await UserModel.findByIdAndUpdate(user._id, {
    forgot_password_otp: otp,
    forgot_password_expiry: expiry,
  });

  // Send password reset OTP email
  await sendEmail({
    sendTo: email,
    subject: 'Reset password from TechShop',
    html: forgotPasswordTemplate({
      name: user.name,
      otp,
    }),
  });

  // Return success response
  return res.json({
    message: 'Password reset OTP sent to your email',
    error: false,
    success: true,
  });
});

export const verifyForgotPasswordOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Validate required fields for OTP verification
  if (!email || !otp) {
    return res.status(400).json({
      message: 'Provide email and OTP',
      error: true,
      success: false,
    });
  }

  // Find user by email
  const user = await UserModel.findOne({ email });

  // Check if user exists
  if (!user) {
    return res.status(400).json({
      message: 'No account found with this email address',
      error: true,
      success: false,
    });
  }

  // Check if OTP has expired
  const currentTime = new Date();

  if (user.forgot_password_expiry < currentTime) {
    return res.status(400).json({
      message: 'OTP has expired. Please request a new password reset',
      error: true,
      success: false,
    });
  }

  // Verify OTP matches stored OTP
  if (otp !== user.forgot_password_otp) {
    return res.status(400).json({
      message: 'Invalid OTP',
      error: true,
      success: false,
    });
  }

  // Clear OTP fields and mark password reset as verified
  await UserModel.findByIdAndUpdate(user._id, {
    forgot_password_otp: '',
    forgot_password_expiry: null,
    reset_password_verified: true, // Allow password reset after OTP verification
  });

  // Return success response
  return res.json({
    message: 'OTP verified successfully',
    error: false,
    success: true,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  // Validate required fields for password reset
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: 'Provide email, new password and confirm password',
      error: true,
      success: false,
    });
  }

  // Find user by email
  const user = await UserModel.findOne({ email });

  // Check if user exists
  if (!user) {
    return res.status(400).json({
      message: 'No account found with this email address',
      error: true,
      success: false,
    });
  }
  
  // Check if OTP was verified before allowing password reset
  if (!user.reset_password_verified) {
    return res.status(400).json({
      message: 'OTP verification required. Please verify your OTP first',
      error: true,
      success: false,
    });
  }

  // Validate new password and confirm password match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: 'Passwords do not match',
      error: true,
      success: false,
    });
  }

  // Hash new password for security
  const hashPassword = await bcryptjs.hash(newPassword, 14);

  // Update user password and clear reset verification flag
  await UserModel.findByIdAndUpdate(user._id, {
    password: hashPassword,
    reset_password_verified: false, // Clear flag after successful password reset
  });

  // Return success response
  return res.json({
    message: 'Password updated successfully',
    error: false,
    success: true,
  });
});

//GET CURRENT USER CONTROLLER
// Retrieves logged-in user details (requires authentication)
export const getCurrentUser = asyncHandler(async (req, res) => {
  // Extract userId from authentication middleware
  const userId = req.userId;

  // Find user by ID, exclude sensitive information
  const user = await UserModel.findById(userId).select(
    '-password -refresh_token'
  );

  // Check if user exists
  if (!user) {
    return res.status(404).json({
      message: 'User not found',
      error: true,
      success: false,
    });
  }

  // Return success response
  return res.json({
    message: 'User details retrieved successfully',
    error: false,
    success: true,
    data: user,
  });
});

//UPDATE PROFILE CONTROLLER
export const updateProfile = asyncHandler(async (req, res) => {
  // Extract userId from authentication middleware
  const userId = req.userId;
  // Extract profile update fields from request body
  const { name, avatar, mobile } = req.body;

  //Validate name is not empty string
  if (name === '') {
    return res.status(400).json({
      message: 'Name must not be empty',
      error: true,
      success: false,
    });
  }

  // Update user in database, exclude sensitive information
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    {
      name,
      avatar,
      mobile,
    },
    { new: true } // Return the updated document instead of the old one
  ).select('-password -refresh_token');

  // Return success response
  return res.json({
    message: 'Profile updated successfully',
    error: false,
    success: true,
    data: updatedUser,
  });
});

// DELETE ACCOUNT CONTROLLER - Hard Delete (Permanent)
export const deleteUser = asyncHandler(async (req, res) => {
  // Get userId from authentication middleware
  const userId = req.userId;

  // Find user by ID to verify existence before deletion
  const user = await UserModel.findById(userId);

  // Check if user exists in database
  if (!user) {
    return res.status(404).json({
      message: 'User not found',
      error: true,
      success: false,
    });
  }

  // Permanent delete user from database
  await UserModel.findByIdAndDelete(userId);

  // Clear authentication cookies to log user out immediately
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true, // Prevent XSS attacks
    secure: isProduction, // true only in production (HTTPS), false in development (HTTP)
    sameSite: isProduction ? 'None' : 'Lax', // 'None' for cross-site in production, 'Lax' for local development
  };

  // Remove access and refresh tokens from cookies
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  // Return success response
  return res.json({
    message: 'Account permanently deleted successfully',
    error: false,
    success: true,
  });
});
