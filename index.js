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

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectToDatabase();
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:4000',
    'https://edu-quest-admin.vercel.app',
    'https://edu-quest-silk.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allowing all origins
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

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