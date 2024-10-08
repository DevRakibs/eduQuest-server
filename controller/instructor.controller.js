import courseModel from "../models/course.model.js";
import userModel from "../models/user.model.js";

export const getInstructors = async (req, res, next) => {
  try {
    const instructors = await userModel.find({ role: 'instructor' });
    const instructorCourses = await courseModel.find({ instructor: { $in: instructors.map(i => i._id) } });
    const instructorsWithCourses = instructors.map(instructor => ({
      ...instructor.toObject(),
      courses: instructorCourses.filter(course => course.instructor.toString() === instructor._id.toString())
    }));
    res.status(200).json(instructorsWithCourses);
  } catch (error) {
    next(error);
  }
};
