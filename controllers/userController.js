// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Add new user
exports.addUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    //check if already exists
    let user = await User.findOne({where : {email} });
    if(user){
      return res.status(400).json({msg : 'User already exists'});
    }
    // create new user
    user = await User.create
    ({ 
      username, 
      email, 
      password: await bcrypt.hash(password, 10), 
      role
    });
     
    //generate jwt token 
    const payload = {
      user: {
        id : user.id
      }  
    };

    jwt.sign(payload, process.env.JWT_SECRET, (err,token)=>{
      if(err){
        throw err;
      }else{
        // res.json({token});
        res.redirect('/users');
      }
    }); 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// List all users
exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('listUsers', { users });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Render form to edit user
exports.editUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.render('editUser', { user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update user
exports.updateUser = async (req,res)=>{
  try{
      const userId = req.params.id; 
      const {username, email} = req.body;
      const user = await User.findByPk(userId);
      if(!user){
          return res.status(404).json({msg: 'User not found'});
      }else{
          user.username = username;
          user.email = email;
          // user.role = role;
          await user.save();
          res.redirect('/users');
      }
  }catch(err){
      console.error(err.message);
      return res.status(500).send('Server Error');
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    await user.destroy();
    res.redirect('/users');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
