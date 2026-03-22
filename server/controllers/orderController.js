import asyncHandler from "../utils/asyncHandler.js";
import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";
import CartModel from "../models/CartModel.js";
import UserModel from "../models/UserModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CREATE ORDER CONTROLLER
export const createOrder = asyncHandler(async (req, res) => {
  // Get userId from authentication middleware
  const userId = req.userId;
  const { items, total, shippingAddress, paymentMethod } = req.body;

  // Validate required fields
  if (!items || items.length === 0) {
    return res.status(400).json({
      message: "Provide order items",
      error: true,
      success: false,
    });
  }

  if (!shippingAddress) {
    return res.status(400).json({
      message: "Provide shipping address",
      error: true,
      success: false,
    });
  }

  if (!paymentMethod) {
    return res.status(400).json({
      message: "Provide payment method",
      error: true,
      success: false,
    });
  }

  // Decrease stock for each product in the order
  for (const item of items) {
    const product = await ProductModel.findById(item.productId);
    if (!product) {
      return res.status(404).json({
        message: `Product not found`,
        error: true,
        success: false,
      });
    }
    // Check if there is enough stock
    if (product.stock < item.quantity) {
      return res.status(400).json({
        message: `Insufficient stock for ${product.name}`,
        error: true,
        success: false,
      });
    }
    // $inc operator atomically increments or decrements a field, negative value decrements
    await ProductModel.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  // Create order object
  const orderData = {
    user: userId,
    items: items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
    total,
    shippingAddress,
    paymentMethod,
    // Cash on delivery orders are confirmed immediately
    orderStatus: paymentMethod === "cash_on_delivery" ? "confirmed" : "pending",
    paymentStatus: paymentMethod === "cash_on_delivery" ? "pending" : "pending",
  };

  // Save order to database
  const newOrder = await OrderModel.create(orderData);

  // Add order reference to user
  await UserModel.findByIdAndUpdate(userId, {
    $push: { orders: newOrder._id },
  });

  // Clear cart after order is created
  await CartModel.deleteMany({ user: userId });
  await UserModel.findByIdAndUpdate(userId, {
    shopping_cart_items: [],
  });

  // Return success response
  return res.json({
    message: "Order created successfully",
    error: false,
    success: true,
    data: newOrder,
  });
});

// CREATE CHECKOUT SESSION CONTROLLER (STRIPE)
export const createCheckoutSession = asyncHandler(async (req, res) => {
  // Get userId from authentication middleware
  const userId = req.userId;
  const { items, total, shippingAddress, paymentMethod, email } = req.body;

  // Validate required fields
  if (!items || items.length === 0) {
    return res.status(400).json({
      message: "Provide order items",
      error: true,
      success: false,
    });
  }

  if (!shippingAddress) {
    return res.status(400).json({
      message: "Provide shipping address",
      error: true,
      success: false,
    });
  }

  // Validate stock for each product before creating the session
  for (const item of items) {
    const product = await ProductModel.findById(item.productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({
        message: `Insufficient stock for ${product.name}`,
        error: true,
        success: false,
      });
    }
  }

  // Create Stripe Checkout Session with order items
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email, // Pre-fill email from logged in user
    line_items: [
      ...items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.image ? [item.image[0]] : [],
            // Store productId in product metadata to retrieve it in confirmStripeOrder
            metadata: {
              productId: item.productId,
            },
          },
          // Stripe requires amount in smallest currency unit — 100 cents = $1.00
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      // Add shipping cost if subtotal is less than $200
      ...(total < 200
        ? [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Shipping",
                },
                unit_amount: 1000, // $10.00
              },
              quantity: 1,
            },
          ]
        : []),
    ],
    success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/checkout`,
    metadata: {
      userId,
      shippingAddress: JSON.stringify(shippingAddress),
      paymentMethod,
    },
  });

  return res.json({
    message: "Checkout session created successfully",
    error: false,
    success: true,
    data: {
      url: session.url,
    },
  });
});

// CONFIRM STRIPE ORDER CONTROLLER
// Called after Stripe redirects to success_url with session_id
export const confirmStripeOrder = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  const userId = req.userId;

  if (!sessionId) {
    return res.status(400).json({
      message: "Provide session ID",
      error: true,
      success: false,
    });
  }

  // Retrieve session from Stripe to verify payment
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // Check if payment was successful
  if (session.payment_status !== "paid") {
    return res.status(400).json({
      message: "Payment not completed",
      error: true,
      success: false,
    });
  }

  // Check if order already exists for this payment to prevent duplicates
  const existingOrder = await OrderModel.findOne({
    stripePaymentId: session.payment_intent,
  });
  if (existingOrder) {
    return res.json({
      message: "Order already confirmed",
      error: false,
      success: true,
      data: existingOrder,
    });
  }

  // Extract order data from session metadata
  const shippingAddress = JSON.parse(session.metadata.shippingAddress);
  const paymentMethod = session.metadata.paymentMethod;

  // Retrieve line items with expanded product data to access productId from metadata
  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    expand: ["data.price.product"],
  });

  // Map line items to order items, excluding shipping
  const items = lineItems.data
    .filter((item) => item.description !== "Shipping")
    .map((item) => ({
      productId: item.price.product.metadata.productId,
      quantity: item.quantity,
      price: item.price.unit_amount / 100,
    }));

  // Decrease stock for each product in the order
  for (const item of items) {
    // $inc operator atomically increments or decrements a field, negative value decrements
    await ProductModel.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  // Create order in database
  const newOrder = await OrderModel.create({
    user: userId,
    items: items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
    total: session.amount_total / 100,
    shippingAddress,
    paymentMethod,
    orderStatus: "confirmed",
    paymentStatus: "paid",
    stripePaymentId: session.payment_intent,
  });

  // Add order reference to user
  await UserModel.findByIdAndUpdate(userId, {
    $push: { orders: newOrder._id },
  });

  // Clear cart after order is created
  await CartModel.deleteMany({ user: userId });
  await UserModel.findByIdAndUpdate(userId, {
    shopping_cart_items: [],
  });

  return res.json({
    message: "Order confirmed successfully",
    error: false,
    success: true,
    data: newOrder,
  });
});

// GET USER ORDERS CONTROLLER
export const getOrders = asyncHandler(async (req, res) => {
  // Get userId from authentication middleware
  const userId = req.userId;

  // Find all orders for this user and populate product details
  const orders = await OrderModel.find({ user: userId })
    .populate({
      path: "items.product",
    })
    .sort({ createdAt: -1 });

  return res.json({
    message: "Orders retrieved successfully",
    error: false,
    success: true,
    data: orders,
  });
});

// GET ORDER BY ID CONTROLLER
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!id) {
    return res.status(400).json({
      message: "Provide order ID",
      error: true,
      success: false,
    });
  }

  // Find order by ID and verify it belongs to the authenticated user
  const order = await OrderModel.findOne({ _id: id, user: userId }).populate({
    path: "items.product",
  });

  if (!order) {
    return res.status(404).json({
      message: "Order not found",
      error: true,
      success: false,
    });
  }

  return res.json({
    message: "Order retrieved successfully",
    error: false,
    success: true,
    data: order,
  });
});

// GET ALL ORDERS CONTROLLER (ADMIN ONLY)
export const getAllOrders = asyncHandler(async (req, res) => {
  // Find all orders and populate product and user details
  const orders = await OrderModel.find()
    .populate({
      path: "items.product",
    })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return res.json({
    message: "Orders retrieved successfully",
    error: false,
    success: true,
    data: orders,
  });
});

// UPDATE ORDER STATUS CONTROLLER (ADMIN ONLY)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { _id, orderStatus } = req.body;

  // Validate required fields
  if (!_id) {
    return res.status(400).json({
      message: "Provide order ID",
      error: true,
      success: false,
    });
  }

  if (!orderStatus) {
    return res.status(400).json({
      message: "Provide order status",
      error: true,
      success: false,
    });
  }

  // Validate order status value
  const validStatuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (!validStatuses.includes(orderStatus)) {
    return res.status(400).json({
      message: "Invalid order status",
      error: true,
      success: false,
    });
  }

  // Update order status in database
  const updatedOrder = await OrderModel.findByIdAndUpdate(
    _id,
    { orderStatus },
    { new: true },
  );

  if (!updatedOrder) {
    return res.status(404).json({
      message: "Order not found",
      error: true,
      success: false,
    });
  }

  return res.json({
    message: "Order status updated successfully",
    error: false,
    success: true,
    data: updatedOrder,
  });
});
