import { Router } from 'express';
import auth from '../middlewares/authMiddleware.js';
import {
  createProduct,
  getAllProducts,
  getProduct,
  getProductsByCategoryAndSubCategory,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const productRouter = Router();

// Public routes
productRouter.get('/get', getAllProducts);
productRouter.get('/get/:id', getProduct);
productRouter.get('/get-by-category', getProductsByCategoryAndSubCategory);
// Protected routes (Admin Only)
productRouter.post('/create', auth, createProduct);
productRouter.put('/update', auth, updateProduct);
productRouter.delete('/delete', auth, deleteProduct);

export default productRouter;