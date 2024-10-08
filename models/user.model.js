import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true // Optional: Ensures there are no leading or trailing spaces
    },
    img: {
      type: String,
    },
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    about: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address'] // Optional: Email validation
    },
    phone: {
      type: Number,
    },
    role: { type: String, enum: ['student', 'instructor', "admin"], default: '', required: true },
    password: {
      type: String,
      required: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
