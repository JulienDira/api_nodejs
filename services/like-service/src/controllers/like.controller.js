import Like from '../models/like.model.js';

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
  try {
    const postId = req.params.postId;
    const likes = await Like.find({ postId });
    res.status(200).json(likes);
  } catch (err) {
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
