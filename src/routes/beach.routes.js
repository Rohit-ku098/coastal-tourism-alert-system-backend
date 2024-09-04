import {Router} from "express"
import { getBeaches, getBeachInfo } from "../controller/beach.controller.js";

const router = Router();

router.get("/", getBeaches);
router.get("/:id", getBeachInfo);
export default router