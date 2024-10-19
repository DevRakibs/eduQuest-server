import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'] },
  enrollmentStatus: { type: String, enum: ['pending', 'approved'] },
  enrolledAt: { type: Date, default: Date.now }
});

const courseSchema = new mongoose.Schema(
  {
    // _id: { type: String, default: () => nanoid(6) },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    includes: [{ type: String, required: true }],
    cover: { type: String, required: true },
    status: { type: String, enum: ['pending', 'upcoming', 'running', 'completed', 'inactive'], default: 'pending' },
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
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourseContent'
    },
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
  {
    timestamps: true,
    // _id: false
  }
);

export default mongoose.model('Course', courseSchema);
