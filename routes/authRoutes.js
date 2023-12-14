const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models'); // Adjust the path based on your file structure

const router = express.Router();
const JWT_SECRET = 'hitesh';

router.post('/register', async (req, res) => {
  const { username, password, user_type } = req.body;

  if (!username || !password || !user_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ username, password: hashedPassword, user_type });
  await user.save();

  return res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user._id, userType: user.user_type }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ message: 'Login successful', user_type: user.user_type, token });
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;
