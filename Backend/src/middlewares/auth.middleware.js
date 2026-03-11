import { asyancHandler } from "../utils/AsynceHendler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";


const veryFyJWT =asyancHandler(async(req , res , next)=>{
    try {
        const token  = req.cppkies.accessToken||
        req.header("Authorization")?.replace("Bearer","")
        if (!token) {
            return next(new ApiError(401,"Unauthorized request"))
        }
        const decodedToken = jwt.verify(
            token,
            process.env.Access_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        )
        if (!user) {
            return next(new ApiError(401, "Unauthorized request"))
        }
        req.user=user
        next();
    } catch (error) {
        return next(
            new ApiError(401,error?.message || "invalid Token")
        )
    }
})
export {veryFyJWT}