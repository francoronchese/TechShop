import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const { DB_PROTOCOL, DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_OPTIONS } =
  process.env;
const MONGODB_URI = `${DB_PROTOCOL}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?${DB_OPTIONS}`;

if (!MONGODB_URI) {
  throw new Error('Please provide MONGODB_URI in the .env file');
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log('MongoDB connection error: ', error);
    process.exit(1);
  }
};

export default connectDB;
