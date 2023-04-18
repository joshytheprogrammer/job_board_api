const jwt = require('jsonwebtoken')

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
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedToken.user;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = validateToken;