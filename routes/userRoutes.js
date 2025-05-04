// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// const {createBlog} = require('../controllers/blogController');
const authController = require('./../controllers/authController');


//register
router.post('/register', authController.register);

//login
router.post('/login', authController.login);

// List users route
router.get('/', userController.listUsers);

// Add user route
// router.post('/', userController.addUser);

// Edit user route
router.get('/:id/edit', userController.editUser);

// Update user route
router.post('/:id/update', userController.updateUser);

// Delete user route
router.get('/:id/delete', userController.deleteUser);

//get the blog
// router.get('/:id/add', createBlog);

module.exports = router;
