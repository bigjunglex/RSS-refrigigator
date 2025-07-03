import { setUser } from "../config";
import { createUser, getUser } from "../lib/db/queries/users";


export async function hadlerLogin(cmd:string, ...args: string[]) {
    if (args.length < 1) throw Error('[LOGIN]: expected argument username');
    const username = args.join('').replace(/\s/g, '');

    const check = await getUser(username);
    if (!check) throw Error('[LOGIN]: user dosent exist');
    
    setUser(username)
    
    console.log('[CONFIG]: user has been set to %s', username);
}

export async function handlerRegister(cmd:string, ...args:string[]) {
    if (args.length < 1) throw Error('[REGISTER]: expected argument username');

    const username = args.join('').replace(/\s/g, '');
    const check = await getUser(username);

    if (check) throw Error('[REGISTER]: user already registred');
    
    const result = await createUser(username);
    setUser(username)

    console.log(`[REGISTER]: %s was registred`, username)
    console.log(result)
}


