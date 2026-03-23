import { Router } from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  addToFavorites,
  getFavorites,
  removeFromFavorites,
} from "../controllers/favoriteController.js";

const favoriteRouter = Router();

// Protected Routes
favoriteRouter.post("/add", auth, addToFavorites);
favoriteRouter.get("/get", auth, getFavorites);
favoriteRouter.delete("/remove", auth, removeFromFavorites);

export default favoriteRouter;