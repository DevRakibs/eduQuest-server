import { Router } from "express";
import { createContact, getAllContacts } from "../controller/contact.controller.js";

const router = Router();

router.post('/create', createContact);
router.get('/all', getAllContacts);

export { router as contactRoute };