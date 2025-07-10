import type { Feed } from "src/lib/db/queries/feed";
import { getUser, type User } from "src/lib/db/queries/users";
import type { Follow } from "src/lib/db/queries/follows";
import type { CommandHandler } from "./commands";
import { readConfig } from "src/config";



export function printFeed(feed:Feed, user: User, follow: Follow | undefined):void {
    const a = `\nAdded feed: \n--${feed.name} : ${feed.url} `;
    const b = `\nUser: \n--name: ${user.name} \n--id: ${user.id}`;
    const c = `\nFollow: \n--id: ${follow?.id} \n--TOC:${follow?.createdAt}`
    console.log(a, b, c)
}

/**
 * Middleware checks if there is user in config and its registered in db
 * @param CommandHandler handler that requires logged user
 * @returns CommandHandler
 */
export function isLogged(handler:CommandHandler):CommandHandler {
    return async (cmd:string, ...args:string[]) => {
        const name = readConfig().currentUserName
        if(!name) throw new Error('[CONFIG]: no user currently logged in');
        const user = await getUser(name);
        if(!user) throw new Error(`[USERS]: no user with name: ${name}`);

        return handler(cmd, ...args)
    }
}
/**
 * time units for parsing
 */
class TimeOptions {
    static ms = 1;
    static s = 1000;
    static m = 60 * this.s;
    static h = 60 * this.m;
}

type TimeOption = 'ms' | 's' | 'm' | 'h'

/**
 * @duration time in 123 ms | 333h format
 */
export function parseTime(duration:string):[number, string] {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = duration.match(regex);

    if(!match || match.length < 3) {
        throw new Error(`[AGG]: input should be number ms|s|m|h, current: ${duration}`)
    }
    
    const [_, num, option] = match
    if(!['ms','s', 'm', 'h'].includes(option)) {
        throw new Error(`[AGG]: input should be number ms|s|m|h, current: ${duration}`)
    }
    
    const msg = `Collecting feeds every ${num}${option}`
    const interval = parseInt(num) * TimeOptions[option as TimeOption]

    return [interval, msg]
}