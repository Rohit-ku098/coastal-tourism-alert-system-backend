import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { setUserPreference } from "../controller/userPreference.controller.js";

const router = Router();
router.post('/set/:beachId',verifyJwt, setUserPreference);


export default router;