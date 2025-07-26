import { Router } from "express";
import { refreshJwt, regNewUser, updateUser, userLogIn, userLogOut } from "../controllers/authController";


export const authRouter = Router();

authRouter.post('/api/users', regNewUser)
authRouter.put('/api/users', updateUser)
authRouter.post('/api/login', userLogIn)
authRouter.post('/api/refresh', refreshJwt)
authRouter.post('/api/revoke', userLogOut)