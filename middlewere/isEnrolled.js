import courseModel from "../models/course.model";

export const isEnrolled = async (req, res, next) => {
  try {
    const course = await courseModel.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const isUserEnrolled = course.studentsEnrolled.some(studentId => studentId.equals(req.user._id));

    if (!isUserEnrolled) {
      return res.status(403).json({ message: 'Access denied. You must enroll in this course to access its content.' });
    }

    req.course = course; // Store the course in the request object
    next();
  } catch (err) {
    res.status(500).json({ message: 'Error checking enrollment status', error: err.message });
  }
};
