import mongoose, {Schema} from 'mongoose';

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category:{
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);
export default mongoose.model('Blog', BlogSchema);
