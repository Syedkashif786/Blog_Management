// controllers/blogController.js
const Blog = require('../models/Blog');
const User = require('../models/User');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// List all blogs
exports.listBlogs = async (req, res) => {
  try {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message: 'Unauthorized'});
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.user.email;
    const user = await User.findOne({where: {email: userEmail}});
    if(!user)
      return res.status(404).json({error: 'user not found'});
    const blogs = await Blog.findAll({where: {userId: user.id}})
    res.render('listBlogs', {blogs});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createBlog = async(req,res) => {
 try{
  const token = req.cookies.token;
  if(!token) return res.status(401).json({message: 'Unauthorized'});
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userEmail = decoded.user.email;
  const user = await User.findOne({where: {email: userEmail}});
  if(!user)
    return res.status(404).json({error: 'user not found'});
  res.render('addBlog', {user});
  }catch(err){
    console.error(err.message);
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      res.status(403).send('Invalid or expired token');
    } else {
      res.status(500).send('Server error while opening blog creation form');
    }
}};

// Add new blog
exports.addBlog = async (req, res) => {
  const token = req.cookies.token;
  if(!token) return res.status(401).json({message: 'Unauthorized'});
  const { title, content} = req.body;
  // if (!title || !content) {
  //   return res.status(400).json({ message: 'Title and content are required' });
  // }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.user.email;
    const user = await User.findOne({where: {email: userEmail}});
    if(!user)
      return res.status(404).json({error: 'user not found'});
    await Blog.create({ title, content, userId: user.id });
    const blogs = await Blog.findAll({where: { userId: user.id }});
    // res.render('addBlog', {blog});
    res.render('listBlogs', { user, blogs });
    } catch (err) {
    console.error(err.message);
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      res.status(403).send('Invalid or expired token');
    }else{
      res.status(500).send('Server Error in adding blog');
    }
  }
};

//edit blog by ID
exports.editBlog = async (req, res) => {
  const token = req.cookies.token;
  if(!token) return res.status(401).json({message: 'Unauthorized'});

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.user.email;
    const user = await User.findOne({where: {email: userEmail}});
    if(!user)
      return res.status(404).json({error: 'user not found'});

    const blogId = req.params.id;
    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    if (blog.userId !== user.id) {
      return res.status(403).json({ msg: 'Forbidden: You do not own this blog' });
    }
    res.render('editBlog', { blog });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      res.status(403).send('Invalid or expired token');
    }else{
      res.status(500).send('Server Error in editing blog');
    }
  }
};

// Update blog by ID
exports.updateBlog = async (req, res) => {
  const token = req.cookies.token;
  if(!token) return res.status(401).json({message: 'Unauthorized'});

  const blogId = req.params.id;
  const { title, content } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.user.email;

    const user = await User.findOne({where: {email: userEmail}});
    if(!user)
      return res.status(404).json({error: 'user not found'});

    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    if (blog.userId !== user.id) {
      return res.status(403).json({ msg: 'Forbidden: You do not own this blog' });
    }

    blog.title = title;
    blog.content = content;
    await blog.save();
    const blogs = await Blog.findAll({where: {userId: user.id}})
    res.render('listBlogs', { blogs });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      res.status(403).send('Invalid or expired token');
    }else{
      res.status(500).send('Server Error in updating blog');
    }
  }
};

// Delete blog by ID
exports.deleteBlog = async (req, res) => {
  const token = req.cookies.token;
  if(!token) return res.status(401).json({message: 'Unauthorized'});

  const blogId = req.params.id;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.user.email;

    const user = await User.findOne({where: {email: userEmail}});
    if(!user)
      return res.status(404).json({error: 'user not found'});

    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }

    if (blog.userId !== user.id) {
      return res.status(403).json({ msg: 'Forbidden: You do not own this blog' });
    }

    await blog.destroy();
    const blogs = await Blog.findAll({where: {userId: user.id}});
    res.render('listBlogs', {blogs});
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      res.status(403).send('Invalid or expired token');
    }else{
      res.status(500).send('Server Error in deleting blog');
    }
  }
};
