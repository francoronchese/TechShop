import { Router } from "express";
import auth from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/CategoryController.js";

const categoryRouter = Router();

// Public routes
categoryRouter.get("/get", getAllCategories);
// Protected routes (Admin Only)
categoryRouter.post("/create", auth, isAdmin, createCategory);
categoryRouter.put("/update", auth, isAdmin, updateCategory);
categoryRouter.delete("/delete", auth, isAdmin, deleteCategory);

export default categoryRouter;
