import Post from '../models/post.model.js';
import axios from 'axios';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';

dotenv.config();

const userCache = new NodeCache({ stdTTL: 600 });
const LIKE_SERVICE_URL = process.env.LIKE_SERVICE;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE;

// Fonction pour récupérer les infos utilisateur avec cache
const getUserInfo = async (userId, token) => {
  const cacheKey = `user_${userId}`;
  
  // Vérifier le cache d'abord
  let userInfo = userCache.get(cacheKey);
  if (userInfo) {
    return userInfo;
  }

  try {
    // Appel au service auth si pas en cache
    const response = await axios.get(
      `${AUTH_SERVICE_URL}/${userId}`,
      { headers: { Authorization: token } }
    );
    
    userInfo = {
      _id: response.data._id,
      username: response.data.username
    };
    
    // Mettre en cache
    userCache.set(cacheKey, userInfo);
    return userInfo;
  } catch (error) {
    console.error(`Erreur récupération user ${userId}:`, error.message);
    console.error(`URL ${AUTH_SERVICE_URL}:`, error.message);
    return { _id: userId, username: 'Utilisateur inconnu'};
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    const token = req.headers['authorization'];

    const postsWithDetails = await Promise.all(
      posts.map(async post => {
        try {
          // Récupérer les infos utilisateur (avec cache)
          const authorInfo = await getUserInfo(post.authorId, token);
          
          // Récupérer le nombre de likes
          const likeResponse = await axios.get(
            `${LIKE_SERVICE_URL}/count/${post._id}`,
            { headers: { Authorization: token } }
          );

          return {
            ...post.toObject(),
            author: authorInfo,
            likesCount: likeResponse.data.likeCount || 0,
          };
        } catch (error) {
          console.error(`Erreur pour le post ${post._id}:`, error.message);
          return {
            ...post.toObject(),
            author: { _id: post.authorId, username: 'Utilisateur inconnu' },
            likesCount: 0,
          };
        }
      })
    );

    res.status(200).json(postsWithDetails);
  } catch (err) {
    console.error('Erreur dans getAllPosts :', err.message);
    res.status(500).json({ error: err.message });
  }
};

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