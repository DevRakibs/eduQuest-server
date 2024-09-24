import blogModel from "../models/blog.model.js"

export const createBlog = async (req,res,next) => {
  try {
    const newBlog =  new blogModel(req.body)
    const savedBlog = await newBlog.save();
    res.status(201).send(savedBlog)
  } catch (error) {
    next(error)
  }
};

export const updateBlog = async (req,res,next) => {
  try {
    const updatedBlog = await blogModel.findByIdAndUpdate(req.params.blogId, {
      $set: req.body
    }, {new: true});
    res.status(201).send(updatedBlog)
  } catch (error) {
    next(error)
  }
}

export const getBlog = async (req,res,next) => {
  try {
    const blogData = await blogModel.find().sort({updatedAt: -1});
    res.status(201).send(blogData);
  } catch (error) {
    next(error)
  }
};

export const getSingleBlog = async (req,res,next) => {
  try {
    const blogSingleData = await blogModel.findById(req.params.blogId);
    res.status(201).send(blogSingleData);
  } catch (error) {
    next(error)
  }
};

export const deleteBlog = async (req,res,next) => {
  try {
    await blogModel.findByIdAndDelete(req.params.blogId);
    res.status(201).send('Blog Deleted!')
  } catch (error) {
    next(error)
  }
}