import courseModel from '../models/course.model.js';
import userModel from '../models/user.model.js';

export const isCourseInstructorOrAdmin = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).send('Course not found');
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.role === 'admin' || course.instructor.toString() === userId) {
      next();
    } else {
      return res.status(403).send('Access denied. You are not the instructor of this course or an admin.');
    }
  } catch (err) {
    next(err);
  }
};