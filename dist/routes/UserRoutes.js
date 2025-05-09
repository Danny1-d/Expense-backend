import express from 'express';
const userRouter = express.Router();
import { AuthMiddleware } from '../middleware/Authmiddleware.js';
import { getUserById } from '../controllers/UserController.js';
userRouter.get('/data', AuthMiddleware, getUserById);
export default userRouter;
