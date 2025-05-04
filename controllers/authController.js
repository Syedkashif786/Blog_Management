// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');


// Register a new user
exports.register = async (req, res) => {
  // Validate user input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, role } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = await User.create({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      role
    });

    // Generate JWT token
    const payload = {
      user: {
        email: user.email
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET,{expiresIn: '1hr'}, (err,token)=>{
          if(err){
            throw err;
          }else{
            console.log({token});
            // res.status(200).json({user, token});
            res.cookie('token', token, {
            httpOnly: true,
            secure: false, // true if using HTTPS
            sameSite: 'Lax' // or 'Strict'
            });
            res.redirect('/users');
          }
        })
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = {
      user: {
        email: user.email
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      console.log({token});
      // res.status(200).json({user, token});
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true if using HTTPS
        sameSite: 'Lax' // or 'Strict'
      });
      res.redirect('/users');
      // res.render('listUsers', {user});
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
};
