import express from 'express';
import mongoose from 'mongoose';
import likeRoutes from './routes/like.routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected to Like Service ✅'))
  .catch((err) => console.error('Mongo error ❌', err));

// Routes
app.use('/api/likes', likeRoutes);

export default app;
