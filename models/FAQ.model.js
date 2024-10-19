import mongoose, { Schema } from "mongoose";

const FAQSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

export const FAQ = mongoose.model('FAQ', FAQSchema);
