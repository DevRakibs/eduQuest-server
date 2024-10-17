import express from 'express';
import {
  createBlog,
  getAllBlogs,
  deleteBlog,
  getBlog,
  updateBlog,
  addComment,
  addReply
} from '../controller/blog.controller.js';
import { verifyToken } from '../middleware/verify.token.js';
const router = express.Router();

router.post('/create', verifyToken, createBlog);

router.get('/all', getAllBlogs);

router.put('/edit/:blogId', verifyToken, updateBlog);

router.get('/details/:blogId', getBlog);

router.delete('/delete/:blogId', verifyToken, deleteBlog);

router.post('/comment/:blogId', verifyToken, addComment);

router.post('/reply/:blogId/:commentId', verifyToken, addReply);

export { router as blogRoute };
