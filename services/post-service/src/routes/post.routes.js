import express from 'express';
import {
  createPost,
  getAllPosts,
  updatePost,
  deletePost
} from '../controllers/post.controller.js';
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/', verifyToken, createPost);
router.get('/', verifyToken, getAllPosts);
router.put('/:id', verifyToken, updatePost);
router.delete('/:id', verifyToken, deletePost);

export default router;
