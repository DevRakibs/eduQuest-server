import contentModel from '../models/content.model.js';
import courseModel from '../models/course.model.js';
import userModel from '../models/user.model.js';
import { sendCourseEnrollmentConfirmation } from '../utils/emailSend.js';

// create course
export const createCourse = async (req, res, next) => {

  try {
    const course = new courseModel(req.body);

    await course.save();
    res.status(201).send('Course created successfully');
  } catch (err) {
    next(err);
  }
};

// update course
export const updateCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await courseModel.findByIdAndUpdate(courseId, req.body, { new: true });

    if (!course) {
      return res.status(404).send('Course not found');
    }

    // If course status is 'inactive', update content status to 'archived'
    if (course.status === 'inactive') {
      await contentModel.findOneAndUpdate(
        { courseId: course._id },
        { status: 'archived' }
      );
    }

    res.status(200).send('Course updated successfully');
  } catch (err) {
    next(err);
  }
};

// Create course content
export const createCourseContent = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { sections, status } = req.body;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).send('Course not found');
    }

    const courseContent = new contentModel({
      courseId,
      status,
      sections
    });

    await courseContent.save();

    course.content = courseContent._id;
    await course.save();

    res.status(201).send('Course content created successfully');
  } catch (err) {
    next(err);
  }
};

// Get course content
export const getCourseContent = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const courseContent = await contentModel.findOne({ courseId });
    if (!courseContent) {
      return res.status(404).send('Course content not found');
    }

    // Sort sections by order
    courseContent.sections.sort((a, b) => a.order - b.order);

    // Sort content within each section by order
    courseContent.sections.forEach(section => {
      section.content.sort((a, b) => a.order - b.order);
    });

    res.status(200).json(courseContent);
  } catch (err) {
    next(err);
  }
};

// Update course content
export const updateCourseContent = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { sections, status } = req.body;

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).send('Course not found');
    }

    const courseContent = await contentModel.findOneAndUpdate(
      { courseId },
      { status, sections },
      { new: true, runValidators: true }
    );

    if (!courseContent) {
      return res.status(404).send('Course content not found');
    }

    res.status(200).send('Course content updated successfully');
  } catch (err) {
    next(err);
  }
};

//delete course
export const deleteCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await courseModel.findByIdAndDelete(courseId);
    if (!course) {
      return res.status(404).send('Course not found');
    }

    // Delete the associated course content
    await contentModel.findOneAndDelete({ courseId });

    res.status(200).send('Course and its content deleted successfully');
  } catch (err) {
    next(err);
  }
};

//delete course content
export const deleteCourseContent = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const courseContent = await contentModel.findOneAndDelete({ courseId });
    if (!courseContent) {
      return res.status(404).send('Course content not found');
    }

    // Update the course model to remove the content reference
    await courseModel.findByIdAndUpdate(courseId, { $unset: { content: 1 } });

    res.status(200).send('Course content deleted successfully');
  } catch (err) {
    next(err);
  }
};

// get all courses
export const getAllCourses = async (req, res, next) => {
  try {
    const { search, category, filter } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (filter) {
      query.status = filter;
    }

    const courses = await courseModel.find(query)
      .populate('instructor', '-password')
      .populate('studentsEnrolled')
      .populate('category');

    res.status(200).json(courses);
  } catch (err) {
    next(err);
  }
};

// get course by id
export const getCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await courseModel.findById(id).
      populate('instructor', '-password').
      populate('studentsEnrolled.student').
      populate('category');
    if (!course) {
      return res.status(404).send('Course not found');
    }
    res.status(200).send(course);
  } catch (err) {
    next(err);
  }
};

// get instructor courses
export const loggedInstructorAllCourses = async (req, res, next) => {
  try {
    const instructorId = req.user.id;
    const courses = await courseModel.find({ instructor: instructorId })
      .populate('category')
      .populate('instructor', '-password')
      .populate('studentsEnrolled');

    res.status(200).send(courses);
  } catch (err) {
    next(err);
  }
};

// enroll in course
export const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    if (course.studentsEnrolled.includes(userId)) {
      return res.status(400).send('You are already enrolled in this course');
    }
    course.studentsEnrolled.push(userId);
    await course.save();
    res.status(200).send('Enrolled in course successfully');
  } catch (err) {
    next(err);
  }
};

// admin enroll a student
export const adminEnrollStudent = async (req, res, next) => {
  try {
    const { courseId, studentId, paymentStatus, enrollmentStatus } = req.body;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    const alreadyEnrolled = course.studentsEnrolled.some(
      enrollment => enrollment.student.toString() === studentId
    );

    if (alreadyEnrolled) {
      return res.status(400).send('Student is already enrolled in this course');
    }

    course.studentsEnrolled.push({
      student: studentId,
      paymentStatus,
      enrollmentStatus
    });

    await course.save();

    // Send confirmation email
    const student = await userModel.findById(studentId);
    if (student && student.email) {
      await sendCourseEnrollmentConfirmation(student.email, {
        title: course.title,
        enrollmentStatus,
        paymentStatus
      });
    }

    res.status(200).send('Student enrolled in course successfully and confirmation email sent');
  } catch (err) {
    next(err);
  }
};

//edit enrollment
export const editEnrollment = async (req, res, next) => {
  try {
    const { courseId, studentId, paymentStatus, enrollmentStatus } = req.body;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    const enrollment = course.studentsEnrolled.find(enrollment => enrollment.student.toString() === studentId);
    if (!enrollment) {
      return res.status(404).send('Enrollment not found');
    }
    enrollment.paymentStatus = paymentStatus;
    enrollment.enrollmentStatus = enrollmentStatus;
    await course.save();
    res.status(200).send('Enrolled course updated successfully');
  } catch (err) {
    next(err);
  }
};

//cancel enrollment
export const cancelEnrollment = async (req, res, next) => {
  try {
    const { courseId, studentId } = req.body;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    const enrollment = course.studentsEnrolled.find(enrollment => enrollment.student.toString() === studentId);
    if (!enrollment) {
      return res.status(404).send('Enrollment not found');
    }
    course.studentsEnrolled = course.studentsEnrolled.filter(enrollment => enrollment.student.toString() !== studentId);
    await course.save();
    res.status(200).send('Enrollment cancelled successfully');
  } catch (err) {
    next(err);
  }
};

// get logged student enrolled courses
export const getMyEnrolledCourses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const courses = await courseModel.find({ 'studentsEnrolled.student': userId })
      .populate('instructor', '-password')
      .populate('category')
    res.status(200).send(courses);
  } catch (err) {
    next(err);
  }

};

// get all enrolled courses
export const getAllEnrolledCourses = async (req, res, next) => {
  try {
    const courses = await courseModel.find({ 'studentsEnrolled.0': { $exists: true } })
      .populate('instructor', '-password')
      .populate('category')
      .populate('studentsEnrolled.student');

    const enrolledStudents = courses.reduce((students, course) => {
      course.studentsEnrolled.forEach(enrollment => {
        const studentIndex = students.findIndex(s => s.student._id.toString() === enrollment.student._id.toString());
        if (studentIndex === -1) {
          students.push({
            student: enrollment.student,
            enrolledCourses: [{
              course,
              enrollmentStatus: enrollment.enrollmentStatus,
              paymentStatus: enrollment.paymentStatus
            }]
          });
        } else {
          students[studentIndex].enrolledCourses.push({
            course: course,
            enrollmentStatus: enrollment.enrollmentStatus,
            paymentStatus: enrollment.paymentStatus
          });
        }
      });
      return students;
    }, []);

    res.status(200).send(enrolledStudents);
  } catch (err) {
    next(err);
  }
};

// get course by category
export const getCourseByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const courses = await courseModel.find({ category: categoryId });
    res.status(200).send(courses);
  } catch (err) {
    next(err);
  }
};

// get course by search
export const getCourseBySearch = async (req, res, next) => {
  try {
    const { search } = req.query;
    const courses = await courseModel.find({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    });
    res.status(200).send(courses);
  } catch (err) {
    next(err);
  }
};

// get course by instructor
export const getCourseByInstructor = async (req, res, next) => {
  try {
    const { instructorId } = req.params;
    const courses = await courseModel.find({ instructor: instructorId });
    res.status(200).send(courses);
  } catch (err) {
    next(err);
  }
};

// add review to course
export const addReviewToCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const course = await courseModel.findById(id);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    const review = { user: userId, rating, comment };
    course.reviews.push(review);
    await course.save();
    res.status(200).send('Review added successfully');
  } catch (err) {
    next(err);
  }
};

// update review
export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const course = await courseModel.findById(id);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    const review = course.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );
    if (!review) {
      return res.status(404).send('Review not found');
    }
    review.rating = rating;
    review.comment = comment;
    await course.save();
    res.status(200).send('Review updated successfully');
  } catch (err) {
    next(err);
  }
};

// delete review
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const course = await courseModel.findById(id);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    const review = course.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );
    if (!review) {
      return res.status(404).send('Review not found');
    }
    course.reviews = course.reviews.filter(
      (review) => review.user.toString() !== userId.toString()
    );
    await course.save();
    res.status(200).send('Review deleted successfully');
  } catch (err) {
    next(err);
  }
};

// get popular courses
export const getPopularCourses = async (req, res, next) => {
  try {
    const courses = await courseModel
      .find()
      .sort({ studentsEnrolled: -1 })
      .limit(10);
    res.status(200).send(courses);
  } catch (err) {
    next(err);
  }
};


// get recent courses
export const getRecentCourses = async (req, res, next) => {
  try {
    const courses = await courseModel.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).send(courses)
      .populate('category')
      .populate('instructor')
      .populate('studentsEnrolled');
  } catch (err) {
    next(err);
  }
};

// get recent course for instructor
export const loggedInstructorRecentCourse = async (req, res, next) => {

  try {
    const instructorId = req.user.id;
    const courses = await courseModel.find({ instructor: instructorId })
      .populate('category')
      .populate('instructor')
      .populate('studentsEnrolled')
      .sort({ createdAt: -1 })
      .limit(10);
    res.status(200).send(courses);
  } catch (err) {
    next(err);
  }
};

//logged student recent courses
export const loggedStudentRecentCourse = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const courses = await courseModel.find({ 'studentsEnrolled.student': userId })
      .populate('instructor')
      .populate('category')
      .sort({ createdAt: -1 })
      .limit(10);
    res.status(200).send(courses);
  } catch (err) {
    next(err);
  }
};

// get courses with pagination
export const getCoursesWithPagination = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const courses = await courseModel
      .find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await courseModel.countDocuments();
    res.status(200).json({
      courses,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
};