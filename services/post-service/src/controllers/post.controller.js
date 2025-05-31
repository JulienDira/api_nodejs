import Post from '../models/post.model.js';

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

