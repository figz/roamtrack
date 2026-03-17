const express = require('express');
const router = express.Router();

const USERNAME = 'admin';
const PASSWORD = 'r3@Ladmin';
// Static token issued on successful login
const TOKEN = 'rt-YWRtaW46cjNAQWRtaW4';

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USERNAME && password === PASSWORD) {
    return res.json({ token: TOKEN });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

module.exports = { router, TOKEN };
