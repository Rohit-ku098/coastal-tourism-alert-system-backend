import { Router } from 'express'
import { User } from "../models/user/user.model.js";
import { changePassword, loginUser, logoutUser, refreshAccessToken, registerUser } from '../controller/user.controller.js';
import { verifyJwt } from '../middleware/auth.middleware.js';

const router = Router();

router.post("/signup", registerUser);
router.post("/login", loginUser)
router.post("/logout",verifyJwt, logoutUser) // Protected route
router.post("/refresh-token", refreshAccessToken)
router.patch("/change-password",verifyJwt, changePassword)
export default router;
