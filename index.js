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
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

// app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

// app.use(cors({
//   origin: ['http://localhost:3000', 'https://eduquestlms.vercel.app'],
//   credentials: true,
// }));


const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  console.log('mongodb connected');
});
mongoose.connection.on('disconnected', () => {
  console.log('mongodb disconnected');
});

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectToDatabase();
});

app.use(
  cors({
    origin: [
      "http://localhost:3200",
      "https://eduquestlms.vercel.app",
      "https://edu-quest-admin.vercel.app",
      "http://localhost:4000"],
    // methods: ["GET", "POST", "DELETE", "PUT"],
    // allowedHeaders: [
    //   "Content-Type",
    //   "Authorization",
    //   "Cache-Control",
    //   "Expires",
    //   "Pragma",
    // ],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.json());
app.use(cookieParser());

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });



// Routes
app.use('/api/auth', userRoute);
// app.use('/api/blog', blogRoute);
app.post('/api/file/upload', upload.single('my_file'), handleUpload);
app.post('/api/file/delete', handleDelete);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).send(message);
});
