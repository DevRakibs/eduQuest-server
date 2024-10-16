import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['video', 'document'], required: true },
  url: { type: String, required: true },
  duration: { type: Number },
  fileSize: { type: Number },
  isOptional: { type: Boolean, default: false },
  order: { type: Number, required: true }
});

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  order: { type: Number, required: true },
  content: [contentSchema],
  estimatedDuration: Number
});

const courseContentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    // index: { unique: true, sparse: true }
  },
  sections: [sectionSchema],
  totalVideoDuration: Number,
  status: { type: String, enum: ['pending', 'published', 'archived'], default: 'pending' }
}, { timestamps: true });

courseContentSchema.pre('save', function (next) {
  let totalVideoDuration = 0;

  this.sections.forEach(section => {
    section.content.forEach(item => {
      if (item.type === 'video') totalVideoDuration += item.duration || 0;
    });
  });

  this.totalVideoDuration = totalVideoDuration;

  next();
});

export default mongoose.model('CourseContent', courseContentSchema);
