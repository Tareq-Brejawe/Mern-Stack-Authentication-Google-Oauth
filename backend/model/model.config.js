import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
password:{
    type:String,
    required:function(){ return !this.googleId },
},
googleId:{ type:String, unique:true, sparse:true }, 
 
    name:{
        type:String,
        required:true
    },
    lasLogin:{
        type:Date,
        default:Date.now
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationToken:String,
    verificationTokenExDate:Date,
    resetPasswordToken:String,
    resetPasswordTokenExDate:Date
},{timestamps:true})


export const User = mongoose.model("User",userSchema)