// controllers/blogController.js
const Blog = require('../models/Blog');

// List all blogs
exports.listBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.render('listBlogs', { blogs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createBlog = async(req,res) => {
 try{
  const blogs = await Blog.findAll();
  res.render('addBlog', {blogs});
 }catch(err){
  console.error(err.message);
  res.status(500).send('Server error while opening')
 }
};

// Add new blog
exports.addBlog = async (req, res) => {
  const { title, content, userId } = req.body;

  try {
    const blog = await Blog.create({ title, content, userId });
    await blog.save();
    // res.render('addBlog', {blog});
    res.redirect('/blogs');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error in adding blog');
  }
};

//edit blog by ID
exports.editBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    res.render('editBlog', { blog });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update blog by ID
exports.updateBlog = async (req, res) => {
  const blogId = req.params.id;
  const { title, content } = req.body;

  try {
    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    blog.title = title;
    blog.content = content;
    await blog.save();
    res.redirect('/blogs');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete blog by ID
exports.deleteBlog = async (req, res) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    await blog.destroy();
    res.redirect('/blogs');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
