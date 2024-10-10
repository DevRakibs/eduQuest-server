import userModel from "../models/user.model.js";
import courseModel from "../models/course.model.js";

export const getStudents = async (req, res, next) => {
  try {
    const students = await userModel.find({ role: "student" });
    const courses = await courseModel.find({ studentsEnrolled: { $in: students.map(student => student._id) } })
      .populate('category')
      .populate('instructor');

    const studentsWithCourses = students.map(student => ({
      ...student.toObject(),
      enrolledCourses: courses.filter(course =>
        course.studentsEnrolled.some(id => id.toString() === student._id.toString())
      )
    }));

    res.status(200).json(studentsWithCourses);
  } catch (err) {
    next(err);
  }
};
