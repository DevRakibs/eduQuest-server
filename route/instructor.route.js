import express from 'express';
import { getInstructorById, getInstructors } from '../controller/instructor.controller.js';

export const route = express.Router();

route.get('/all', getInstructors);

route.get('/details/:id', getInstructorById);


export { route as instructorRoute };
