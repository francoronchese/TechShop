import asyncHandler from "../utils/asyncHandler.js";
import CartProductModel from "../models/CartProductModel.js";
import ProductModel from "../models/ProductModel.js";
import UserModel from "../models/UserModel.js";

// GET CART CONTROLLER
export const getCart = asyncHandler(async (req, res) => {
  // Get userId from authentication middleware
  const userId = req.userId;

  // Find all cart items for this user and populate product details
  const cartItems = await CartProductModel.find({ user: userId }).populate(
    "product",
  );

  return res.json({
    message: "Cart retrieved successfully",
    error: false,
    success: true,
    data: cartItems,
  });
});

// ADD TO CART CONTROLLER
export const addToCart = asyncHandler(async (req, res) => {
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

  // Check if product exists in database
  const product = await ProductModel.findById(productId);
  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      error: true,
      success: false,
    });
  }

  // Check if product is already in the user's cart to prevent duplicates
  const existingItem = await CartProductModel.findOne({
    user: userId,
    product: productId,
  });
  if (existingItem) {
    return res.status(400).json({
      message: "Product already in cart",
      error: true,
      success: false,
    });
  }

  // Add product to cart
  const newCartItem = await CartProductModel.create({
    user: userId,
    product: productId,
    quantity: 1,
  });

  // Add cart item reference to user
  await UserModel.findByIdAndUpdate(userId, {
    $push: { shopping_cart_items: newCartItem._id },
  });

  return res.json({
    message: "Product added to cart",
    error: false,
    success: true,
    data: newCartItem,
  });
});

// UPDATE QUANTITY CONTROLLER (INCREMENT / DECREMENT)
export const updateQuantity = asyncHandler(async (req, res) => {
  // Get userId from authentication middleware
  const userId = req.userId;
  const { productId, type } = req.body; // type: 'increment' or 'decrement'

  if (!productId || !type) {
    return res.status(400).json({
      message: "Provide product ID and type",
      error: true,
      success: false,
    });
  }

  // Find cart item in the database
  const cartItem = await CartProductModel.findOne({
    user: userId,
    product: productId,
  });
  if (!cartItem) {
    return res.status(404).json({
      message: "Cart item not found",
      error: true,
      success: false,
    });
  }

  // Remove item from cart if quantity is 1 and type is decrement
  if (type === "decrement" && cartItem.quantity === 1) {
    await CartProductModel.findByIdAndDelete(cartItem._id);
    // Remove cart item reference from user
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { shopping_cart_items: cartItem._id },
    });
    return res.json({
      message: "Product removed from cart",
      error: false,
      success: true,
      data: null,
    });
  }

  // Increment or decrement quantity
  const updatedItem = await CartProductModel.findByIdAndUpdate(
    cartItem._id,
    {
      quantity:
        type === "increment" ? cartItem.quantity + 1 : cartItem.quantity - 1,
    },
    { new: true },
  ).populate("product");

  return res.json({
    message: "Cart updated successfully",
    error: false,
    success: true,
    data: updatedItem,
  });
});

// REMOVE FROM CART CONTROLLER
export const removeFromCart = asyncHandler(async (req, res) => {
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

  // Find and delete cart item from the database
  const cartItem = await CartProductModel.findOneAndDelete({
    user: userId,
    product: productId,
  });

  if (!cartItem) {
    return res.status(404).json({
      message: "Cart item not found",
      error: true,
      success: false,
    });
  }

  // Remove cart item reference from user
  await UserModel.findByIdAndUpdate(userId, {
    $pull: { shopping_cart_items: cartItem._id },
  });

  return res.json({
    message: "Product removed from cart",
    error: false,
    success: true,
  });
});

// CLEAR CART CONTROLLER
export const clearCart = asyncHandler(async (req, res) => {
  // Get userId from authentication middleware
  const userId = req.userId;

  // Delete all cart items for this user from the database
  await CartProductModel.deleteMany({ user: userId });

  // Clear cart item references from user
  await UserModel.findByIdAndUpdate(userId, {
    shopping_cart_items: [],
  });

  return res.json({
    message: "Cart cleared successfully",
    error: false,
    success: true,
  });
});

// MERGE CART CONTROLLER
export const mergeCart = asyncHandler(async (req, res) => {
  // Get userId from authentication middleware
  const userId = req.userId;
  const { items } = req.body; // Array of { productId, quantity } from localStorage

  if (!items || items.length === 0) {
    return res.json({
      message: "No items to merge",
      error: false,
      success: true,
    });
  }

  for (const item of items) {
    // Check if product already exists in the database cart
    const existingItem = await CartProductModel.findOne({
      user: userId,
      product: item.productId,
    });

    if (existingItem) {
      // Sum quantities if product already exists in backend cart
      await CartProductModel.findByIdAndUpdate(existingItem._id, {
        quantity: existingItem.quantity + item.quantity,
      });
    } else {
      // Add new item to cart
      const newItem = await CartProductModel.create({
        user: userId,
        product: item.productId,
        quantity: item.quantity,
      });
      // Add cart item reference to user
      await UserModel.findByIdAndUpdate(userId, {
        $push: { shopping_cart_items: newItem._id },
      });
    }
  }

  // Return updated cart after merge
  const updatedCart = await CartProductModel.find({ user: userId }).populate(
    "product",
  );

  return res.json({
    message: "Cart merged successfully",
    error: false,
    success: true,
    data: updatedCart,
  });
});
