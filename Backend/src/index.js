import dotenv from "dotenv";
import app from "./app.js"
import connectDB from "./db/index.js"

dotenv.config();
console.log("CORS:", process.env.CORS_ORIGIN);
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
        
    })
})
.catch((error) => {
    console.error("Error", error);
    throw error;
});