const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();  // For loading environment variables

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Initialize SQLite database
const db = new sqlite3.Database('database.db');

// Create Users table
db.run(`CREATE TABLE IF NOT EXISTS Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);


// Get the secret key from environment variables
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

// Signup endpoint
app.post('/api/users/signup', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM Users WHERE username = ?', [username], async (err, row) => {
    if (err) {
      console.error('Error selecting user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (row) {
      return res.status(400).json({ error: 'User already exists' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.run(
        'INSERT INTO Users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        function (err) {
          if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }
          const token = jwt.sign({ id: this.lastID }, secretKey, { expiresIn: '1h' });
          res.status(201).json({ message: 'User created successfully', token });
        }
      );
    } catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Signin endpoint
app.post('/api/users/signin', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM Users WHERE username = ?', [username], async (err, row) => {
    if (err) {
      console.error('Error selecting user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!row) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    try {
      const isPasswordValid = await bcrypt.compare(password, row.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }

      const token = jwt.sign({ id: row.id }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ message: 'User signed in successfully', token });
    } catch (error) {
      console.error('Error comparing password:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
