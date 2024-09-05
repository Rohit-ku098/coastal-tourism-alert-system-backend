import { Router } from "express";
import { getUserNotifications } from "../controller/userNotification.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJwt)
router.get("/", getUserNotifications)

export default router