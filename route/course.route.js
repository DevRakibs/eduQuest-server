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
  getInstructorCourses,
  enrollInCourse,
  getEnrolledCourses,
  getCourseByCategory,
  getCourseBySearch,
  getCourseByInstructor,
  addReviewToCourse,
  updateReview,
  deleteReview,
  getPopularCourses,
  getRecentCourses,
  getCoursesWithPagination
} from "../controller/course.controller.js";
import { isAdmin } from "../middlewere/isAdmin.js";

const router = express.Router();

router.post('/create', verifyToken, createCourse);
router.put('/update/:id', verifyToken, updateCourse);
router.put('/update-content/:id', verifyToken, updateCourseContent);
router.get('/all', getAllCourses);
router.get('/:id', getCourse);
router.delete('/delete/:id', verifyToken,isAdmin, deleteCourse);
router.get('/instructor/courses', verifyToken, getInstructorCourses);
router.post('/enroll/:courseId', verifyToken, enrollInCourse);
router.get('/enrolled/courses', verifyToken, getEnrolledCourses);
router.get('/category/:categoryId', getCourseByCategory);
router.get('/search', getCourseBySearch);
router.get('/instructor/:instructorId', getCourseByInstructor);
// router.post('/review/:id', verifyToken, addReviewToCourse);
// router.put('/review/:id', verifyToken, updateReview);
// router.delete('/review/:id', verifyToken, deleteReview);
// router.get('/popular', getPopularCourses);
// router.get('/recent', getRecentCourses);
// router.get('/paginated', getCoursesWithPagination);

export { router as courseRoute };
