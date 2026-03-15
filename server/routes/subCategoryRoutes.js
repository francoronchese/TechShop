import { Router } from "express";
import auth from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";
import {
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/SubCategoryController.js";

const subCategoryRouter = Router();

// Public routes
subCategoryRouter.get("/get", getSubCategories);
// Protected routes (Admin only)
subCategoryRouter.post("/create", auth, isAdmin, createSubCategory);
subCategoryRouter.put("/update", auth, isAdmin, updateSubCategory);
subCategoryRouter.delete("/delete", auth, isAdmin, deleteSubCategory);

export default subCategoryRouter;
