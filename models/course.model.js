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

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentStatus: { type: String, enum: ['pending', 'confirmed'] },
  enrollmentStatus: { type: String, enum: ['pending', 'approved'] },
  enrolledAt: { type: Date, default: Date.now }
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
    status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },
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
    studentsEnrolled: [enrollmentSchema],
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
