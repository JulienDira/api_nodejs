import express from 'express';
import {
  register,
  login,
  changePassword,
  getUserById,
  forgotPassword, 
  resetPassword,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount
} from '../controllers/user.controller.js';
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/changePassword', changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);
router.get('/:id', verifyToken, getUserById);
router.delete('/account', verifyToken, deleteUserAccount);


export default router;
