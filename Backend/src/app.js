import express from "express";
import cors from "cors";


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
 
import userRoute from "./routes/user.route.js"

app.use("/api/v1/user", userRoute)


export default app;

