/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
/* eslint-disable no-undef */
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary';
import Multer from 'multer';
import { userRoute } from './route/user.route.js';

const app = express();

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on('connected', () => {
  console.log('mongodb connected');
});
mongoose.connection.on('disconnected', () => {
  console.log('mongodb disconnected');
});

app.get('/', (req, res) => {
  res.json('server running');
});
app.listen(5000, () => {
  console.log('server running..');
});
connect();

app.use(cors({origin: [
  'http://localhost:3200',
  'https://eduquestlms.vercel.app',
  'https://edu-quest-admin.vercel.app',
  'http://localhost:4000'
], credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Credentials', true);
  next();
});


const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    transformation: [
      { quality: '50' }
    ],
  });
  return res;
}

app.post("/api/upload", upload.single("my_file"), async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldres = await handleUpload(dataURI);
    res.json(cldres);
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message,
    });
  }
});

app.post('/api/delete', async (req, res) => {
  try {
    const { publicId } = req.body;
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'ok') {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: 'Image deletion failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});

app.use('/api/auth', userRoute);


app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  res.status(status).send(message);
});
