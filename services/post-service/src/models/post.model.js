import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  authorId: { type: String, required: true }, // ID utilisateur
  content: { type: String, required: true },
  likesCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
