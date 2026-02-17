import ProductModel from "../models/ProductModel.js";
import asyncHandler from "../utils/asyncHandler.js";

// CREATE PRODUCT CONTROLLER
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    image,
    categories,
    subCategories,
    stock,
    price,
    discount,
    description,
  } = req.body;

  // Validate required fields for product creation
  if (
    !name ||
    !image || image.length === 0 ||
    !categories || categories.length === 0 ||
    !subCategories || subCategories.length === 0 ||
    !price ||
    !description
  ) {
    return res.status(400).json({
      message:
        "Provide name, image, categories, sub categories, price and description",
      error: true,
      success: false,
    });
  }

  // Check if product already exists
  const existingProduct = await ProductModel.findOne({ name });
  if (existingProduct) {
    return res.status(400).json({
      message: "Product name already exists",
      error: true,
      success: false,
    });
  }

  // Create new product object
  const productData = {
    name,
    image,
    categories,
    sub_categories: subCategories, //frontend sends subCategories, model expects sub_categories
    stock,
    price,
    discount,
    description,
  };
  // Save product to database
  const newProduct = await ProductModel.create(productData);

  // Return success response with the created product data
  return res.json({
    message: "Product created successfully",
    error: false,
    success: true,
    data: newProduct,
  });
});

// GET ALL PRODUCTS CONTROLLER
export const getAllProducts = asyncHandler(async (req, res) => {
  // Get pagination values from query or set defaults
  // page: current page number, limit: items per page
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Fetch products and total count in parallel for performance
  // populate() is used to include full category and sub-category objects
  const [data, count] = await Promise.all([
    ProductModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("categories sub_categories"),
    ProductModel.countDocuments(),
  ]);

  // Calculate total pages based on count and limit
  const totalPages = Math.ceil(count / limit);

  // Return success response with products data and pagination metadata
  const response = {
    message: "Products retrieved successfully",
    error: false,
    success: true,
    data: data,
    totalCount: count,
    totalPages: totalPages,
    // Helper objects for frontend navigation
    previous:
      page > 1 && page <= totalPages
        ? {
            page: page - 1,
            limit,
          }
        : null,
    next:
      page < totalPages && page >= 1
        ? {
            page: page + 1,
            limit,
          }
        : null,
  };

  // Return success response with products and pagination
  return res.json(response);
});

// GET PRODUCT CONTROLLER (SINGLE PRODUCT)
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate required ID
  if (!id) {
    return res.status(400).json({
      message: "Provide product ID",
      error: true,
      success: false,
    });
  }

  // Find product by ID and populate relations
  const product = await ProductModel.findById(id).populate(
    "categories sub_categories",
  );

  // Check if product exists in database
  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      error: true,
      success: false,
    });
  }

  // Return success response with product details data
  return res.json({
    message: "Product details loaded",
    error: false,
    success: true,
    data: product,
  });
});

// GET PRODUCTS BY CATEGORY AND SUB-CATEGORY
export const getProductsByCategoryAndSubCategory = asyncHandler(
  async (req, res) => {
    const { categoryId, subCategoryId } = req.query;

    // Get pagination values from query or set defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate required IDs for filtering
    if (!categoryId || !subCategoryId) {
      return res.status(400).json({
        message: "Provide categoryId and subCategoryId",
        error: true,
        success: false,
      });
    }

    // Create query filter for categories and sub categories
    const query = {
      categories: { $in: [categoryId] },
      sub_categories: { $in: [subCategoryId] },
    };

    // Fetch filtered products and count in parallel for performance
    const [data, count] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("categories sub_categories"),
      ProductModel.countDocuments(query),
    ]);

    // Calculate total pages for filtered results
    const totalPages = Math.ceil(count / limit);

    // Return success response with filtered data and pagination
    return res.json({
      message: "Products retrieved successfully",
      error: false,
      success: true,
      data: data,
      totalCount: count,
      totalPages: totalPages,
      previous:
        page > 1 && page <= totalPages
          ? {
              page: page - 1,
              limit,
            }
          : null,
      next:
        page < totalPages && page >= 1
          ? {
              page: page + 1,
              limit,
            }
          : null,
    });
  },
);

// UPDATE PRODUCT CONTROLLER
export const updateProduct = asyncHandler(async (req, res) => {
  const {
    _id,
    name,
    image,
    categories,
    subCategories,
    stock,
    price,
    discount,
    description,
  } = req.body;

  // Validate required ID for update
  if (!_id) {
    return res.status(400).json({
      message: "Provide product ID",
      error: true,
      success: false,
    });
  }

  // Check if the new name is already taken by another product (excluding current ID)
  if (name) {
    const existingProduct = await ProductModel.findOne({
      name,
      _id: { $ne: _id },
    });

    if (existingProduct) {
      return res.status(400).json({
        message: "Product name already exists",
        error: true,
        success: false,
      });
    }
  }

  // Create update product object
  const updateData = {
    name,
    image,
    categories,
    sub_categories: subCategories,
    stock,
    price,
    discount,
    description,
  };

  // Update product in database and return new data
  const updatedProduct = await ProductModel.findByIdAndUpdate(_id, updateData, {
    new: true,
  });

  // Return success response
  return res.json({
    message: "Product updated successfully",
    error: false,
    success: true,
    data: updatedProduct,
  });
});

// DELETE PRODUCT CONTROLLER
export const deleteProduct = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  // Validate required ID for deletion
  if (!_id) {
    return res.status(400).json({
      message: "Provide product ID",
      error: true,
      success: false,
    });
  }

  // Permanent delete from database
  await ProductModel.findByIdAndDelete(_id);

  // Return success response
  return res.json({
    message: "Product deleted successfully",
    error: false,
    success: true,
  });
});
