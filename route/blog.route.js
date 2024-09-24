import express from 'express';
import {
  createBlog,
  deleteBlog,
  getBlog,
  getSingleBlog,
  updateBlog,
} from '../controller/blog.controller.js';
import { verifyToken } from '../middlewere/verify.token.js';

export const blogRoute = express.Router();

blogRoute.post('/create', verifyToken, createBlog);

blogRoute.get('/getAll', getBlog);

blogRoute.put('/edit/:blogId',verifyToken, updateBlog);

blogRoute.get('/single/:blogId', getSingleBlog);

blogRoute.delete('/delete/:blogId',verifyToken, deleteBlog);