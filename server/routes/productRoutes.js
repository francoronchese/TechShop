import { Router } from "express";
import auth from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const productRouter = Router();

// Public routes
productRouter.get("/get", getAllProducts);
productRouter.get("/get/:id", getProduct);
// Protected routes (Admin Only)
productRouter.post("/create", auth, isAdmin, createProduct);
productRouter.put("/update", auth, isAdmin, updateProduct);
productRouter.delete("/delete", auth, isAdmin, deleteProduct);

export default productRouter;
