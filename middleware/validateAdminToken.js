const jwt = require('jsonwebtoken')

const validateAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header is present
  if (!authHeader) {
    return res.status(401).json({ message: 'Access token is required!' });
  }

  const token = authHeader;

  try {
    // Verify token using JWT library
    const decodedToken = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);

    req.user = decodedToken.user;
    
    if(!req.user.admin) {
      return res.status(401).json({ message: 'User is not an admin!!!'});
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = validateAdminToken;