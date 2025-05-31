import Post from '../models/post.model.js';
import axios from 'axios';

export const createPost = async (req, res) => {
  try {
    const authorId = req.user.id; // ✔️ récupéré depuis le token
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Missing content' });

    const newPost = new Post({ authorId, content });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllPosts = async (_, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: `Post ${req.params.id} successfully deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const LIKE_SERVICE_URL = process.env.LIKE_SERVICE;

export const getAllPosts = async (_, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    const postsWithLikes = await Promise.all(
      posts.map(async post => {
        try {
          const response = await axios.get(`${LIKE_SERVICE_URL}/count/${post._id}`);
          return {
            ...post.toObject(),
            likesCount: response.data.count || 0
          };
        } catch (err) {
          // Si le like-service échoue, on retourne quand même le post
          return {
            ...post.toObject(),
            likesCount: 0
          };
        }
      })
    );

    res.status(200).json(postsWithLikes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
