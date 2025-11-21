import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

// Creates JWT refresh token for maintaining user sessions
// Refresh tokens last 7 days to keep users logged in
const generateRefreshToken = async (userId) => {
  const token = await jwt.sign(
    { userId: userId },
    process.env.SECRET_KEY_REFRESH_TOKEN,
    { expiresIn: '7d' }
  );

  // Store refresh token in database to validate future token refresh requests
  const updateRefreshToken = await UserModel.findByIdAndUpdate(userId, {
    refresh_token: token,
  });

  return token;
};

export default generateRefreshToken;
