import asyncHandler from '../utils/asyncHandler.js';
import SubCategoryModel from '../models/SubCategoryModel.js';
import ProductModel from '../models/ProductModel.js';

// CREATE SUB-CATEGORY CONTROLLER
export const createSubCategory = asyncHandler(async (req, res) => {
  const { name, categories } = req.body;

  // Validate required fields for sub-category creation
  // categories[0] ensures the array is not empty
  if (!name || !categories || !categories[0]) {
    return res.status(400).json({
      message: 'Provide name and at least one category',
      error: true,
      success: false,
    });
  }

  // Check if sub-category already exists
  const existingSubCategory = await SubCategoryModel.findOne({ name });
  if (existingSubCategory) {
    return res.status(400).json({
      message: 'Sub-category name already exists',
      error: true,
      success: false,
    });
  }

  // Create new sub-category object
  const subCategoryData = {
    name,
    categories,
  };
  // Save sub-category to database
  const newSubCategory = await SubCategoryModel.create(subCategoryData);

  // Return success response with the created data
  return res.json({
    message: 'Sub-category created successfully',
    error: false,
    success: true,
    data: newSubCategory,
  });
});

// GET ALL SUB-CATEGORIES CONTROLLER
export const getSubCategories = asyncHandler(async (req, res) => {
  // Get all sub-categories and populate the categories array
  const data = await SubCategoryModel.find()
    .sort({ createdAt: -1 })
    .populate('categories');

  // Return success response with sub-categories data
  return res.json({
    message: 'Sub-categories retrieved successfully',
    error: false,
    success: true,
    data: data,
  });
});

// UPDATE SUB-CATEGORY CONTROLLER
export const updateSubCategory = asyncHandler(async (req, res) => {
  const { _id, name, categories } = req.body;

  // Validate required ID for update
  if (!_id) {
    return res.status(400).json({
      message: 'Provide sub-category ID',
      error: true,
      success: false,
    });
  }

  // Update sub-category in database
  const updatedSubCategory = await SubCategoryModel.findByIdAndUpdate(
    _id,
    {
      name,
      categories,
    },
    { new: true } // Return the updated document instead of the old one
  );

  // Return success response with updated data
  return res.json({
    message: 'Sub-category updated successfully',
    error: false,
    success: true,
    data: updatedSubCategory,
  });
});

// DELETE SUB-CATEGORY CONTROLLER
export const deleteSubCategory = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  // Validate required ID for deletion
  if (!_id) {
    return res.status(400).json({
      message: 'Provide sub-category ID',
      error: true,
      success: false,
    });
  }

  // Check if sub-category has linked products
  const productCount = await ProductModel.countDocuments({
    sub_categories: { $in: [_id] },
  });

  // Prevent deletion if the sub-category is still associated with products
  if (productCount > 0) {
    return res.status(400).json({
      message: 'Cannot delete: Sub-category has active products',
      error: true,
      success: false,
    });
  }

  // Permanent delete from database
  await SubCategoryModel.findByIdAndDelete(_id);

  // Success response
  return res.json({
    message: 'Sub-category deleted successfully',
    error: false,
    success: true,
  });
});
