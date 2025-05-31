import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  postId: { type: String, required: true },
}, { timestamps: true });

likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

export default mongoose.model('Like', likeSchema);