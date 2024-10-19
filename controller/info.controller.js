import { Info } from "../models/info.model.js";

//update info
export const updateInfo = async (req, res, next) => {
  try {
    const info = await Info.findOne();
    if (info) {
      await Info.findByIdAndUpdate(info._id, req.body, { new: true });
      res.status(200).send('Updated successfully');
    } else {
      const newInfo = new Info(req.body);
      await newInfo.save();
      res.status(201).send('Created successfully');
    }
  } catch (error) {
    next(error);
  }
};

//get info
export const getInfo = async (req, res, next) => {
  try {
    const info = await Info.findOne();
    res.status(200).send(info);
  } catch (error) {
    next(error);
  }
};