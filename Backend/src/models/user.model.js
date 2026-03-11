import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt";


const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique: true,
            lowarcase: true,
            trim:true,
            index: true,
        },email:{
            type:String,
            required: true,
            unique:true,
            lowarcase:true,
            trim:true,
        },password:{
type:String,
required:[true,"Password is Required"],
unique:true,
        },refreshToken:{
            type:String
        }
    },{timestamps:true}
)

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return ;

    this.password = await bcrypt.hash(this.password,10);
    // next();
})

userSchema.method.isPasswordCorrect= async function(password){
    return await  bcrypt.compare(password,this.password)
}

userSchema.method.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,  
    },process.env.ACCESS_TOKEN_SECRET,{
       expIresIn: process.env.ACCESS_TOKEN_EXPIRES 
    })
}

userSchema.method.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id
    }, process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES
    })
}

export const User = mongoose.model("User",userSchema); 