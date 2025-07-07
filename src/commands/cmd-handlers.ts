import { readConfig, setUser } from "../config";
import { createUser, getUser, dropUsers, getUsers } from "../lib/db/queries/users";
import { createFeed, getFeeds } from "src/lib/db/queries/feed";
import { fetchFeed } from "src/lib/fetchFeed";
import { printFeed } from "./cmd-helpers";

export async function hadleLogin(cmd:string, ...args: string[]) {
    if (args.length < 1) throw Error('[LOGIN]: expected argument username');
    const username = args.join('').replace(/\s/g, '');

    const check = await getUser(username);
    if (!check) throw Error('[LOGIN]: user dosent exist');
    
    setUser(username)

    console.log('[CONFIG]: user has been set to %s', username);
}

export async function handleRegister(cmd:string, ...args:string[]) {
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


export async function handleAgg(cmd:string, ...args:string[]) {
    // const url = args[0]
    const url = 'https://www.wagslane.dev/index.xml';
    const res = await fetchFeed(url);
    
    console.log(res)
}

export async function handleAddFeed(cmd:string, ...args:string[]) {
    const [name, url] = args.slice(0,2);
    const [feed, user] = await createFeed(name, url);
    printFeed(feed, user);
}

