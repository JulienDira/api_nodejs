import express from 'express';
import {
  addLike,
  removeLike,
  getLikesByPost
} from '../controllers/like.controller.js';
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/:postId", getLikesByPost);
router.post("/", verifyToken, addLike);
router.delete("/:postId", verifyToken, removeLike);

export default router;
