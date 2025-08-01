import { readConfig, setUser } from "../../config";
import { createUser, getUser, dropUsers, getUsers } from "../../lib/db/queries/users";
import { createFeed, getAllFeeds, createFeedFollow, getFeedByURL } from "src/lib/db/queries/feeds";
import { browseNav, clearTerminal, createResizeController, getCurrentUser, getLimitByTerminalStats, parseTime, printFeed, printPosts } from "./cmd-helpers";
import { deleteFollow, getFeedFollowsForUser } from "src/lib/db/queries/follows";
import { scrapeFeeds } from "src/lib/feedHelp";
import {getPostByID, getPostsForUser } from "src/lib/db/queries/posts";
import { createFavorite, deleteFavorite, getFavoritePostsForUser } from "src/lib/db/queries/favorites";
import { hashPassword } from "src/server/auth";
import { formatUserRegResponse } from "src/server/helpers";



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
 * register user "NAME" : "PASSWORD"
 */
export async function handleRegister(cmd:string, ...args:string[]) {
    if (args.length < 1) throw Error('[REGISTER]: expected argument username');
    if (args.length > 2) throw Error('[REGISTER]: expected "USERNAME" "PASSWORD" format for arguments');

    const [username, password] = [args[0], args[1]]
    const hashed = await hashPassword(password);
    const check = await getUser(username);

    if (check) throw Error('[REGISTER]: user already registred');
    
    const result = await createUser(username, hashed);
    setUser(username)

    console.log(`[REGISTER]: %s was registred`, username)
    console.log(formatUserRegResponse(result))
}
/**
 * drop users table   
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
 * Get interval from input and fetch feeds concurently
 *  on interval
 */
export async function handleAgg(cmd: string, ...args: string[]) {
    const input = args.join('');
    const [timeMS, msg] = parseTime(input)

    scrapeFeeds().catch(handleError)
    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError)
    }, timeMS);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Closing rssgator...");
            clearInterval(interval);
            resolve();
        });
    });
}

/**
 * current user adds feed and follows 
 */
export async function handleAddFeed(cmd: string, ...args: string[]) {
    const [name, url] = args.slice(0, 2);
    const [feed, user] = await createFeed(name, url);
    const follow = await createFeedFollow(user, feed)

    printFeed(feed, user, follow);
}

/**
 * print all feeds 
 */
export async function handleFeeds(cmd:string, ...args:string[]) {
    const feeds = await getAllFeeds()
    console.log(`${feeds.length > 0 ? '' : 'No added feeds yet'}`)
    for (const feed of feeds) {
        console.log('%s --> %s ---> %s', feed.name, feed.url, feed.id)
    }
}

/**
 * current user follows feed 
 */
export async function handleFollow(cmd:string, ...args:string[]) {
    const url = args[0]
    const user = await getCurrentUser()
    const feed = await getFeedByURL(url)
    await createFeedFollow(user, feed);

    console.log(`${user} followed ${feed.name}`)
}

/**
 * print all feeds current user follows
 */
export async function handleFollowing(cmd:string, ...args:string[]) {
    const user = (await getCurrentUser()).name
    const feeds = (await getFeedFollowsForUser(user)).map(entry => entry.feeds)

    console.log(`${user} follows:`)
    for (const feed of feeds) {
        console.log(`---- ${feed.name} : ${feed.url} --- ${feed.id}`)
    }
}

/**
 * current user unfollows feed that matches url if there is one 
 */
export async function handleUnfollow(cmd:string, ...args:string[]) {
    const url = args[0]
    const user = await getCurrentUser()
    const feed = await getFeedByURL(url)
    if(!feed) {
        console.log(`Feed with ${url} not found`)
        return;
    }
    const result = await deleteFollow(user, feed)
    
    console.log(`current user(${user.name}) unfollowed ${feed.name} --- ${feed.url}`)
    console.log(result)
}


/**
 * @param reason Error  
 */
export async function handleError(reason:any) {
    if(reason instanceof Error) {
        console.error(reason.message)
        console.error(reason.stack)
    }
    return null
}

/**
 * Browse posts from followed feeds of current user
 * Calculates number o
 * limit is also the offset step value
 */
export async function handleBrowse(cmd:string, ...args:string[]) {
    const user = await getCurrentUser()
    const resizeController = await createResizeController()
    
    let offset = 0
    clearTerminal()
    
    while(true) {
        const limit = resizeController.limit()
        const posts = await getPostsForUser(user, limit, offset);
        printPosts(posts)
        const move = await browseNav(resizeController.constroller)
        clearTerminal()
        offset = move === 'forward' ? offset + limit : offset - limit;
        if ( offset < 0 ) offset = 0;
    }
}

/**
 * Searches user's posts for match with query
 * Case insensitive, strict matching
 * TODO: IMPLEMENT SEARCH THROUGH ARRAY WITH SCORE MAP FOR RESULTS
 * TODO: CHANGE hardcoded limit for flag Date
 */
export async function handleSearch(cmd:string, ...args:string[]) {
    if(args.length < 1) {
        console.log('[SEARCH]: need to specify search query')
        return;
    }
    const query = (args.length > 1 ? args.join(' ') : args[0]).toLowerCase()
    const user = await getCurrentUser()
    const posts = await getPostsForUser(user, 1000);
    const filtered = posts.filter(p => {
        for (const key in p) {
            const val = (p as Record<string, any>)[key]
            if (typeof val === 'string' && val.toLowerCase().includes(query)) {
                return true
            }
        }
        return false
    })
    if (filtered.length < 1) {
        console.log('[SEARCH]: no items that match |%s| was found', query)
        return;
    }
    printPosts(filtered)
}

/**
 * Print all favorite posts for current user 
 */
export async function handleFavorites(cmd:string, ...args:string[]) {
    const user = await getCurrentUser()
    const controller = await createResizeController()
    let offset = 0
    clearTerminal()
    while(true) {
        const limit = controller.limit()    
        const posts = await getFavoritePostsForUser(user, limit, offset);
        if(posts.length < 1 && offset === 0 ) {
            console.log('[FAVORITES]: no post add to favorites yet')
            return;
        }
        
        if (posts.length < 1) {
            
            offset = offset - limit
            clearTerminal()

        } else {
            printPosts(posts)
            const move = await browseNav(controller.constroller)
            clearTerminal()
            offset = move === 'forward' ? offset + limit : offset - limit;
            if ( offset < 0 ) offset = 0;
        }
    }
}

/**
 * Adds post by provided ID to favorites for current user 
 */
export async function handleAddFavorites(cmd:string, ...args:string[]) {
    if (args.length < 1) {
        console.log('[FAVORITES]: provide Post ID to add in favorites')
        return;
    }
    const id = args[0]
    const post = await getPostByID(id)
    const user = await getCurrentUser()

    const record = await createFavorite(user, post)
    if(record) {
        console.log(`Added " ${post.title} " to favorites for ${user.name}`)
        console.log(record)
    }else{
        console.log('[FAVORITES]: coudn\'t find post with %s: id', id)
    } 
}


export async function handleRemoveFavorites(cmd:string, ...args:string[]) {
    if (args.length < 1) {
        console.log('[FAVORITES]: provide Post ID to add in favorites')
        return;
    }
    const id = args[0]
    const post = await getPostByID(id)
    const user = await getCurrentUser()
    
    const record = await deleteFavorite(user, post)
    if(record) {
        console.log(`Deleted " ${post.title} " from favorites for ${user.name}`)
        console.log(record)
    }else{
        console.log('[FAVORITES]: coudn\'t find favorite post with %s: id', id)
    } 
}