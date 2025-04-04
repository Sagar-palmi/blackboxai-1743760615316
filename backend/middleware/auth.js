const jwt = require('jsonwebtoken');
const { getDb } = require('../db');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if student exists
    const db = getDb();
    db.get('SELECT student_id FROM students WHERE student_id = ?', [decoded.student.id], (err, student) => {
      if (err) throw err;
      
      if (!student) {
        return res.status(401).json({ message: 'Token is not valid' });
      }

      req.student = decoded.student;
      next();
    });
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};