import Like from '../models/like.model.js';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
import axios from 'axios';

dotenv.config();

const userCache = new NodeCache({ stdTTL: 600 });
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

export const addLike = async (req, res) => {
  try {
    const userId = req.user.id; // ✔️ sécurisé
    const { postId } = req.body;
    const newLike = new Like({ userId, postId });
    await newLike.save();
    res.status(201).json(newLike);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const deletedLike = await Like.findOneAndDelete({ userId, postId });

    if (!deletedLike) {
      return res.status(404).json({ error: "Like not found" });
    }

    res.status(200).json({
      message: "Like removed successfully",
      like: deletedLike,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLikesByPost = async (req, res) => {
  const token = req.headers['authorization'];

  try {
    const postId = req.params.postId;
    const likes = await Like.find({ postId });

    const enrichedLikes = await Promise.all(
      likes.map(async like => {
        const user = await getUserInfo(like.userId, token);
        return {
          ...like.toObject(),   // on étend le like complet
          user                  // on ajoute les infos utilisateur
        };
      })
    );

    res.status(200).json(enrichedLikes);
  } catch (err) {
    console.error('Erreur getLikesByPost:', err.message);
    res.status(500).json({ error: err.message });
  }
};


export const countLikesByPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const likeCount = await Like.countDocuments({ postId });
    res.status(200).json({ postId, likeCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
