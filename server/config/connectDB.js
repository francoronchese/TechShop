import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

const { DB_PROTOCOL, DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_OPTIONS } =
  process.env;

// Validate required env variables before building the URI
if (!DB_PROTOCOL || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_NAME) {
  throw new Error('Missing required database environment variables');
}

const MONGODB_URI = `${DB_PROTOCOL}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?${DB_OPTIONS}`;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log('MongoDB connection error: ', error);
    process.exit(1); // Exit Node.js process with failure code to prevent hanging
  }
};

export default connectDB;
