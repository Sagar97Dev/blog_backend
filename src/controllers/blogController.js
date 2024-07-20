const Blog = require('../models/blogModel');

const getBlogs = async (req, res) => {
  const pageSize = 5;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword ? {
    title: {
      $regex: req.query.keyword,
      $options: 'i',
    },
  } : {};

  const count = await Blog.countDocuments({ ...keyword });
  const posts = await Blog.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1));

  res.json({ posts, page, pages: Math.ceil(count / pageSize) });
};

const getBlogById = async (req, res) => {
  const post = await Blog.findById(req.params.id);

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: 'Blog not found' });
  }
};

const createBlog = async (req, res) => {
  const { title, content } = req.body;


console.log(req,'<====user' )

  const post = new Blog({
    user: req.user.id,
    title,
    content,
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
};

const updateBlog = async (req, res) => {
  const { title, content } = req.body;

  const post = await Blog.findById(req.params.id);

  if (post) {
    post.title = title;
    post.content = content;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404).json({ message: 'Blog not found' });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Blog.findByIdAndDelete(id);

    if (result) {
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,  
};
