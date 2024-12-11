// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { listUsers } = require('../controllers/userController');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

module.exports = router;
