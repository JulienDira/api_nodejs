import express from 'express';
import {
  register,
  login,
  changePassword,
  getUserById
} from '../controllers/user.controller.js';
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/changePassword', changePassword);
router.get('/:id', verifyToken, getUserById);

export default router;
