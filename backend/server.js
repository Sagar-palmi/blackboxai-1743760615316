require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const path = require('path');

// Static file configuration
app.use(express.static(path.join(__dirname, '../views')));
app.use('/admin', express.static(path.join(__dirname, '../views/admin')));
app.use('/student', express.static(path.join(__dirname, '../views/student')));

// Database connection
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/subscriptions', require('./routes/subscriptions'));

// Page routes
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/login.html'));
});

app.get('/admin/manage-subscriptions', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/manage-subscriptions.html')); 
});

app.get('/student/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/student/login.html'));
});

app.get('/student/check-status', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/student/check-status.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Access URLs:');
  console.log(`- Admin: http://localhost:${PORT}/admin/login`);
  console.log(`- Student: http://localhost:${PORT}/student/login`);
});
