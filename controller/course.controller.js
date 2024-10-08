import courseModel from '../models/course.model.js';

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
    const { id } = req.params;
    const course = await courseModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!course) {
      return res.status(404).send('Course not found');
    }

    res.status(200).send('Course updated successfully');
  } catch (err) {
    next(err);
  }
};

// update course content
export const updateCourseContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const course = await courseModel.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );
    if (!course) {
      return res.status(404).send('Course not found');
    }
    res.status(200).send('Course content updated successfully');
  } catch (err) {
    next(err);
  }
};

// get all courses
export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await courseModel.find()
      .populate('instructor')
      .populate('studentsEnrolled')
      .populate('category');
    res.status(200).send(courses);
  } catch (err) {
    next(err);
  }
};

// get course by id
export const getCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await courseModel.findById(id).
      populate('instructor').
      populate('studentsEnrolled').
      populate('category');
    if (!course) {
      return res.status(404).send('Course not found');
    }
    res.status(200).send(course);
  } catch (err) {
    next(err);
  }
};

//delete course
export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await courseModel.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    res.status(200).send('Course deleted successfully');
  } catch (err) {
    next(err);
  }
};

// get instructor courses
export const getInstructorCourses = async (req, res, next) => {
  try {
    const instructorId = req.user.id;
    const courses = await courseModel.find({ instructor: instructorId });
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

// get enrolled courses
export const getEnrolledCourses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const courses = await courseModel.find({ studentsEnrolled: userId });
    res.status(200).send(courses);
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
