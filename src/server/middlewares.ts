import type { Request, Response, NextFunction } from "express";
import express from "express"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { validateJWT } from "./auth";
import { getRefreshToken } from "src/lib/db/queries/refreshTokens";
import { getUserByID } from "src/lib/db/queries/users";


type ExtendedReq = Request & { history: string }


export const middleWares = [
    express.json(),
    helmet(),
    cookieParser()
]

export function errorCatcher(err:any, req:Request, res:Response, next: NextFunction) {
    if (err instanceof Error) {
        const [msg, stack] = [err.message, err.stack]
        console.log('[ERROR]: %s\n%s', msg, stack)     
        res.status(500).json({ error: msg })
    }
}


export async function authMiddleware(req:Request, res:Response, next: NextFunction) {
    const { accToken, refToken } = req.cookies
    try {
        if(!accToken) {
            const refresh = await getRefreshToken(refToken)
            if (!refresh) throw new Error('[AUTH]: Refresh and Access tokens expired');
            const { method, url } = req           
            
            res.redirect(307 ,`/api/refresh?target=${url}&method=${method}`)
        } else {
            const userId = validateJWT(accToken, String(process.env.SECRET)) as string
            res.locals.user = await getUserByID(userId);
            
            next()
        }
    } catch (error) {
        next(error)
    }
}