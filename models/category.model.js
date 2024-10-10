import mongoose from 'mongoose';
import { createError } from '../middlewere/error.handler.js';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    img: { type: String },
    subCategories: [{ type: String }],
    isUncategorized: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Add a pre-remove hook to prevent deletion of the "Uncategorized" category
categorySchema.pre('remove', function (next) {
  if (this.isUncategorized) {
    createError(400, 'Cannot delete the Uncategorized category');
  } else {
    next();
  }
});

export default mongoose.model('Category', categorySchema);
