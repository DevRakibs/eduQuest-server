import { Resourse } from "../models/resourse.model.js";

export const createResourse = async (req, res, next) => {
  try {
    await Resourse.create(req.body);
    res.status(201).send('Resourse created successfully');
  } catch (error) {
    next(error);
  }
};

export const getResourses = async (req, res, next) => {
  try {
    const { search, } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const resourses = await Resourse.find(query);
    res.status(200).json(resourses);
  } catch (error) {
    next(error);
  }
};

//update resourse
export const updateResourse = async (req, res, next) => {
  try {
    await Resourse.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send('Resourse updated successfully');
  } catch (error) {
    next(error);
  }
};

//delete resourse
export const deleteResourse = async (req, res, next) => {
  try {
    await Resourse.findByIdAndDelete(req.params.id);
    res.status(200).send('Resourse deleted successfully');
  } catch (error) {
    next(error);
  }
};

