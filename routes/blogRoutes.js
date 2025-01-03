const express = require('express');
const {
  createBlog,
  getAllBlogs,
  blogById,
  updateBlog,
  deleteBlog,
  searchBlogByTitle,
} = require('../controllers/blogController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();



router.post('/create-blog', authenticate, createBlog);
router.get('/all-blogs', getAllBlogs);
router.get('/search', searchBlogByTitle);
router.get('/:id', blogById);
router.put('/:id', authenticate, updateBlog);
router.delete('/:id', authenticate, deleteBlog);

module.exports = router;
