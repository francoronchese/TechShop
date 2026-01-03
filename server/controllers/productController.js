import ProductModel from '../models/ProductModel.js';
import asyncHandler from '../utils/asyncHandler.js';

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
    publish,
  } = req.body;

  // Validate required fields for product creation
  if (
    !name ||
    !image?.[0] ||
    !categories?.[0] ||
    !subCategories?.[0] ||
    !price ||
    !description
  ) {
    return res.status(400).json({
      message:
        'Provide name, image, categories, sub categories, price and description',
      error: true,
      success: false,
    });
  }

  //Check if product already exists
  const existingProduct = await ProductModel.findOne({ name });
  if (existingProduct) {
    return res.status(400).json({
      message: 'Product name already exists',
      error: true,
      success: false,
    });
  }

  // Create new product object
  const productData = {
    name,
    image,
    categories,
    sub_categories: subCategories,
    stock,
    price,
    discount,
    description,
    publish,
  };
  // Save product to database
  const newProduct = await ProductModel.create(productData);

  // Return success response with the created product data
  return res.json({
    message: 'Product created successfully',
    error: false,
    success: true,
    data: newProduct,
  });
});
