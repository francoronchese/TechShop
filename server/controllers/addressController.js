import asyncHandler from "../utils/asyncHandler.js";
import AddressModel from "../models/AddressModel.js";
import UserModel from "../models/UserModel.js";

// ADD ADDRESS CONTROLLER
export const addAddress = asyncHandler(async (req, res) => {
  // Get userId from authentication middleware
  const userId = req.userId;
  const { address, city, state, country, postal_code } = req.body;

  // Validate required fields
  if (!address || !city || !state || !country || !postal_code) {
    return res.status(400).json({
      message: "Provide all address fields",
      error: true,
      success: false,
    });
  }

  // Create new address
  const newAddress = await AddressModel.create({
    address,
    city,
    state,
    country,
    postal_code,
  });

  // Add address reference to user
  await UserModel.findByIdAndUpdate(userId, {
    $push: { addresses: newAddress._id },
  });

  return res.json({
    message: "Address added successfully",
    error: false,
    success: true,
    data: newAddress,
  });
});

// GET ADDRESSES CONTROLLER
export const getAddresses = asyncHandler(async (req, res) => {
  // Get userId from authentication middleware
  const userId = req.userId;

  // Find user and populate addresses
  const user = await UserModel.findById(userId).populate("addresses");

  return res.json({
    message: "Addresses retrieved successfully",
    error: false,
    success: true,
    data: user.addresses,
  });
});

// DELETE ADDRESS CONTROLLER
export const deleteAddress = asyncHandler(async (req, res) => {
  // Get userId from authentication middleware
  const userId = req.userId;
  const { _id } = req.body;

  // Validate required ID
  if (!_id) {
    return res.status(400).json({
      message: "Provide address ID",
      error: true,
      success: false,
    });
  }

  // Delete address from database
  await AddressModel.findByIdAndDelete(_id);

  // Remove address reference from user
  await UserModel.findByIdAndUpdate(userId, {
    $pull: { addresses: _id },
  });

  return res.json({
    message: "Address deleted successfully",
    error: false,
    success: true,
  });
});
