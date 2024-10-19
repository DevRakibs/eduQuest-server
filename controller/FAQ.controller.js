import { FAQ } from "../models/faq.model.js";

//create FAQ
export const createFAQ = async (req, res, next) => {
  try {
    await FAQ.create(req.body);
    res.status(201).send('created successfully');
  } catch (error) {
    next(error);
  }
};

//get all FAQ
export const getFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.find();
    res.status(200).send(faq);
  } catch (error) {
    next(error);
  }
};

//update FAQ
export const updateFAQ = async (req, res, next) => {
  try {
    await FAQ.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send('updated successfully');
  } catch (error) {
    next(error);
  }
};

//delete FAQ
export const deleteFAQ = async (req, res, next) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.status(200).send('deleted successfully');
  } catch (error) {
    next(error);
  }
};

