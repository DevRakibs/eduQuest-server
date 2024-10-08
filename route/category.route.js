import express from 'express';
import { verifyToken } from '../middlewere/verify.token.js';
import { isAdmin } from '../middlewere/isAdmin.js';
import {
  createCategroy,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../controller/category.controller.js';

const router = express.Router();

router.post('/create', verifyToken, isAdmin, createCategroy);

router.get('/all', getCategories);

router.delete('/delete/:id', verifyToken, isAdmin, deleteCategory);

router.put('/update/:id', verifyToken, isAdmin, updateCategory);

export { router as categoryRoute };
