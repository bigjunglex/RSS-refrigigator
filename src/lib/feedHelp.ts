import { getNextFeedToFetch, markFeedFetched } from "./db/queries/feeds";
import { createPost, PostInsert } from "./db/queries/posts";
import { fetchFeed } from "./fetchFeed";

export async function scrapeFeeds() {
    let count = 0;
    const next = await getNextFeedToFetch();
    if (!next) throw Error('[FEEDS]: no feeds to fetch')
    await markFeedFetched(next);
    const feed = await fetchFeed(next.url);
    console.log('Collecting %s at %s', next.name, next.url)
    for (const item of feed.channel.item) {
        const pub = new Date(item.pubDate)
        const post:PostInsert = {
            title: item.title,
            url:item.link,
            description:item.description,
            published_at: pub,
            feed_id: next.id
        }
        const record = await createPost(post)
        if(record) {
            count++
        }
    }

    console.log('Collected %d new posts', count)
}