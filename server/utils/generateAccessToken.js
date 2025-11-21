import jwt from 'jsonwebtoken';

// Generates JWT access token for user authentication
// Access tokens are short-lived for security (1 hour)
const generateAccessToken = async (userId) => {
  const token = await jwt.sign(
    { userId: userId },
    process.env.SECRET_KEY_ACCESS_TOKEN,
    { expiresIn: '1h' }
  );

  return token;
};

export default generateAccessToken;
