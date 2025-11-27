import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './routes/userRoutes.js';

const app = express();
// Middleware for parsing JSON request bodies
app.use(express.json());
// Security headers middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allow loading images from Cloudinary
  })
);
// CORS configuration for frontend communication
app.use(
  cors({
    credentials: true, // Allow cookies to be sent
    origin: process.env.FRONTEND_URL, // Only allow requests from frontend
  })
);
// Middleware for parsing cookies
app.use(cookieParser());
// HTTP request logger
app.use(morgan('combined'));

const PORT = process.env.PORT || 3000;

app.use('/api/user', userRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
