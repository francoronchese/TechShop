import { Router } from 'express';
import auth from '../middlewares/authMiddleware.js';
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const productRouter = Router();

// Public routes
productRouter.get('/get', getAllProducts);
productRouter.get('/get/:id', getProduct);
// Protected routes (Admin Only)
productRouter.post('/create', auth, createProduct);
productRouter.put('/update', auth, updateProduct);
productRouter.delete('/delete', auth, deleteProduct);

export default productRouter;