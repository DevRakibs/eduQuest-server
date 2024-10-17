import Blog from '../models/blog.model.js';

// Create blog
export const createBlog = async (req, res, next) => {
  try {
    await Blog.create({
      ...req.body,
      author: req.user.id
    });
    res.status(201).send('Blog created successfully');
  } catch (error) {
    next(error);
  }
};

// Get all blogs
export const getAllBlogs = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const blogs = await Blog.find(query)
      .sort({ updatedAt: -1 })
      .populate('author', '_id username email');

    res.status(200).send(blogs);
  } catch (error) {
    next(error);
  }
};

// Get single blog
export const getBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId).populate('author comments.user comments.replies.user');
    if (!blog) {
      return res.status(404).send('Blog not found');
    }
    res.status(200).send(blog);
  } catch (error) {
    next(error);
  }
};

// Update blog
export const updateBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    // Find the existing blog
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).send('Blog not found');
    }
    // Check if the current user is the author or an admin
    if (existingBlog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).send('You are not authorized to update this blog');
    }
    await Blog.findByIdAndUpdate(blogId, {
      ...req.body,
      author: req.user.id
    }, { new: true });

    res.status(200).send('Blog updated successfully');
  } catch (error) {
    next(error);
  }
};

// Delete blog
export const deleteBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
      return res.status(404).send('Blog not found');
    }
    res.status(200).send('Blog deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Add comment
export const addComment = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const { comment } = req.body;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).send('Blog not found');
    }
    blog.comments.push({ user: req.user.id, text: comment });
    await blog.save();
    res.status(201).send('Comment added successfully');
  } catch (error) {
    next(error);
  }
};

// Add reply to comment
export const addReply = async (req, res, next) => {
  try {
    const { blogId, commentId } = req.params;
    const { reply } = req.body;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).send('Blog not found');
    }
    const comment = blog.comments.find(comment => comment._id.toString() === commentId);
    if (!comment) {
      return res.status(404).send('Comment not found');
    }
    comment.replies.push({ user: req.user.id, text: reply });
    await blog.save();
    res.status(201).send('Reply added successfully');
  } catch (error) {
    next(error);
  }
};
