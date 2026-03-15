import asyncHandler from "../utils/asyncHandler.js";
import CategoryModel from "../models/CategoryModel.js";
import SubCategoryModel from "../models/SubCategoryModel.js";
import ProductModel from "../models/ProductModel.js";

// CREATE CATEGORY CONTROLLER
export const createCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;

  // Validate required fields for category creation
  if (!name || !image) {
    return res.status(400).json({
      message: "Provide name and image",
      error: true,
      success: false,
    });
  }

  // Check if category already exists
  const existingCategory = await CategoryModel.findOne({ name });
  if (existingCategory) {
    return res.status(400).json({
      message: "Category name already exists",
      error: true,
      success: false,
    });
  }

  // Create new category object
  const categoryData = {
    name,
    image,
  };
  // Save category to database
  const newCategory = await CategoryModel.create(categoryData);

  // Return success response with the created category data
  return res.json({
    message: "Category created successfully",
    error: false,
    success: true,
    data: newCategory,
  });
});

// GET ALL CATEGORIES CONTROLLER
export const getAllCategories = asyncHandler(async (req, res) => {
  // Find all categories, sort by newest first
  const data = await CategoryModel.find().sort({ createdAt: -1 });

  // Return success response with categories data
  return res.json({
    message: "Categories retrieved successfully",
    error: false,
    success: true,
    data: data,
  });
});

// UPDATE CATEGORY CONTROLLER
export const updateCategory = asyncHandler(async (req, res) => {
  const { _id, name, image } = req.body;

  // Validate required ID for update
  if (!_id) {
    return res.status(400).json({
      message: "Provide category ID",
      error: true,
      success: false,
    });
  }

  // Check if the new name is already taken by another category (excluding current ID)
  if (name) {
    const existingCategory = await CategoryModel.findOne({
      name,
      _id: { $ne: _id },
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category name already exists",
        error: true,
        success: false,
      });
    }
  }

  // Update category in database
  const updatedCategory = await CategoryModel.findByIdAndUpdate(
    _id,
    {
      name,
      image,
    },
    { new: true }, // Return the updated document instead of the old one
  );

  // Return success response with updated data
  return res.json({
    message: "Category updated successfully",
    error: false,
    success: true,
    data: updatedCategory,
  });
});

// DELETE CATEGORY CONTROLLER
export const deleteCategory = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  // Validate required ID for deletion
  if (!_id) {
    return res.status(400).json({
      message: "Provide category ID",
      error: true,
      success: false,
    });
  }

  // Check if category has linked subcategories or products
  // The $in operator checks if the category ID exists within the categories array of product and subCategory
  const [subCategoryCount, productCount] = await Promise.all([
    SubCategoryModel.countDocuments({ categories: { $in: [_id] } }),
    ProductModel.countDocuments({ categories: { $in: [_id] } }),
  ]);

  // Prevent deletion if the category is still associated with other data
  if (subCategoryCount > 0 || productCount > 0) {
    return res.status(400).json({
      message: "Cannot delete: Category has active subcategories or products",
      error: true,
      success: false,
    });
  }

  // Permanent delete from database
  await CategoryModel.findByIdAndDelete(_id);

  // Success response
  return res.json({
    message: "Category deleted successfully",
    error: false,
    success: true,
  });
});
