const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, 'backend', 'database.db');
const db = new sqlite3.Database(dbPath);

async function initialize() {
  try {
    // Create tables
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          student_id TEXT UNIQUE NOT NULL,
          department TEXT NOT NULL,
          password_hash TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id TEXT NOT NULL,
          start_date TEXT NOT NULL,
          expiry_date TEXT NOT NULL,
          status TEXT CHECK(status IN ('active', 'expired', 'pending')) NOT NULL,
          FOREIGN KEY (student_id) REFERENCES students(student_id)
        )`, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });

    // Add admin user if not exists
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    await new Promise((resolve, reject) => {
      db.run(
        'INSERT OR IGNORE INTO students (name, student_id, department, password_hash) VALUES (?, ?, ?, ?)',
        ['Admin User', process.env.ADMIN_ID, 'Administration', passwordHash],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Initialization error:', err);
  } finally {
    db.close();
  }
}

initialize();