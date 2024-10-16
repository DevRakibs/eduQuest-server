import { Router } from "express";
import { createResourse, getResourses, updateResourse, deleteResourse } from "../controller/resourse.controller.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { verifyToken } from "../middleware/verify.token.js";

const route = Router();

route.post('/create', verifyToken, isAdmin, createResourse);
route.get('/all', getResourses);
route.put('/update/:id', verifyToken, isAdmin, updateResourse);
route.delete('/delete/:id', verifyToken, isAdmin, deleteResourse);

export { route as resourseRoute };
