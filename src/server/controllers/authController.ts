import type { Request, Response, NextFunction } from "express";
import { createUser, getUser, getUserByID, updateUserPasswordById, UserSelect } from "../../lib/db/queries/users";
import { hashPassword, makeJWT, makeRefreshToken, validateJWT, validatePassword } from "../auth";
import { formatUserRegResponse } from "../helpers";
import { getRefreshToken, newRefreshToken, revokeRefreshToken } from "../../lib/db/queries/refreshTokens";

const JWTexpires = process.env.JWT_EXP ? parseInt(process.env.JWT_EXP) : 3600
const REFexpires = process.env.REFRESH_EXP ? parseInt(process.env.REFRESH_EXP) : 60
const SECRET = String(process.env.SECRET)


export async function regNewUser(req:Request, res:Response, next:NextFunction) {
    const { name, password } = req.body
    try {
        const check = await getUser(name)
        if (check) throw Error('[REGISTER]: user already registred');
        const hashed = await hashPassword(password)
        const user = await createUser(name, hashed)
        if (user) {
            const info = formatUserRegResponse(user)
            res.status(200).json(info)
        }
    } catch (error) {
        next(error)
    }
}

export async function userLogIn(req:Request, res:Response, next:NextFunction) {
    const  { name, password } = req.body
    try {
        const user = await getUser(name)
        if(!user) throw new Error('[AUTH]: User Not Registred');
        const check = await validatePassword(password, user.hashedPassword)
        if(!check) throw new Error('[AUTH]: Invalid name / password ');
        
        const [token, expires] = makeRefreshToken(REFexpires)
        const accessToken = makeJWT(user.id, JWTexpires, SECRET)
        const refreshToken = (await newRefreshToken(token, user.id, expires)).token

        res.cookie('accToken', accessToken, { maxAge: JWTexpires * 1000, httpOnly: true })
        res.cookie('refToken', refreshToken, { maxAge: REFexpires * 24 * 60 * 60 * 1000, httpOnly: true })
        res.status(200).json(formatUserRegResponse(user))

    } catch (error) {
        next(error)
    }

}

export async function userLogOut(req:Request, res:Response, next: NextFunction) {
    const { accToken, refToken } = req.cookies
    try {
        if(!accToken && !refToken) throw new Error('[AUTH]: Invalid Login Tokens');
        validateJWT(accToken, SECRET)
        const revoked = await revokeRefreshToken(refToken)
        if (!revoked) throw new Error('[AUTH]: Invalid Refresh Token');
        
        res.clearCookie('accToken')
        res.clearCookie('refToken')
        res.status(200).end(revoked.revoked)

    } catch (error) {
        next(error)
    }
}

export async function updateUser(req:Request, res:Response, next:NextFunction) {
    const { accToken } = req.cookies
    const { password } = req.body
    try {
        if(!accToken) throw new Error('[AUTH]: Access Denied');
        if(!password) throw new Error('[AUTH]: Provide name / password for update');
        const userId = validateJWT(accToken, SECRET) as string
        const newHash = await hashPassword(password)

        const user = await updateUserPasswordById(userId, newHash)
        if(!user) throw new Error('[AUTH]: Invalid user');
        
        res.status(200).json(formatUserRegResponse(user))

    } catch (error) {
        next(error)
    }
}

export async function refreshJwt(req: Request, res: Response, next: NextFunction) {
    const { refToken } = req.cookies
    const { target, method } = req.query
    try {
        if(!refToken) throw new Error('[AUTH]: Refresh endpoint --> no RefToken')
        console.log('[REFRESH REQUEST] refToken:', refToken);
        const prevToken  = await getRefreshToken(refToken)
        if (!prevToken) throw new Error('[AUTH]: Invalid Refresh TOken');
        const { userId } = prevToken
        if (!userId) throw new Error('[AUTH]: Invalid Refresh TOken');
        const revoked = await revokeRefreshToken(refToken)
        const user = await getUserByID(userId)

        const [token, time] = makeRefreshToken(REFexpires)
        const accessToken = makeJWT(userId, JWTexpires, SECRET)
        const refreshToken = await newRefreshToken(token, userId, time)
        
        console.log('[REVOKED]: ', revoked)
        console.log('[REFRESH]: ', refreshToken)

        res.cookie('accToken', accessToken, { maxAge: JWTexpires * 1000, httpOnly: true })
        res.cookie('refToken', token, { maxAge: REFexpires * 24 * 60 * 60 * 1000, httpOnly: true })

        if (target && method) {
            res.redirect(method === "POST" ? 307 : 301 , String(target))
        } else {
            res.status(200).json({ name:user.name })
        }

    } catch (error) {
        next(error)
    }
}


export async function userCheck(req: Request, res: Response, next: NextFunction) {
    const { accToken, refToken } = req.cookies
    try {
        if (!accToken) {
            const refresh = await getRefreshToken(refToken)
            if (!refresh) throw new Error('');
            res.redirect(301, `/api/refresh`)
        }
        const userId = validateJWT(accToken, String(process.env.SECRET)) as string
        const user = await getUserByID(userId) as UserSelect;
        if(!user) {
            throw new Error('')
        }
        res.status(200).json({ name:user.name })
        
    } catch (error) {
        next(error)
    }
}