require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Enhanced static file configuration
app.use(express.static(path.join(__dirname, '../views'), {
  extensions: ['html'],
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.set('Content-Type', 'text/html');
    }
  },
  index: false // Disable automatic index.html serving
}));

// Add .html extension handling for includes
app.engine('html', require('ejs').renderFile);

// Database connection
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/subscriptions', require('./routes/subscriptions'));

// Explicit page routes with error handling
const servePage = (relativePath) => (req, res) => {
  const absolutePath = path.join(__dirname, `../views/${relativePath}`);
  res.sendFile(absolutePath, (err) => {
    if (err) {
      console.error(`Error serving ${relativePath}:`, err);
      res.status(404).send('Page not found');
    }
  });
};

// Admin routes
app.get('/admin/login', servePage('admin/login.html'));
app.get('/admin/manage-subscriptions', servePage('admin/manage-subscriptions.html'));
app.get('/admin/dashboard', servePage('admin/dashboard.html'));

// Student routes
app.get('/student/login', servePage('student/login.html'));
app.get('/student/check-status', servePage('student/check-status.html'));

// Default route
app.get('/', (req, res) => res.redirect('/admin/login'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Access URLs:');
  console.log(`- Admin: http://localhost:${PORT}/admin/login`);
  console.log(`- Student: http://localhost:${PORT}/student/login`);
  console.log(`- Subscriptions: http://localhost:${PORT}/admin/manage-subscriptions`);
});
