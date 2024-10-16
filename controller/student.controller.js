import userModel from "../models/user.model.js";
import courseModel from "../models/course.model.js";

//get all students
export const getStudents = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = { role: 'student' };
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const students = await userModel.find(query);

    const studentsWithCourses = await Promise.all(students.map(async (student) => {
      const enrolledCourses = await courseModel.find({
        'studentsEnrolled.student': student._id
      })
        .populate('category')
        .populate('instructor')
        .select('-studentsEnrolled'); // Exclude studentsEnrolled field to reduce data size

      return {
        ...student.toObject(),
        enrolledCourses
      };
    }));

    res.status(200).json(studentsWithCourses);
  } catch (err) {
    next(err);
  }
};

//get student by id
export const getStudentById = async (req, res, next) => {
  try {
    const student = await userModel.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const enrolledCourses = await courseModel.find({
      'studentsEnrolled.student': student._id
    })
      .populate('category')
      .populate('instructor', 'username email')
      .select('-studentsEnrolled'); //exclude to reduce the response size

    const studentWithCourses = {
      ...student.toObject(),
      enrolledCourses
    };

    res.status(200).send(studentWithCourses);
  } catch (err) {
    next(err);
  }
};
