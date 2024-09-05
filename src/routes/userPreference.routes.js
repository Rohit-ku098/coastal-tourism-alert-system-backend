import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { getUserPreferenceBeaches, removeUserPreference, setUserPreference } from "../controller/userPreference.controller.js";

const router = Router();
router.use(verifyJwt);
router.route('/:beachId')
    .post(setUserPreference)
    .delete(removeUserPreference)

router.get("/", getUserPreferenceBeaches)


export default router;