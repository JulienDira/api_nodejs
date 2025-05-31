import express from 'express';
import {
  register,
  login,
  changePassword,
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/changePassword', changePassword);

export default router;
