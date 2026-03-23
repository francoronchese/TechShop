import asyncHandler from "../utils/asyncHandler.js";
import UserModel from "../models/UserModel.js";

// ADD TO FAVORITES CONTROLLER
export const addToFavorites = asyncHandler(async (req, res) => {
  // Get userId from authentication middleware
  const userId = req.userId;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({
      message: "Provide product ID",
      error: true,
      success: false,
    });
  }

  // Add product reference to favorites
  await UserModel.findByIdAndUpdate(userId, {
    $push: { favorites: productId },
  });

  return res.json({
    message: "Product added to favorites",
    error: false,
    success: true,
  });
});

// GET FAVORITES CONTROLLER
export const getFavorites = asyncHandler(async (req, res) => {
  // Get userId from authentication middleware
  const userId = req.userId;

  // Find user and populate favorites with product details
  const user = await UserModel.findById(userId).populate("favorites");

  return res.json({
    message: "Favorites retrieved successfully",
    error: false,
    success: true,
    data: user.favorites,
  });
});

// REMOVE FROM FAVORITES CONTROLLER
export const removeFromFavorites = asyncHandler(async (req, res) => {
  // Get userId from authentication middleware
  const userId = req.userId;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({
      message: "Provide product ID",
      error: true,
      success: false,
    });
  }

  // Remove product reference from favorites
  await UserModel.findByIdAndUpdate(userId, {
    $pull: { favorites: productId },
  });

  return res.json({
    message: "Product removed from favorites",
    error: false,
    success: true,
  });
});
