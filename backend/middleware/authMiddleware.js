const jwt = require('jsonwebtoken');
const { pool } = require('../db');
require('dotenv').config();

// Middleware to verify JWT token and protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if authorization header is present and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user exists
      const [users] = await pool.execute(
        'SELECT User_Id, Username, Email FROM Users WHERE User_Id = ?',
        [decoded.id]
      );

      if (users.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Set user in request
      req.user = {
        id: users[0].User_Id,
        username: users[0].Username,
        email: users[0].Email
      };

      next();
    } catch (error) {
      console.error('Error in auth middleware:', error);
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
