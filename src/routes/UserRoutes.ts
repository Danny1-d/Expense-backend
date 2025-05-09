import express from 'express';
const userRouter = express.Router();
import { AuthMiddleware } from '../middleware/Authmiddleware';
import { getUserById } from '../controllers/UserController';

userRouter.get('/data', AuthMiddleware, getUserById)

export default userRouter;