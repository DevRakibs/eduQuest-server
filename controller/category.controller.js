import categoryModel from '../models/category.model.js';
import courseModel from '../models/course.model.js';

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
    res.status(200).send(categories);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).send('Category not found');
    }

    if (category.name === 'Uncategorized' || category.isUncategorized) {
      return res.status(400).send('Cannot delete the Uncategorized category');
    }

    // Find or create the "Uncategorized" category
    let uncategorizedCategory = await categoryModel.findOne({ name: 'Uncategorized' });
    if (!uncategorizedCategory) {
      uncategorizedCategory = new categoryModel({
        name: 'Uncategorized',
        description: 'Default category for uncategorized courses',
        isUncategorized: true,
      });
      await uncategorizedCategory.save();
    }

    // Update courses with the deleted category to "Uncategorized"
    await courseModel.updateMany(
      { category: req.params.id },
      { $set: { category: uncategorizedCategory._id } }
    );

    // Delete the category
    await categoryModel.findByIdAndDelete(req.params.id);

    res.status(200).send('Category deleted successfully and associated courses updated');
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).send('Category not found');
    }

    if (category.name === 'Uncategorized' || category.isUncategorized) {
      if (req.body.name && req.body.name !== 'Uncategorized') {
        return res.status(400).send('Cannot rename the Uncategorized category');
      }
      delete req.body.name;
      req.body.isUncategorized = true;
    }

    await categoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).send('Category updated successfully');
  } catch (err) {
    next(err);
  }
};
