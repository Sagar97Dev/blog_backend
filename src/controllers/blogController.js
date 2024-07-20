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

  try {
    // Count documents matching the keyword
    const count = await Blog.countDocuments({ ...keyword });

    // Find the posts with pagination
    const posts = await Blog.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      posts,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBlogById = async (req, res) => {
  try {
    // Find the blog post by ID
    const post = await Blog.findById(req.params.id);

    // Check if the post was found
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const createBlog = async (req, res) => {
  const { title, content } = req.body;

  try {
    const existingPost = await Blog.findOne({ title });
    if (existingPost) {
      return res.status(400).json({ message: 'Blog with this title already exists' });
    }

    // Create a new blog post
    const post = new Blog({
      user: req.user.id,
      title,
      content,
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Find the blog post by ID
    const post = await Blog.findById(req.params.id);

    if (post) {
      post.title = title;
      post.content = content;

      // Save the updated post
      const updatedPost = await post.save();
      res.json(updatedPost);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Server error' });
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
