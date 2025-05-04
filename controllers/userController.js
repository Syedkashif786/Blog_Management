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
        email : user.email
      }  
    };

    jwt.sign(payload, process.env.JWT_SECRET,{expiresIn: '1hr'}, (err,token)=>{
      if(err){
        throw err;
      }else{
        // res.json({token});
        console.log(user);
        res.status(200).json({user: user, token: token});
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
    const token = req.cookies.token;
      if(!token)
        return res.status(401).json({message: 'Not authorized'});
      try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        const response = decoded.user.email;
        const userEmail = response;
        const user = await User.findOne({where: {email: userEmail}});
        if(!user)
          return res.status(404).json({error: 'user not found'});
        // res.status(200).json({users});
        res.render('listUsers', { user });
      }
      catch(err){
        console.log(err);
        res.status(403).json('Invalid or Expired Token ');
      }
    }catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
};

// Render form to edit user
exports.editUser = async (req, res) => {
  try {
      const token = req.cookies.token;
      if(!token)
        return res.status(401).json({message: 'Not authorized'});
      try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        const userEmail = decoded.user.email;
        const user = await User.findOne({where: {email: userEmail}});
        if (!user) {
          return res.status(404).json({ msg: 'User not found' });
        }
        res.render('editUser', { user });
      }catch(err){
        console.log(err);
        res.status(403).json({message: 'Invalid or Expired Token'});
      }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update user
exports.updateUser = async (req,res)=>{
  try{
    const token = req.cookies.token;
    if(!token)
      return res.status(401).json({message: 'Not authorized'});
    const userId = req.params.id; 
    const {username, email} = req.body;
      try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        const userEmail = decoded.user.email;
        const user = await User.findOne({where: {id: userId}});
        if (!user) {
          return res.status(404).json({ msg: 'User not found' });
        }
        if (user.email !== userEmail) {
          return res.status(403).json({ message: 'Forbidden: You cannot edit this user' });
        }
        
        user.username = username;
        user.email = email;
        // user.role = role;
        await user.save();
        res.cookie('token', token, {httpOnly: true});
        res.redirect('/users');
      }catch(err){
        console.error(err.message);
        return res.status(500).send('Server Error');
      }
    }catch(err){
      console.error(err.message);
      return res.status(500).send('Server Error');
}}

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if(!token)
      return res.status(401).json({message: 'Not authorized'});
    const userId = req.params.id;
    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      const userEmail = decoded.user.email;
      const user = await User.findOne({where: {id: userId}});
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      if (user.email !== userEmail) {
        return res.status(403).json({ message: 'Forbidden: You cannot edit this user' });
      }
      await user.destroy();
      res.send(
        `<script>
          alert('User Deleted successfully');
          window.location.href = '/';
        </script>`
      );
      // res.redirect('/');
    }catch(err){
      console.error(err.message);
      return res.status(500).send('User not deleted!');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
