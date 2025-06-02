import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res) => {
  const { userName, password, email } = req.body;
  if (!userName || !password || !email) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ userName, email, password: hashed });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user._id, userName: user.userName },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token });
};

export const changePassword = async (req, res) => {
  const { userName, oldPassword, newPassword } = req.body;
  if (!userName || !oldPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' });

  try {
    const user = await User.findOne({ userName });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Old password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('userName _id')
    .lean();
  
  res.json({
    _id: user._id,
    username: user.userName  // Normalisé pour votre post-service
  });
};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const tokens = new Map(); // stockage temporaire (peux utiliser Redis/DB à la place)

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Email non trouvé' });

    const token = crypto.randomBytes(32).toString('hex');
    tokens.set(token, { userId: user._id, expires: Date.now() + 3600000 }); // 1h

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const mailOptions = {
      from: `"Support" <${process.env.MAIL_USER}>`, // Ajoute un nom lisible
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <p>Bonjour ${user.userName},</p>
        <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien suivant pour le réinitialiser :</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Ce lien expirera dans 1 heure.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('📧 Email envoyé avec succès :', info.messageId);
    return res.status(200).json({ message: 'Lien de réinitialisation envoyé avec succès.' });

  } catch (error) {
    console.error('❌ Erreur lors de l’envoi du mail :', error);
    return res.status(500).json({ error: 'Erreur lors de l’envoi de l’email. Vérifiez les logs serveur.' });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const data = tokens.get(token);

  if (!data || data.expires < Date.now()) {
    return res.status(400).json({ error: 'Token invalide ou expiré' });
  }

  const user = await User.findById(data.userId);
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  tokens.delete(token);

  res.json({ message: 'Mot de passe mis à jour avec succès' });
};


