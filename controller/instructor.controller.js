import courseModel from "../models/course.model.js";
import userModel from "../models/user.model.js";

//get all instructors
export const getInstructors = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = { role: 'instructor' };
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const instructors = await userModel.find(query);
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

//get instructor by id
export const getInstructorById = async (req, res, next) => {
  try {
    const instructor = await userModel.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    const courses = await courseModel.find({ instructor: instructor._id })
      .populate('category')
    // .select('-studentsEnrolled');

    const instructorWithCourses = {
      ...instructor.toObject(),
      courses
    };

    res.status(200).json(instructorWithCourses);
  } catch (error) {
    next(error);
  }
};
