import express from 'express';
import { getStudents } from '../controller/student.controller.js';

export const route = express.Router();

route.get('/all', getStudents);


export { route as studentRoute };
