import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    img: { type: String },
    subCategories: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
