const express = require('express');
const { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/getAllBlogs', getBlogs);
router.get('/getBlogById/:id', getBlogById);
router.post('/createBlog', protect,createBlog);
router.put('/updateBlog/:id', protect, updateBlog);
router.delete('/deleteBlog/:id', deleteBlog);

module.exports = router;
