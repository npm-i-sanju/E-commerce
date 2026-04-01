import { asyancHandler } from "../utils/AsynceHendler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();


const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        
        const accessToken = user.generateAccessToken();
        //console.log("accessToken--", accessToken);
        const refreshToken = user.generateRefreshToken();
        //console.log("refreshToken--", refreshToken);
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        console.error("Real error:", error) // ← always do this
        throw error instanceof ApiError
            ? error
            : new ApiError(500, "Failed to generate tokens")
    }
}


const registerUser = asyancHandler(async (req, res) => {
    const { name, email, password } = req.body;

    console.log("body:", req.body);
    if (!name?.trim()) throw new ApiError(400, "Name is Required");
    if (!email?.trim()) throw new ApiError(400, "Email is Required");
    //if (!password?.trim()) throw new ApiError(400, "Password is Required");
    if (password === "") {
        throw new ApiError(400, "Password is Required")
    }
    const userAlreadyExists = await User.findOne({
        $or: [{ email }, { name: name.toLowerCase() }]
    });

    if (userAlreadyExists) {
        throw new ApiError(409, "User already exists with this email or username");
    }

    const user = await User.create({
        name: name.toLowerCase(),
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
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ $or: [{ email }] });
    console.log(user);
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }


    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password");
    }


    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
    // console.log("accessToken-->", accessToken);
    //  console.log("refreshToken-->", refreshToken);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    console.log(loggedInUser);

    const cookieOptions = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, refreshToken },
                "User logged in successfully"
            )
        );
});

const logoutUser = asyancHandler(async (req, res) => {
    // find user in db

    await User.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1
        }
    }, {
        new: true
    })

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }
    return res.status(201)
        .clearCookie("refreshToken", cookieOptions)
        .clearCookie("accessToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyancHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(400, "Unauthorized request")
    }
    try {
        // Step 1: verify the refresh token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        // Step 2: find user on db
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
        // Step 3: check refresh token matches what's stored in DB
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }
        // Step 4: generate new tokens
        const options = {
            httpOnly: true,
            secure: true
        }

        const accessToken = user.generateAccessToken()
        const newRefreshToken = user.generateRefreshToken();
        // // Step 5: save new refresh token to DB
        // user.refreshToken = newRefreshToken;
        // await user.save({ validateBeforeSave: false });
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"))
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }


})



export { registerUser, logInUser, logoutUser, refreshAccessToken }; 