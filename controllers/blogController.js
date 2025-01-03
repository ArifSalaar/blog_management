const Blog = require('../models/Blog');
const User = require('../models/User'); 

const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.userId; // From Auth Middleware
    console.log('Authenticated User ID:', authorId);

    // Fetch the author's username
    const author = await User.findById(authorId).select('username');
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Create the blog with author name
    const newBlog = await Blog.create({
      title,
      content,
      authorId,
      author: author.username
    });

    res.status(201).json({
      data:{ 
        success: true,
        message: 'Blog created successfully', 
        id: newBlog._id,
        title: newBlog.title,
        content: newBlog.content,
        author: newBlog.author
      }});
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Failed to create blog', error: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username email');
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
  }
};


const blogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate('author', 'username email');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blog', error: error.message });
  }
};


const updateBlog = async (req, res) => {
  const authorId = req.userId; 
  if (!authorId) {
    return res.status(401).json({ success: false, message: "Token is missing or inValid" });
  }
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.author.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.author = author || blog.author;
    await blog.save();

    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update blog', error: error.message });
  }
};


const deleteBlog = async (req, res) => {
  const userId = req.userId;
  
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const user = await User.findById(userId).select('username');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (blog.author !== user.username) {
      return res.status(403).json({ message: 'You have not access to delete the post' });
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true,
      message: 'Blog deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Failed to delete blog', error: error.message });
  }
};



exports.searchBlogByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title query parameter is required'
      });
    }

    const blogs = await Blog.find({ title: { $regex: title, $options: 'i' } });

    const formattedBlogs = blogs.map(blog => ({
      id: blog._id,
      title: blog.title,
      content: blog.content,
      author: blog.author,
      createdAt: blog.createdAt
    }));

    res.status(200).json({
      success: true,
      message: 'Blogs searched successfully',
      data: formattedBlogs
    });
  } catch (error) {
    console.error('Error searching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search blogs',
      error: error.message
    });
  }
};

module.exports ={createBlog, getAllBlogs, blogById, updateBlog, deleteBlog}