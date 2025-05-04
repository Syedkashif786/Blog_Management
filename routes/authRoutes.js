// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');


// Register route
router.post('/register', register);

router.get('/register', (req,res)=>{
    res.render('register');
});
// Login route
router.post('/login', login);
router.get('/login', (req,res)=>{
    res.render('login');
})


router.get('/logout', logout);

module.exports = router;
