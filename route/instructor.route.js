import express from 'express';
import { getInstructors } from '../controller/instructor.controller.js';

export const route = express.Router();

route.get('/all', getInstructors);


export { route as instructorRoute };
