import { Router } from 'express';
import { createProduct } from '../controllers/productController.js';
import auth from '../middlewares/authMiddleware.js';

const productRouter = Router();

productRouter.post('/create', auth, createProduct);

export default productRouter;
