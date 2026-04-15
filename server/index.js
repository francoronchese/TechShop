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
import subCategoryRouter from "./routes/subCategoryRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import addressRouter from "./routes/addressRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import favoriteRouter from "./routes/favoriteRoutes.js";

// Load environment variables based on current environment
// This ensures correct .env file is loaded (development vs production)
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.development" });
}

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

// Root route to verify server status
app.get("/", (req, res) => {
  res.json({
    message: "Server is running smoothly!",
    status: "OK",
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/sub-category", subCategoryRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/favorite", favoriteRouter);

// Error handler
app.use(errorMiddleware);

// Execute database connection
connectDB().catch((err) => console.error("MongoDB connection error:", err));

// Only start the listener in local development
// Vercel handles the execution in production via the exported app
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode at http://localhost:${PORT}`,
    );
  });
}

export default app;
