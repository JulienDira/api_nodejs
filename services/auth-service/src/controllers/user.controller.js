import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const register = async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ userName, password: hashed });
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
