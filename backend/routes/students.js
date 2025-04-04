const express = require('express');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { getDb } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// Get current student's info
router.get('/me', auth, (req, res) => {
  const db = getDb();
  const studentId = req.student.id;

  try {
    db.get(
      `SELECT s.*, sub.status, sub.expiry_date 
       FROM students s
       LEFT JOIN subscriptions sub ON s.student_id = sub.student_id
       WHERE s.student_id = ?`,
      [studentId],
      (err, student) => {
        if (err) throw err;
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Admin: Add new student
router.post('/', [
  auth,
  check('name', 'Name is required').notEmpty(),
  check('student_id', 'Student ID is required').notEmpty(),
  check('department', 'Department is required').notEmpty(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (req.student.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const { name, student_id, department, password } = req.body;
  const db = getDb();

  try {
    // Check if student exists
    db.get('SELECT * FROM students WHERE student_id = ?', [student_id], async (err, existingStudent) => {
      if (err) throw err;
      if (existingStudent) {
        return res.status(400).json({ message: 'Student already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Insert new student
      db.run(
        'INSERT INTO students (name, student_id, department, password_hash) VALUES (?, ?, ?, ?)',
        [name, student_id, department, passwordHash],
        function(err) {
          if (err) throw err;
          res.json({ message: 'Student added successfully' });
        }
      );
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;