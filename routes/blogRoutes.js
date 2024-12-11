// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const { listBlogs, addBlog, editBlog, updateBlog, deleteBlog } = require('../controllers/blogController');


//list all blogs
router.get('/', listBlogs);

// Add blog route
router.post('/add', addBlog);

//edit blog route
router.get('/edit/:id', editBlog);

// Update blog route
router.post('/:id/update', updateBlog);

// Delete blog route
router.get('/delete/:id', deleteBlog);

module.exports = router;
