import express from 'express';
import { getStudentById, getStudents } from '../controller/student.controller.js';

export const route = express.Router();

route.get('/all', getStudents);

route.get('/details/:id', getStudentById);


export { route as studentRoute };
