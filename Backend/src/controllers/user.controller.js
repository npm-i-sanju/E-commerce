import { asyancHandler } from "../utils/AsynceHendler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refrershToken = user.generateRefreshToken();
        user.refreshToken = refrershToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refrershToken }
    } catch (error) {
        throw new ApiError(500, "Token generation Failed")
    }
}

const registerUser = asyancHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (username === "") {
        throw new ApiError(400, "Name Is Required")
    }

    if (email === "") {
        throw new ApiError(400, "Email is Required")
    }

    if (password === "") {
        throw new ApiError(400, "Password is required")
    }

    const userAlreadyExit = await User.findOne({
        $or: [{
            email
        }, { password }]
    })

    if (userAlreadyExit) {
        throw new ApiError(409, "User Already exist with this email or username")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong user creation failed")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User regestered successfully")
    )
})

export{
    registerUser
}

