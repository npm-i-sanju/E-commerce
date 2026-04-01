import {Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { veryFyJWT} from "../middlewares/auth.middleware.js";
import { logInUser,logoutUser,refreshAccessToken } from "../controllers/user.controller.js";
import {createProduct} from "../controllers/product.controller.js"

const router = Router();

router.route("/register").post( registerUser)
router.route("/login").post(logInUser)
router.route("/logout").post(veryFyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/product").post(createProduct)

export default router;