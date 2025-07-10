import { getNextFeedToFetch, markFeedFetched } from "./db/queries/feed";
import { fetchFeed } from "./fetchFeed";

export async function scrapeFeeds() {
    const next = await getNextFeedToFetch();
    if (!next) throw Error('[FEEDS]: no feeds to fetch')
    await markFeedFetched(next);
    const feed = await fetchFeed(next.url);
    console.log('%s -- at -- %s', next.name, next.url)
    for (const item of feed.channel.item) {
        console.log(item.title)
    }

}