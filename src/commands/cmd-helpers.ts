import type { Feed } from "src/lib/db/queries/feeds";
import { getUser, type User } from "src/lib/db/queries/users";
import type { Follow } from "src/lib/db/queries/follows";
import type { CommandHandler } from "./commands";
import { readConfig } from "src/config";
import { getAllPosts, Post } from "src/lib/db/queries/posts";
import * as readline from "node:readline"
import { stdin as input, stdout as output } from "node:process";

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


export function printPosts(posts: Post[]): void {
    for (const post of posts) {
        const date = new Date(String(post.published_at)).toDateString()
        console.log('\n-------------------------------')
        console.log('📌 %s \n', post.title)
        console.log('📅 Published: %s\n', date)
        console.log('🌐 %s\n', post.url)
        console.log('📝 : %s', post.description)
        console.log('\n🌟: ---- %s ----', post.id)
        console.log('\n-------------------------------')
    }
}


export async function getCurrentUser():Promise<User> {
    const result = await getUser(readConfig().currentUserName)
    return result
}

/**

 *  @return String For forward / backward to for offset direction 
 */
export async function browseNav(): Promise<string> {
    console.log('(prev) Q | E (next)')
    return new Promise((resolve) => {
        readline.emitKeypressEvents(input)
        if (input.isTTY) input.setRawMode(true)
        input.on('keypress', (_, key:readline.Key) => {
            if (key.name === 'e') {
                input.removeAllListeners("keypress")
                resolve('forward')
            } else if (key.name === 'q') {
                input.removeAllListeners("keypress")
                resolve('backward')
            } else if (key.name === 'c') {
                console.log('Exit browse')
                process.exit(0)
            }
        })
    })
}

/**
 * clear terminal without wiping its history
 */
export function clearTerminal() {
    const space = '\n'.repeat(output.rows)
    console.log(space)
    readline.cursorTo(output, 0, 0)
    readline.clearScreenDown(output)
}

export async function getLimitByTerminalStats() {
    const postsArr = await getAllPosts()
    const descAvg = Math.floor(postsArr.reduce((acc, p) => acc += p.description?.length || 0, 0) / postsArr.length)
    let [rows, cols] = [output.rows, output.columns]
    const avgPrintPostsRows = 12 + Math.ceil(descAvg / cols) 
    const limit = Math.floor(rows / avgPrintPostsRows)

    return limit
}
