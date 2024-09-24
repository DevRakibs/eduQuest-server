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

// app.use(cors({
//   origin: [
//     'http://localhost:3000',
//     'http://localhost:4000',
//     'https://edu-quest-admin.vercel.app',
//     'https://edu-quest-silk.vercel.app'
//   ],
//   // credentials: true
// }));
// Update the CORS middleware
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }
//   next();
// });

app.use(cors({
   origin: [
    'http://localhost:3000',
    'http://localhost:4000',
    'https://edu-quest-admin.vercel.app',
    'https://edu-quest-silk.vercel.app'
  ],
  methods: 'GET,POST,PUT,DELETE', // Allow the required HTTP methods
  allowedHeaders: 'Content-Type, Authorization' // Allow the required headers, including Authorization
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', "*");
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   // res.header('Access-Control-Allow-Credentials', true);
//   next();
// });

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
