import UserModel from '../models/UserModel.js';
import bcryptjs from 'bcryptjs';
import sendEmail from '../services/sendEmail.js';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import generateAccessToken from '../utils/generateAccessToken.js';
import generateRefreshToken from '../utils/generateRefreshToken.js';

//REGISTER CONTROLLERS
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword,avatar} = req.body;

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
      avatar
    };
    // Save user to database
    const newUser = await UserModel.create(userData);

    // Generate verification email URL with user ID
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?userId=${newUser?._id}`;

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
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//LOGIN CONTROLLER
export const loginUser = async (req, res) => {
  try {
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
        message: 'Please verify your email before logging in',
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

    // Configure secure cookie options
    const cookieOptions = {
      httpOnly: true, // Prevent XSS attacks
      secure: true, // Only send over HTTPS
      sameSite: 'None', // Allow cross-site requests
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
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//LOGOUT CONTROLLER
export const logoutUser = async (req, res) => {
  try {
    // Get userId from authentication middleware
    const userId = req.userId;

    // Clear authentication cookies to log user out
    const cookieOptions = {
      httpOnly: true, // Prevent XSS attacks
      secure: true, // Only send over HTTPS
      sameSite: 'None', // Allow cross-site requests
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
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
