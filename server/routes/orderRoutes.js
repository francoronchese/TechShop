import { Router } from "express";
import auth from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";
import {
  createOrder,
  createCheckoutSession,
  confirmStripeOrder,
  getOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const orderRouter = Router();

// Protected routes (User)
orderRouter.post("/create", auth, createOrder);
orderRouter.post("/create-checkout-session", auth, createCheckoutSession);
orderRouter.post("/confirm-stripe-order", auth, confirmStripeOrder);
orderRouter.get("/get", auth, getOrders);
orderRouter.get("/get/:id", auth, getOrderById);

// Protected routes (Admin only)
orderRouter.get("/admin/get", auth, isAdmin, getAllOrders);
orderRouter.put("/admin/update-status", auth, isAdmin, updateOrderStatus);

export default orderRouter;
