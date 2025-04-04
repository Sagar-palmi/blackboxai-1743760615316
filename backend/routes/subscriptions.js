const express = require('express');
const { check, validationResult } = require('express-validator');
const { getDb } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all subscriptions (admin only)
router.get('/', auth, (req, res) => {
  if (req.student.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const db = getDb();
  db.all(
    `SELECT s.student_id, s.name, s.department, sub.status, sub.start_date, sub.expiry_date
     FROM students s
     LEFT JOIN subscriptions sub ON s.student_id = sub.student_id`,
    (err, subscriptions) => {
      if (err) throw err;
      res.json(subscriptions);
    }
  );
});

// Renew subscription
router.post('/renew', [
  auth,
  check('student_id', 'Student ID is required').notEmpty(),
  check('duration', 'Duration in months is required').isInt({ min: 1 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (req.student.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const { student_id, duration } = req.body;
  const db = getDb();
  const startDate = new Date();
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + parseInt(duration));

  db.run(
    `INSERT OR REPLACE INTO subscriptions 
     (student_id, start_date, expiry_date, status) 
     VALUES (?, ?, ?, ?)`,
    [
      student_id,
      startDate.toISOString(),
      expiryDate.toISOString(),
      'active'
    ],
    function(err) {
      if (err) throw err;
      res.json({ 
        message: 'Subscription renewed successfully',
        expiry_date: expiryDate.toISOString().split('T')[0]
      });
    }
  );
});

module.exports = router;