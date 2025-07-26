import bcrypt from "bcrypt"
import crypto from "node:crypto"
import jwt, { type JwtPayload } from "jsonwebtoken"
import type { Request } from "express"

export type Payload = Pick<JwtPayload , 'iss' | 'sub' | 'iat' | 'exp'>

export async function hashPassword(password:string) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

export async function validatePassword(password:string, hash:string) {
    const check = await bcrypt.compare(password, hash)
    return check
}

export function makeJWT(userId:string, expiresIn: number, secret: string) {
    const iat = Math.floor(Date.now() / 1000)
    const payload:Payload = {
        iss: "rss-refrigator",
        sub: userId,
        iat: iat,
        exp: iat + expiresIn
    }
    const token = jwt.sign(payload, secret)
    return token
}

export function validateJWT(token:string, secret:string) {
    try {
        const payload = jwt.verify(token, secret) as Payload
        const userId = payload.sub
        return userId 
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`[AUTH]:[JWT] ${error.message}`)
        }
    }
}

export function getBearerToken(req:Request):string {
    try {
        const token = req.headers['authorization']
        if(!token && !token?.startsWith('Bearer ')) {
            throw new Error()
        }
        return token.substring(7)
    } catch (error) {
        throw new Error('[AUTH]: Invalid Auth Token')
    }
}

export function makeRefreshToklen() {
    return crypto.randomBytes(32).toString('hex')
}