const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure correct relative path
// Register Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if all fields are present
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ msg: 'User with this email or username already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user and save
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ message: 'User not found' });
  
      // Compare password
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };
  router.put('/edit', authenticateJWT, async (req, res) => {
    try {
      const { username, email, password, newPassword } = req.body;
  
      if (!username || !email) {
        return res.status(400).json({ message: 'Username and email are required' });
      }
  
      const user = await User.findById(req.user.id);
      if (!user) return res.sendStatus(404);
  
      if (password && newPassword) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(400).json({ message: 'Current password is incorrect' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
      }
  
      user.username = username;
      user.email = email;
  
      await user.save();
  
      // Generate a new JWT token
      const newToken = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  
      res.json({ user, token: newToken });
    } catch (err) {
      console.error('Error updating user data:', err);
      res.sendStatus(500);
    }
  });
  

  router.get('/user', authenticateJWT, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); // Exclude password field
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      res.sendStatus(500);
    }
  });
module.exports = router;
