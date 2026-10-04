import express from 'express'
import { CheckAuth, ForgotPassword, Login, Logout, ResetPassword, Signup, verifyEmail,GoogleAuth} from '../controllers/controller.js';
import { verifyToken } from '../middleware/verifyToken.js';


const router = express.Router();


router.post('/signup',Signup)
router.post('/login',Login)
router.post('/logout',Logout)
router.post('/verify-email',verifyEmail)
router.post('/forgot-password',ForgotPassword)
router.post('/reset-password/:token',ResetPassword)
router.post('/google', GoogleAuth) 
router.get('/check-auth',verifyToken,CheckAuth);


export default router