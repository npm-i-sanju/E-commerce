import {Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
//import { verifyJWT } from "../middlewares/auth.middleware.js";
import { logInUser } from "../controllers/user.controller.js";


const router = Router();

router.route("/register").post( registerUser)
router.route("/login").post(logInUser)

export default router;