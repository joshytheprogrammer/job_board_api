const jwt = require('jsonwebtoken')

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
// const accessTokenSecret = '6c03df6b0a6f186a6e1e70c2a6d12ce6de1ef6b90c6bb89a4d6e4c6b3ef4b4c3';

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header is present
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  // const token = authHeader.split(' ')[1];
  const token = authHeader;

  try {
    // Verify token using JWT library
    const decodedToken = jwt.verify(token, accessTokenSecret);
    req.user = decodedToken.user;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = validateToken;