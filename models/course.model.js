import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890', 10);

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
});

const sectionSchema = new mongoose.Schema({
  section: { type: String, required: true },
  content: [contentSchema],
});

const courseSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => nanoid(6) },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    includes: [{ type: String, required: true }],
    cover: { type: String, required: true },
    status: { type: String, enum: ['pending', 'active'], default: 'pending' },
    batchInfo: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: [sectionSchema],
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: { type: Number, required: true },
        comment: { type: String },
      },
    ],
  },
  { timestamps: true, _id: false }
);

export default mongoose.model('Course', courseSchema);
