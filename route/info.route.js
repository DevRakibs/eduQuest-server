import { Router } from "express";
import { updateInfo, getInfo } from "../controller/info.controller.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { verifyToken } from "../middleware/verify.token.js";

const router = Router();

router.put('/update', verifyToken, isAdmin, updateInfo);
router.get('/get', getInfo);

export { router as infoRouter };