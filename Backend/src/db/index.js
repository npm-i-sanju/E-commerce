import mongoose from "mongoose";
import { DB_NAME } from "../constance.js";

const connectDB = async()=>{
    try {
        const connectionInn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB Connected || DB Host: ${DB_NAME}`)
    } catch (error) {
        console.log("Error",error)
        process.exit(1)
    }
}

export default connectDB;