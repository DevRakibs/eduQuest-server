import mongoose from "mongoose";
import { Schema } from "mongoose";

const ResourseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  version: {
    type: String,
  },
  files: {
    type: Number,
  }
});

export const Resourse = mongoose.model("Resourse", ResourseSchema);
