import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import postRoutes from './routes/post.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected to Post Service ✅'))
  .catch((err) => console.error('Mongo error ❌', err));

app.use('/api/posts', postRoutes);

export default app;
