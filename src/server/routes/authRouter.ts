import { Router } from "express";
import { refreshJwt, regNewUser, updateUser, userLogIn, userLogOut, userCheck } from "../controllers/authController.js";


export const authRouter = Router();

authRouter.post('/api/users', regNewUser)
authRouter.put('/api/users', updateUser)
authRouter.post('/api/login', userLogIn)
authRouter.get('/api/refresh', refreshJwt)
authRouter.post('/api/logout', userLogOut)
authRouter.get('/api/check', userCheck)