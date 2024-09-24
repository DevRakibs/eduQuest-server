/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import { blogRoute } from './route/blog.route.js';
import { handleDelete, handleUpload } from './utils/fileUploadHandler.js';
import { userRoute } from './route/user.route.js';
import corsOptions from './config/corsOptions.js';

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

// Add this before any route definitions
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://edu-quest-silk.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Replace the existing cors middleware with this
app.use(cors({
  origin: 'https://edu-quest-silk.vercel.app',
  credentials: true
}));

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
app.use('/api/auth', userRoute);
app.use('/api/blog', blogRoute);
app.post('/api/file/upload', upload.single('my_file'), handleUpload);
app.post('/api/file/delete', handleDelete);

// Error handling middleware
app.use((err, req, res,next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).send(message);
});
