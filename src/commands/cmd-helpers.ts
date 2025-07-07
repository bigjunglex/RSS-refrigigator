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
 * @param CommandHandler
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