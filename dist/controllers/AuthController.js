var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import db from "../db/index.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { Resend } from 'resend';
// import transporter from "../config/NodeMailer.ts";
const saltRounds = 10;
const resend = new Resend('re_4dqX7hwd_8czpQ6G6zHWa1ADYW676AXgh');
export const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("BODY RECEIVED:", req.body);
    if (!req.body) {
        res.status(400).json({ message: "Request body is missing" });
    }
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const checkResult = yield db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (checkResult.rows.length > 0) {
            res.status(400).json("User already exists");
        }
        else {
            //password hashing
            bcrypt.hash(password, saltRounds, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    res.status(500).send("Internal server error");
                }
                else {
                    const result = yield db.query("INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4) RETURNING *", [firstName, lastName, email, hash]);
                    const newUser = result.rows[0]; // Extract the newly inserted user from the result
                    const token = Jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
                    res.cookie("token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
                        sameSite: process.env.NODE_ENV === "production" ? 'none' : "strict", // Adjust as needed
                        maxAge: 3600000, // 1 hour in milliseconds
                    });
                    //sending welcome email
                    // const mailOption = {
                    //   from: process.env.SENDER_EMAIL,
                    //   to: email,
                    //   subject: 'Welcome to Danny website',
                    //   text: `Hello ${firstName},\n\nWelcome to Danny! We're glad to have you on board.\n\nBest regards,\nThe Danny Team`
                    // }
                    // try {
                    //   await transporter.sendMail(mailOption);
                    //   console.log("Email sent successfully.");
                    // } catch (err) {
                    //   console.error("Error sending email:", err);
                    // }
                    // Sending email using Resend API
                    try {
                        const mail = yield resend.emails.send({
                            from: 'onboarding@resend.dev',
                            to: 'danielobjuru01@gmail.com',
                            subject: 'Hello World',
                            html: `Hello ${firstName},\n\nWelcome to Danny! We're glad to have you on board.\n\nBest regards,\nThe Danny Team`
                        });
                        console.log("Email sent successfully.");
                        console.log(mail);
                    }
                    catch (err) {
                        console.error("Error sending email:", err);
                    }
                    // Send back the created user's data (e.g., first name, last name, email)
                    res.status(201).json({
                        success: true,
                        message: 'User registered successfully',
                        user: {
                            firstName: newUser.firstName,
                            lastName: newUser.lastName,
                            email: newUser.email,
                            id: newUser.id, // Include any other fields you want to send back
                        },
                    });
                    // Optionally, you can also send a success message without user data
                    // res.status(200).json({ message: 'User registered' });
                }
            }));
        }
    }
    catch (err) {
        res.status(500).json("Internal server error");
    }
});
export const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("BODY RECEIVED:", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "These Missing required fields" });
    }
    try {
        const result = yield db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (!result.rows.length) {
            res.status(400).json({ message: "User not found" });
        }
        if (result.rows.length > 0) {
            const user = result.rows[0];
            console.log("user", user.id);
            const storedPassword = user.password;
            bcrypt.compare(password, storedPassword, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log("Error comparing password:", err);
                }
                else {
                    if (result) {
                        const newUser = user.id; // Assuming you have an 'id' field in your user table
                        const token = Jwt.sign({ id: newUser }, process.env.JWT_SECRET, { expiresIn: "1h" });
                        res.cookie("token", token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
                            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Adjust as needed
                            maxAge: 7 * 24 * 60 * 60 * 1000,
                        });
                        res.status(200).json({ success: true, message: "success" });
                    }
                    else {
                        res.status(400).json({ error: "Incorrect Password" });
                        console.log("Incorrect Password");
                    }
                }
            }));
        }
    }
    catch (err) {
        res.status(400).json({ error: err });
        console.log(err);
    }
});
export const LogOut = (req, res) => {
    try {
        // Clear the cookie by setting its expiration date to a time in the past
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
            sameSite: process.env.NODE_ENV === "production" ? 'none' : "strict", // Adjust as needed
            // expires: new Date(0),  // Set expiration date to the past
        });
        res.status(200).json({ message: "Logout successful" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
// send OTP to user email
export const sendVerifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const result = yield db.query("SELECT * FROM users WHERE id = $1", [userId]);
        const user = result.rows[0];
        if (user.isaccountverified) {
            res.status(400).json({ message: "Account already verified" });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generate a 6-digit OTP
        const ExpireOtpDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Set expiration time to 7 days from now
        const unixTimestamp = Math.floor(ExpireOtpDate.getTime() / 1000);
        yield db.query("UPDATE users SET verifyOtp = $1, verifyOtpExpireAt = $2 WHERE id = $3", [otp, unixTimestamp, userId]);
        //sending OTP email
        yield resend.emails.send({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verify your email',
            html: `Hello ${user.firstName},\n\nYour OTP is ${otp}. It will expire in 10 minutes.\n\nBest regards,\nThe Danny Team`
        });
        res.status(200).json({ message: "OTP sent successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});
// verify the email using the otp
export const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        res.status(400).json({ message: "User ID and OTP are required" });
    }
    try {
        const result = yield db.query("SELECT * FROM users WHERE id = $1", [userId]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "User not found" });
        }
        const user = result.rows[0];
        if (user.verifyOtp !== otp || user.verifyOtp === '') {
            res.status(400).json({ message: "Invalid OTP" });
        }
        const currentTime = new Date();
        // Check if the OTP has expired
        if (currentTime > new Date(user.verifyOtpExpireAt)) {
            res.status(400).json({ message: "OTP expired" });
        }
        yield db.query("UPDATE users SET isAccountVerified = true, verifyOtp = NULL, verifyOtpExpireAt = NULL WHERE id = $1", [userId]);
        // res.status(200).json({ message: "Account verified successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
// if user is authenticated
export const isAuthenticated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: "User is authenticated" });
    }
    catch (err) {
        console.log(err);
    }
});
//send password reset email
export const sendResetOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: "Email is required" });
    }
    try {
        const result = yield db.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];
        if (!result.rows.length) {
            res.status(404).json({ message: "User not found" });
        }
        // const { userId } = req.body;
        const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generate a 6-digit OTP
        const ExpireOtpDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Set expiration time to 7 days from now
        const unixTimestamp = Math.floor(ExpireOtpDate.getTime() / 1000);
        // await db.query("INSERT INTO users (verifyOtp) VALUES ($1) RETURNING *", [otp]);
        // await db.query("INSERT INTO users (verifyOtpExpireAt) VALUES ($1) RETURNING *", [ExpireOtpDate]);
        yield db.query("UPDATE users SET resetOtp = $1, resetOtpExpiresAt = $2 WHERE email = $3", [otp, unixTimestamp, email]);
        //sending OTP email
        yield resend.emails.send({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            html: `Your OTP for resetting your password is ${otp}. It will expire in 10 minutes. Use this OTP to proceed with resetting your password.`
        });
        res.status(200).json({ message: "OTP sent successfully" });
    }
    catch (error) {
        console.error("Error sending password reset email:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// reset user password
export const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        res.status(400).json({ message: "Email, OTP, and new password are required" });
    }
    try {
        const result = yield db.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];
        if (!result.rows.length) {
            res.status(404).json({ message: "User not found" });
        }
        if (user.resetOtp !== otp || user.resetOtp === '') {
            res.status(400).json({ message: "Invalid OTP" });
        }
        const currentTime = new Date();
        // Check if the OTP has expired
        if (currentTime > new Date(user.resetOtpExpiresAt)) {
            res.status(400).json({ message: "OTP expired" });
        }
        // Hash the new password
        bcrypt.hash(newPassword, saltRounds, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error("Error hashing password:", err);
                res.status(500).json({ message: "Internal server error" });
            }
            yield db.query("UPDATE users SET password = $1, resetOtp = NULL, resetOtpExpiresAt = NULL WHERE email = $2", [hash, email]);
            // res.status(200).json({ message: "Password reset successfully" });
        }));
    }
    catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
