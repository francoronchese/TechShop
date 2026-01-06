import { Router } from 'express';
import auth from '../middlewares/authMiddleware.js';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from '../controllers/CategoryController.js';

const categoryRouter = Router();

// Public routes
categoryRouter.get('/get', getAllCategories);
// Protected routes (Only for logged admins)
categoryRouter.post('/create', auth, createCategory);
categoryRouter.put('/update', auth, updateCategory);
categoryRouter.delete('/delete', auth, deleteCategory);

export default categoryRouter;
