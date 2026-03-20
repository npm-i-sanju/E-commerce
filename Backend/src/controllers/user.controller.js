import { asyancHandler } from "../utils/AsynceHendler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }; 
    } catch (error) {
        throw new ApiError(500, "Token generation failed");
    }
};

const registerUser = asyancHandler(async (req, res) => {
    const { name, email, password } = req.body; 

    console.log(req.body);
    if (!name?.trim())     throw new ApiError(400, "Name is Required");
    if (!email?.trim())    throw new ApiError(400, "Email is Required");
    if (!password?.trim()) throw new ApiError(400, "Password is Required");

    const userAlreadyExists = await User.findOne({
        $or: [{ email }, { username: name.toLowerCase() }]
    });

    if (userAlreadyExists) {
        throw new ApiError(409, "User already exists with this email or username");
    }

    const user = await User.create({
        username: name.toLowerCase(), 
        email,
        password,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong, user creation failed");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

const logInUser = asyancHandler(async (req, res) => {
    const { username, password } = req.body;

    
    if (!username || !password) {
        throw new ApiError(400, "Username and password are required");
    }

    
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

   
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    
    const cookieOptions = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

export { registerUser, logInUser }; 