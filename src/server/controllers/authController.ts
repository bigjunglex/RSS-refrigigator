import type { Request, Response, NextFunction } from "express";
import { createUser, getUser } from "src/lib/db/queries/users";
import { hashPassword } from "../auth";
import { formatUserRegResponse } from "../helpers";


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

export function userLogIn() {

}

export function userLogOut() {

}

export function updateUser() {

}

export function refreshJwt() {

}
