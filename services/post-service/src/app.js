import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import postRoutes from './routes/post.routes.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected to Post Service ✅'))
  .catch((err) => console.error('Mongo error ❌', err));

app.use('/api/posts', postRoutes);

export default app;
