import jwt from 'jsonwebtoken';

// Verify user authentication for protected routes
// Checks if user is logged in before allowing access to secure endpoints
const auth = async (req, res, next) => {
  try {
    // Get access token from browser cookies
    const token = req.cookies.accessToken;

    // Check if token exists in request
    if (!token) {
      return res.status(401).json({
        message: 'Authentication token required',
        error: true,
        success: false,
      });
    }

    // Verify token validity and decode user information
    const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    // Add user ID to request for use in protected route controllers
    req.userId = decode.userId;

    next();
  } catch (error) {
    // Handle invalid or expired token errors
    return res.status(401).json({
      message: 'Invalid or expired token',
      error: true,
      success: false,
    });
  }
};

export default auth;
