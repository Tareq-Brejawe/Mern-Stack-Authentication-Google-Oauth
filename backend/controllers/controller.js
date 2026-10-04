import { User } from "../model/model.config.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto'
import { generateToken } from "../utils/generateToken.js";
import { resetPasswordSuccess, sendPasswordResetLink, sendVerifictionCode } from "../mailtrap/email.js";
import { OAuth2Client } from "google-auth-library";
// import { sendSms } from "../rasel/index.js";

const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export const GoogleAuth = async (req, res) => {
    const { credential } = req.body;
    try {
        if (!credential) {
            return res.status(400).json({ success:false, message:"Google credential is required" });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { sub, email, name, picture, email_verified } = ticket.getPayload();

        if (!email_verified) {
            return res.status(400).json({ success:false, message:"Google email is not verified" });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ email, name, googleId: sub, isVerified: true });
        } else if (!user.googleId) {
            // user already signed up with email/password -> link the accounts
            user.googleId = sub;
            user.isVerified = true;
            if (!user.avatar) user.avatar = picture;
        }

        user.lasLogin = Date.now();
        await user.save();

        generateToken(res, user._id);

        res.status(200).json({ success:true, message:"Google login successfully", user:{...user._doc, password:undefined} });
    } catch (error) {
        res.status(400).json({ success:false, message:"Google authentication failed" });
    }
}


export const Signup = async(req,res)=>{
    const {email,password,name} = req.body;

    try {
        if(!email || !password || !name){
            throw new Error("All fields are required");
        }

        const existsUser = await User.findOne({email});

        if(existsUser){
            return res.status(400).json({success:false,message:"User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const verificationToken = Math.floor(100000+Math.random() * 900000).toString();

        const user = new User({
            email,
            password:hashedPassword,
            name,
            verificationToken,
            verificationTokenExDate:Date.now() + 24*60*60*1000
        })

        await user.save();

        generateToken(res,user._id)

    //    await sendVerifictionCode(email,verificationToken)
        
    //    await sendSms() for send otp sms
        
        res.status(200).json({success:true,message:"Sign up successfully",user:{...user._doc,password:undefined}})

    } catch (error) {
        res.status(400).json({success:false,message:error.message})
    }
}

export const verifyEmail = async(req,res)=>{
    const {code} = req.body;
    try {
      if(!code){
          return res.status(400).json({success:false,message:"No verification code is sent"})
        }
        
      const user = await User.findOne({verificationToken:code,verificationTokenExDate:{$gt:Date.now()}})
      if(!user){
            return res.status(400).json({success:false,message:"Invalid verification code"});
        }

        user.isVerified = true;
        user.verificationToken=undefined;
        user.verificationTokenExDate=undefined;

        await user.save();
        res.status(200).json({success:true,message:"Verify email successfull",user:{...user._doc,password:undefined}});
} catch (error) {
   res.status(400).json({success:false,message:error.message}); 
}
}

export const Login = async(req,res)=>{
    const {email,password} = req.body;

    try {
        if(!email || !password){
            throw new Error('All fields are required');
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:'Invalid email address and password.'});
        } 
        if(!user.password){
        return res.status(400).json({success:false,message:"Invalid email address and password."});
}
        const checkPassword = await bcrypt.compare(password,user.password);
        if(!checkPassword){
            return res.status(400).json({success:false,message:"Invalid email address and password."});
        }

        user.lasLogin = Date.now();
        await user.save();

        generateToken(res,user._id)

        res.status(200).json({success:true,message:"logged in successfully",user:{...user._doc,password:undefined}});

    } catch (error) {
       res.status(400).json({success:false,message:error.message}) 
    }
}

export const Logout = async(req,res)=>{
    try {
        res.clearCookie('token');
        res.status(200).json({success:true,message:"Logged out successfully"});
    } catch (error) {
        res.status(400).json({success:false,message:error.message})
     }
}

export const ForgotPassword = async(req,res)=>{
    const {email} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"User is not exists"})
        }        
 
        const resetPasswordToken = crypto.randomBytes(20).toString("hex")

        user.resetPasswordToken = resetPasswordToken
        user.resetPasswordTokenExDate = Date.now() + 24 * 60 * 60 *1000

        await user.save();
        const url = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`
        await sendPasswordResetLink(email,url)

        res.status(200).json({success:true,message:"reset password url sent successfully"})

    } catch (error) {
        res.status(400).json({success:false,message:error.message});
    }
}

export const ResetPassword = async(req,res)=>{
    const {password} = req.body;
    const token = req.params.token;

    try {
        const user = await User.findOne({resetPasswordToken:token,resetPasswordTokenExDate:{$gt:Date.now()}});
         if(!user){
            return res.status(400).json({success:false,message:"Invalid or expired token"})
        }
      
        const hashedPassword = await bcrypt.hash(password,10);
        user.password = hashedPassword
        user.resetPasswordToken=undefined;
        user.resetPasswordTokenExDate=undefined;

        await user.save();
        await resetPasswordSuccess(user.email)

        res.status(200).json({success:true,message:"Successfull reset password",user:{...user._doc,password:undefined}})

    } catch (error) {
        res.status(400).json({success:false,message:error.message});
    }
}

export const CheckAuth = async(req,res)=>{

    try {
        const user = await User.findOne({_id:req.userId});
        if(!user){
            return res.status(400).json({success:false,message:"User is not exists"});
        }
        res.status(200).json({success:true,message:"User is authenticated",user:{...user._doc,password:undefined}})
   
    } catch (error) {
        res.status(400).json({success:false,message:error.message})
    }
}