import mongoose, { Schema } from "mongoose";

const InfoSchema = new Schema({
  instituteName: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  logo: {
    type: String,
  },
  welcomeMessage: {
    type: String,
  },
  youtube: {
    type: String,
  },
  facebook: {
    type: String,
  },
  twitter: {
    type: String,
  },
  instagram: {
    type: String,
  },
  linkedin: {
    type: String,
  }
});

export const Info = mongoose.model('Info', InfoSchema);
