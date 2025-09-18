import { Feed, getAllFeeds, getNextFeedToFetch, markFeedFetched } from "./db/queries/feeds.js";
import { createPost, PostInsert } from "./db/queries/posts.js";
import { fetchFeed } from "./fetchFeed.js";

export async function scrapeFeed(target:Feed) {
    let count = 0;
    if (!target) throw Error('[FEEDS]: no feeds to fetch')
    await markFeedFetched(target);
    const feed = await fetchFeed(target.url);
    console.log('Collecting %s at %s', target.name, target.url)
    for (const item of feed.channel.item) {
        const pub = new Date(item.pubDate).toISOString()
        const post:PostInsert = {
            title: item.title,
            url:item.link,
            description:item.description,
            published_at: pub,
            feed_id: target.id
        }
        const record = await createPost(post)
        if(record) {
            count++
        }
    }

    console.log('Collected %d new posts form %s', count, target.name)
}

/**
 * @param limit Concurency limit, default = 4
 */
export async function scrapeFeeds(limit = 4) {
    const feeds = (await getAllFeeds(false)).map((feed) => () => scrapeFeed(feed as Feed))
    if (feeds.length < 1) {
        throw Error('[FEEDS]: no feeds to fetch')
    }
    await promisePool(feeds, limit)
}

export async function promisePool(tasks:(() => Promise<any>)[], limit:number) {
    let i = 0;
    const limitedPromises = Array(limit).fill(0).map(() => callback());
    await Promise.all(limitedPromises)
    
    async function callback() {
        if (i === tasks.length) {
            return;
        }
        try {
            await tasks[i++]();
        } catch (error) {
            let msg = '[FETCHING]: '
            console.log(msg, `${error instanceof Error ? error.message : 'unknown error'}`)
        } finally {
            callback();
        }
    }
}

/**
 * @param url of fetch target
 * @param options fetch options object
 * @param delay base delay before retry, in ms
 * @param retries number of retries before failure
 */
export async function fetchRetry(url:string, options = {} as RequestInit, delay:number, retries:number) {
    let throwed;
    for (let i = 0; i < retries; i++) {
        try {
            console.log('[FETCHING]: %s', url)
            return await fetch(url, options)
        } catch (error) {
            if(error instanceof Error) {
                if (i < retries) {
                    console.log('[FETCHING]: %s failed, attempting to retry', url)
                    await new Promise((resolve) => setTimeout(resolve, delay))
                    delay + 100
                } else {
                    throwed = new Error(`[FETCHING]: FAILED to fetch ${url} in ${retries} retries`)
                }
            }
        }
    }
    throw throwed
}
