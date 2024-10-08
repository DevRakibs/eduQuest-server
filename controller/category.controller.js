import categoryModel from '../models/category.model.js';

export const createCategroy = async (req, res, next) => {
  try {
    const { name, description, img, subCategories } = req.body;
    const category = new categoryModel({
      name,
      description,
      img,
      subCategories,
    });

    await category.save();

    res.status(201).send('Category created successfully');
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await categoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).send('Category not found');
    }
    res.status(200).send('Category deleted successfully');
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!category) {
      return res.status(404).send('Category not found');
    }
    res.status(200).send('Category updated successfully');
  } catch (err) {
    next(err);
  }
};
