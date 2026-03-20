import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";

dotenv.config();

const app = express();


// app.use(cors())

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json(
    { limit: "16kb" }
))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import userRoute from "./routes/user.route.js"

app.use("/api/user", userRoute)

// http://localhost:8000/api/user

export default app;

