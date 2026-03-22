import { Router } from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  addAddress,
  getAddresses,
  deleteAddress,
} from "../controllers/addressController.js";

const addressRouter = Router();

// All address routes are protected (require authentication)
addressRouter.post("/add", auth, addAddress);
addressRouter.get("/get", auth, getAddresses);
addressRouter.delete("/delete", auth, deleteAddress);

export default addressRouter;
