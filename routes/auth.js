const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User')

// In real-world scenarios, these would be stored in a secure environment variable
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
// const accessTokenSecret = '6c03df6b0a6f186a6e1e70c2a6d12ce6de1ef6b90c6bb89a4d6e4c6b3ef4b4c3';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
// const refreshTokenSecret = '9c5749c8e17d5bbd7a6343e5e5b74dc4d97d4c4f3dfc4a1d47475e13d1142a6';

router.post('/login', async (req, res) => {
  // Check if username and password are provided
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required!' });
  }
 
  // Check if the username exists
  const user = await User.findOne({username: req.body.username})

  try {
    if(!user) {
      res.status(401).json({ message: 'Username and password are required!' })
      return
    }
  } catch(e) {
    console.error(e)
    return 
  }
 
  // Check if the password is correct
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid username or password!' });
  }

  // Prepare user data
  const data = {
    id: user._id,
    name: user.username
  }

  // Generate tokens
  const accessToken = jwt.sign({ user: data }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });
  const refreshToken = jwt.sign({ user: data }, process.env.REFRESH_TOKEN_SECRET);

  return res.status(200).json({ accessToken, refreshToken });
});
 
router.post('/signup', async (req, res) => {
  // Check if username and password are provided
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required!' });
  }
 
  // Hash the password and add the new user to the array
  const hashedPassword = bcrypt.hashSync(password, 10);
 
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  })

  try {
    await newUser.save()
    res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
  
});
 
router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required!' });
  }
 
  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
 
    // Generate a new access token
    const accessToken = jwt.sign({ username: decoded.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });
    return res.status(200).json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token!' });
  }
});

module.exports = router