import express from "express";
const router = express.Router();

import { Register, Login, LogOut, sendVerifyOTP, verifyEmail, isAuthenticated, sendResetOTP, resetPassword } from "../controllers/AuthController.ts";
import { AuthMiddleware } from "../middleware/Authmiddleware.ts";

router.post('/signup', Register)
router.post('/signin', Login)
router.post('/logout', LogOut)
router.post('/sendverifyotp', AuthMiddleware, sendVerifyOTP)
router.post('/verifyaccount', AuthMiddleware, verifyEmail)
router.post('/isauth', AuthMiddleware, isAuthenticated)
router.post('/sendresetotp', sendResetOTP)
router.post('/resetpassword', resetPassword)



export default router;