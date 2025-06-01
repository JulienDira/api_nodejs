import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();

// Autoriser les requêtes du frontend
app.use(cors({
  origin: 'http://localhost:3000', // Frontend
  credentials: true,
}));

app.use(express.json());

// Connexion Mongo
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected ✅'))
  .catch((err) => console.error('MongoDB connection error ❌', err));

// Routes API
app.use('/api/users', userRoutes);

export default app;
