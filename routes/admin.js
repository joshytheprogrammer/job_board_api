const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required!' });
  }

  const user = await User.findOne({email: req.body.email})

  try {
    if(!user) {
      res.status(401).json({ message: 'User not found!!!' })
      return
    }
  } catch(e) {
    console.error(e)
    return 
  }
 
  // Check if the password is correct
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid email or password!' });
  }

  // Prepare user data
  const data = {
    id: user._id,
    name: user.username
  }

  // Generate tokens
  const adminAccessToken = jwt.sign({ user: data }, process.env.ADMIN_ACCESS_TOKEN_SECRET, { expiresIn: '1000m' });

  return res.status(200).json({ adminAccessToken });

});

module.exports = router