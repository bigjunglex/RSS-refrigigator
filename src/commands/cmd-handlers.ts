import { readConfig, setUser } from "../config";
import { createUser, getUser, dropUsers, getUsers } from "../lib/db/queries/users";
import { createFeed, getAllFeeds, createFeedFollow, getFeedByURL } from "src/lib/db/queries/feed";
import { fetchFeed } from "src/lib/fetchFeed";
import { parseTime, printFeed } from "./cmd-helpers";
import { deleteFollow, getFeedFollowsForUser } from "src/lib/db/queries/follows";


/**
 * change current user in .gator.config.json to registred user 
 */
export async function hadleLogin(cmd:string, ...args: string[]) {
    if (args.length < 1) throw Error('[LOGIN]: expected argument username');
    const username = args.join('').replace(/\s/g, '');

    const check = await getUser(username);
    if (!check) throw Error('[LOGIN]: user dosent exist');
    
    setUser(username)

    console.log('[CONFIG]: user has been set to %s', username);
}
/**
 * register user 
 */
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
/**
 * reset db // dev fn 
 */
export async function handleReset(cmd:string, ...args:string[]) {
    try {
        const res = await dropUsers()
        console.log('Drop was ' + `${res ? 'successfull' : 'unsuccessfull'}`)
    } catch (error) {
        throw error
    }
}


/**
 * print all users
 */
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

/**
 * fetch feed 
 */
export async function handleAgg(cmd:string, ...args:string[]) {
    const input = args.join('');
    const [timeMS, msg] = parseTime(input)

    console.log(msg)
}

/**
 * current user adds feed and follows 
 */
export async function handleAddFeed(cmd:string, ...args:string[]) {
    const [name, url] = args.slice(0,2);
    const [feed, user] = await createFeed(name, url);
    const follow = await createFeedFollow(user, feed)
    
    printFeed(feed, user, follow);
}

/**
 * print all feeds 
 */
export async function handleFeeds(cmd:string, ...args:string[]) {
    const feeds = await getAllFeeds()
    console.log(feeds)
}

/**
 * current user follows feed 
 */
export async function handleFollow(cmd:string, ...args:string[]) {
    const url = args[0]
    const user = await getUser(readConfig().currentUserName);
    const feed = await getFeedByURL(url)
    await createFeedFollow(user, feed);

    console.log(`${user} followed ${feed.name}`)
}

/**
 * print all feeds current user follows
 */
export async function handleFollowing(cmd:string, ...args:string[]) {
    const user = readConfig().currentUserName
    const feeds = (await getFeedFollowsForUser(user)).map(x => x.name)

    console.log(`${user} follows:`)
    for (const feed of feeds) {
        console.log(`---- ${feed}`)
    }
}

/**
 * current user unfollows feed that matches url if there is one 
 */
export async function handleUnfollow(cmd:string, ...args:string[]) {
    const url = args[0]
    const user = await getUser(readConfig().currentUserName)
    const feed = await getFeedByURL(url)
    if(!feed) {
        console.log(`Feed with ${url} not found`)
        return;
    }
    const result = await deleteFollow(user, feed)
    
    console.log(`current user(${user.name}) unfollowed ${feed.name} --- ${feed.url}`)
    console.log(result)
}