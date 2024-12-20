const jwt = require('jsonwebtoken');
const config = require('../config');

const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, config.jwtSecret);
      
      if (!roles.includes(decoded.role)) {
        throw new Error('Unauthorized');
      }
      
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Please authenticate' });
    }
  };
};

module.exports = auth;