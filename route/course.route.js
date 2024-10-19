import express from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import { isEnrolled } from "../middleware/isEnrolled.js";
import { verifyToken } from "../middleware/verify.token.js";
import { isCourseInstructorOrAdmin } from "../middleware/isCourseInstructorOrAdmin.js";
import {
  createCourse,
  updateCourse,
  updateCourseContent,
  getAllCourses,
  getCourse,
  deleteCourse,
  enrollInCourse,
  getMyEnrolledCourses,
  getCourseByCategory,
  getCourseBySearch,
  getCourseByInstructor,
  addReviewToCourse,
  updateReview,
  deleteReview,
  getPopularCourses,
  getRecentCourses,
  getCoursesWithPagination,
  adminEnrollStudent,
  getAllEnrolledCourses,
  loggedInstructorRecentCourse,
  loggedInstructorAllCourses,
  editEnrollment,
  cancelEnrollment,
  loggedStudentRecentCourse,
  createCourseContent,
  getCourseContent,
  deleteCourseContent,
} from "../controller/course.controller.js";
import { isInstructorOrAdmin } from "../middleware/isInstructorOrAdmin.js";

const router = express.Router();

// create course  
router.post('/create', verifyToken, isInstructorOrAdmin, createCourse);

// update course
router.put('/update/:courseId', verifyToken, isCourseInstructorOrAdmin, updateCourse);

// Create course content 
router.post('/create/content/:courseId', verifyToken, isInstructorOrAdmin, createCourseContent);

// Update course content
router.put('/update/content/:courseId', verifyToken, isCourseInstructorOrAdmin, updateCourseContent);

// Get course content (enrolled students, instructor, and admins)
router.get('/content/:courseId', verifyToken, isEnrolled, getCourseContent);

// get all courses
router.get('/all', getAllCourses);

// get course by id
router.get('/:id', getCourse);

// delete course
router.delete('/delete/:courseId', verifyToken, isAdmin, deleteCourse);

// delete course content
router.delete('/delete/content/:courseId', verifyToken, isAdmin, deleteCourseContent);

// get all courses by instructor
router.get('/instructor/all', verifyToken, loggedInstructorAllCourses);

// get recent courses by instructor
router.get('/instructor/recent', verifyToken, loggedInstructorRecentCourse);

// get recent enrolled courses by student
router.get('/student/recent', verifyToken, loggedStudentRecentCourse);

// enroll in course (not use)
router.post('/enroll/:courseId', verifyToken, enrollInCourse);

// admin enroll student
router.post('/admin/enroll', verifyToken, isAdmin, adminEnrollStudent);

// edit enrollment
router.put('/enrolled/edit', verifyToken, isAdmin, editEnrollment);

// cancel enrollment
router.post('/enrolled/cancel', verifyToken, isAdmin, cancelEnrollment);

// get my enrolled courses
router.get('/enrolled/my', verifyToken, getMyEnrolledCourses);

// get all enrolled courses
router.get('/enrolled/all', verifyToken, isAdmin, getAllEnrolledCourses);

// get course by category (not use)
router.get('/category/:categoryId', getCourseByCategory);

// get course by search (not use)
router.get('/search', getCourseBySearch);

// get course by instructor
router.get('/instructor/:instructorId', getCourseByInstructor);

// add review to course (not use)
router.post('/review/:id', verifyToken, addReviewToCourse);

// update review (not use)
router.put('/review/:id', verifyToken, updateReview);

// delete review (not use)
router.delete('/review/:id', verifyToken, deleteReview);

// get popular courses (not use)
router.get('/popular', getPopularCourses);

// get recent courses (not use)
router.get('/recent', getRecentCourses);

// get courses with pagination (not use)
router.get('/paginated', getCoursesWithPagination);


export { router as courseRoute };
