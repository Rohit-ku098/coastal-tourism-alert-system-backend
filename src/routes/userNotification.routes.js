import { Router } from "express";
import { deleteUserNotification, getUserNotifications, readUserNotification } from "../controller/userNotification.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJwt)
router.get("/", getUserNotifications)
router.route("/:notificationId")
    .delete(deleteUserNotification)
    .patch(readUserNotification)

export default router