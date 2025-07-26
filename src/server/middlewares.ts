import type { Request, Response, NextFunction } from "express";
import express from "express"
import helmet from "helmet"
import cookieParser from "cookie-parser"

export const middleWares = [
    express.json(),
    helmet(),
    cookieParser()
]

export function errorCatcher(err:any, req:Request, res:Response, next: NextFunction) {
    if (err instanceof Error) {
        const [msg, stack] = [err.message, err.stack]
        console.log('[ERROR]: %s\n%s', msg, stack)     
        res.status(500).end(msg)
    }
}