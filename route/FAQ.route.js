import { Router } from "express";
import { createFAQ, getFAQ, updateFAQ, deleteFAQ } from "../controller/FAQ.controller.js";
import { verifyToken } from "../middleware/verify.token.js";
import { isAdmin } from "../middleware/isAdmin.js";

const route = Router();

route.post('/create', verifyToken, isAdmin, createFAQ);
route.get('/all', getFAQ);
route.put('/update/:id', verifyToken, isAdmin, updateFAQ);
route.delete('/delete/:id', verifyToken, isAdmin, deleteFAQ);

export { route as FAQRoute };
