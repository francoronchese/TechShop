import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorMiddleware from "./middlewares/errorMiddleware.js";

import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import subCategoryRouter from "./routes/SubCategoryRoutes.js";

// Load environment variables based on current environment
// This ensures correct .env file is loaded (development vs production)
dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

const app = express();

// Middleware for parsing JSON request bodies
app.use(express.json());

// Security headers middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allow loading images from Cloudinary
  }),
);

// CORS configuration for frontend communication
app.use(
  cors({
    credentials: true, // Allow cookies to be sent
    origin: process.env.FRONTEND_URL, // Only allow requests from frontend
  }),
);

// Middleware for parsing cookies
app.use(cookieParser());

// HTTP request logger for debugging
app.use(morgan("combined"));

const PORT = process.env.PORT || 3000;

// API routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/sub-category", subCategoryRouter);

// Error handler
app.use(errorMiddleware);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode at http://localhost:${PORT}`,
    );
  });
});
