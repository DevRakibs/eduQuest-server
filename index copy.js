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

// Use CORS
// app.use(cors({
//    origin: [
//     'http://localhost:3000',
//     'http://localhost:4000',
//     'https://edu-quest-admin.vercel.app',
//     'https://edu-quest-silk.vercel.app'
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   optionsSuccessStatus: 204
// }));

const allowedOrigins = [
  'https://edu-quest-silk.vercel.app',
  'https://edu-quest-admin.vercel.app',
  'http://localhost:3000',
  'http://localhost:4000'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version', 'Authorization'],
  credentials: true
}));


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

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
app.use('/api/auth', userRoute);
app.use('/api/blog', blogRoute);
app.post('/api/file/upload', upload.single('my_file'), handleUpload);
app.post('/api/file/delete', handleDelete);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).send(message);
});