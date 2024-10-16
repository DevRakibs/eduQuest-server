import courseModel from "../models/course.model.js";
import userModel from "../models/user.model.js";

export const isEnrolled = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (user.role === 'admin') {
      return next(); // Allow access for admins
    }

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).send('Course not found');
    }

    if (course.instructor.toString() === userId) {
      return next(); // Allow access for the course instructor
    }

    const isUserEnrolled = course.studentsEnrolled.some(
      enrollment => enrollment.student.toString() === userId &&
        enrollment.enrollmentStatus === 'approved'
    );

    if (!isUserEnrolled) {
      return res.status(403).send('Access denied. You are not permitted to access this course.');
    }

    next();
  } catch (err) {
    next(err);
  }
};
