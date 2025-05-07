import express from 'express';
const userRouter = express.Router();
import { AuthMiddleware } from '../middleware/Authmiddleware.ts';
import { getUserById } from '../controllers/UserController.ts';

userRouter.get('/data', AuthMiddleware, getUserById)

export default userRouter;