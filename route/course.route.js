/* eslint-disable no-unused-vars */
import express from "express";
import { verifyToken } from "../middlewere/verify.token.js";
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
} from "../controller/course.controller.js";
import { isAdmin } from "../middlewere/isAdmin.js";

const router = express.Router();

// create course  
router.post('/create', verifyToken, createCourse);
// update course
router.put('/update/:id', verifyToken, updateCourse);
// update course content
router.put('/update-content/:id', verifyToken, updateCourseContent);
// get all courses
router.get('/all', getAllCourses);
// get course by id
router.get('/:id', getCourse);
// delete course
router.delete('/delete/:id', verifyToken, isAdmin, deleteCourse);
// get all courses by instructor
router.get('/instructor/all', verifyToken, loggedInstructorAllCourses);
// get recent courses by instructor
router.get('/instructor/recent', verifyToken, loggedInstructorRecentCourse);
// enroll in course
router.post('/enroll/:courseId', verifyToken, enrollInCourse);
// admin enroll student
router.post('/admin/enroll', verifyToken, isAdmin, adminEnrollStudent);
// edit enrollment
router.put('/enrolled/edit', verifyToken, isAdmin, editEnrollment);
// cancell enrollment
router.post('/enrolled/cancel', verifyToken, isAdmin, cancelEnrollment);
// get my enrolled courses
router.get('/enrolled/all/me', verifyToken, getMyEnrolledCourses);
// get all enrolled courses
router.get('/enrolled/all', verifyToken, isAdmin, getAllEnrolledCourses);
// get course by category
router.get('/category/:categoryId', getCourseByCategory);
// get course by search
router.get('/search', getCourseBySearch);
// get course by instructor
router.get('/instructor/:instructorId', getCourseByInstructor);
// add review to course
router.post('/review/:id', verifyToken, addReviewToCourse);
// update review
// router.put('/review/:id', verifyToken, updateReview);
// delete review
// router.delete('/review/:id', verifyToken, deleteReview);
// get popular courses
// router.get('/popular', getPopularCourses);
// get recent courses
router.get('/recent', getRecentCourses);
// get courses with pagination
// router.get('/paginated', getCoursesWithPagination);

export { router as courseRoute };
