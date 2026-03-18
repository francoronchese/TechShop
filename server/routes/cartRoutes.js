import { Router } from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  mergeCart,
} from "../controllers/cartController.js";

const cartRouter = Router();

// All cart routes are protected (require authentication)
cartRouter.get("/get", auth, getCart);
cartRouter.post("/add", auth, addToCart);
cartRouter.put("/update-quantity", auth, updateQuantity);
cartRouter.delete("/remove", auth, removeFromCart);
cartRouter.delete("/clear", auth, clearCart);
cartRouter.post("/merge", auth, mergeCart);

export default cartRouter;
