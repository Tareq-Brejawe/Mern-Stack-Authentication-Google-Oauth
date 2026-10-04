/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
 
import { create } from 'zustand';

axios.defaults.withCredentials = true;

const URL = import.meta.env.MODE === "development" ?"http://localhost:5000/api/auth" :"/api/auth" ;

type AuthTypes = {
    isLoading: boolean,
    error: string |null, 
    user: any, 
    isCheckAuth: boolean,
    signup:(email:string,password:string,name:string)=>void,
    verifyCode:(code:string)=>void,
    login:(email:string,password:string)=>void
    logout:()=>void,
    forgotPassword:(email:string)=>void,
    resetPassword:(password:string,token:string)=>void,
    googleLogin:(credential:string)=>void,
    
    checkAuth:()=>void //try make it string

};

export const useAuth = create<AuthTypes>()((set) => ({
    isLoading: false,
    user: null,
    error:'',
    isAuthenticated: false,
    isCheckAuth: true,

 googleLogin: async (credential: string) => {
  set({ isLoading: true, error: null });
  try {
    const res = await axios.post(`${URL}/google`, { credential });
    set({ user: res.data.user, isLoading: false , error: null });
  } catch (error: any) {
    set({ isLoading: false, error: error.response?.data?.message || "Google sign in failed" });
    throw new Error("Google sign in failed");
  }
},
 
 
    signup: async (email:string,password:string,name:string) => {
         set({isLoading:true,error:null})
         const res = await axios.post(`${URL}/signup`,{email,password,name});
         try {
            set({user:res.data.user,isLoading:false,error:null});
         } catch (error:any) {
             set({isLoading:false,error:error.message || "Sign up failed"})
             throw new Error("Sign up failed");
         }
    },
    verifyCode:async(code:string)=>{
         set({isLoading:true,error:null})
         const res = await axios.post(`${URL}/verify-email`,{code})

         try {
            set({user:res.data.user,isLoading:false,error:null});
         } catch (error:any) {
            set({isLoading:false,error:error.message ||"Verify email failed"})
            throw new Error("Verify email failed")
         }
    },
    login:async(email:string,password:string)=>{
        set({isLoading:true,error:null});
        try {
            const res = await axios.post(`${URL}/login`,{email,password});
            set({user:res.data.user,isLoading:false,error:null})
        } catch (error:any) {
            set({isLoading:false,error:"Invalid email address and password."})
           
        }
    },
    logout:async()=>{
         set({isLoading:true,error:null});
         try {
            await axios.post(`${URL}/logout`);
            set({user:null,isLoading:false,error:null})
         } catch (error:any) {
            set({isLoading:false,error:error.message || "logged out failed"})
         }
    },
    forgotPassword:async(email:string)=>{
         set({isLoading:true,error:null});
         try {
             await axios.post(`${URL}/forgot-password`,{email});
            set({isLoading:false,error:null})
         } catch (error:any) {
            set({isLoading:false,error:error.message || "Send reset password link failed"})
            throw new Error("Send reset password link failed")
         }
    },
    resetPassword:async(password:string,token:string)=>{
        set({isLoading:true,error:null});
        try {
           const res = await axios.post(`${URL}/reset-password?token=${token}`,{password})
           set({user:res.data.user,isLoading:false,error:null})
        } catch (error:any) {
            set({isLoading:false,error:error.message || "Reset password failed"})
            throw new Error("Reset password failed")
        }
    },
    checkAuth:async()=>{
      set({isLoading:false,isCheckAuth:true,error:null})
      try {
        const res = await axios.get(`${URL}/check-auth`);
        set({user:res.data.user,isLoading:false,isCheckAuth:false,error:null})
      } catch (error:any) {
        set({isLoading:false,isCheckAuth:false,error:error.message|| "Authenticaion error",})
        throw new Error("Authenticaion error")
    }
    }
}));
