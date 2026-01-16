import { Router } from "express";
import auth from "../middlewares/authMiddleware.js";
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
subCategoryRouter.post("/create", auth, createSubCategory);
subCategoryRouter.put("/update", auth, updateSubCategory);
subCategoryRouter.delete("/delete", auth, deleteSubCategory);

export default subCategoryRouter;
