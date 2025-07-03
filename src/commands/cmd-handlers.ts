import { readConfig, setUser } from "../config";
import { createUser, getUser, dropUsers, getUsers } from "../lib/db/queries/users";


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

export async function handleReset(cmd:string, ...args:string[]) {
    try {
        const res = await dropUsers()
        console.log('Drop was ' + `${res ? 'successfull' : 'unsuccessfull'}`)
    } catch (error) {
        throw error
    }
}

export async function handleUsers(cmd:string, ...args:string[]) {
    const current = readConfig().currentUserName
    try {
        const res = (await getUsers()).map(user => user.name)
        for (const user of res) {
            const fl = user === current
            console.log(user + `${fl ? ' (current)' : ''}`)
        }
    } catch (err) {
        throw err
    }
}
