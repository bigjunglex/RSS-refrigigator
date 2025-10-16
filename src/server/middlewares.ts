import type { Request, Response, NextFunction } from "express";
import express from "express"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { validateJWT } from "./auth.js";
import { getRefreshToken } from "../lib/db/queries/refreshTokens.js";
import { getUserByID, UserSelect } from "../lib/db/queries/users.js";
import { BaseError, ERR_MESSAGES, ERRORS } from "./errors.js";
import logger from './logger.js'

export const middleWares = [
    express.json(),
    helmet(),
    cookieParser(),
]

export function errorCatcher(err:BaseError, req:Request, res:Response, next: NextFunction) {
    const stack = err.stack
    let msg, code;
    if(ERRORS.find(error => err instanceof error)) {
        [msg, code] = ERR_MESSAGES[err.errKey];
        if (err.message.length > 1) msg = err.message;
    } else {
        [msg, code] = ERR_MESSAGES.internal;
    }
    logger.error(`[ERROR]: ${JSON.stringify(msg)}\n ${JSON.stringify(stack)}`)

    res.status(code).json(msg)

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
            res.locals.user = await getUserByID(userId) as UserSelect;
            logger.info(`[AUTH]: success, user: ${JSON.stringify(res.locals.user)}`)
            next()
        }
    } catch (error) {
        next(error)
    }
}