import { and, eq, sql, desc } from "drizzle-orm";
import { db } from "../db.js";
import { users, feeds, feed_follows } from "../schema.js";
import { type User } from "./users.js";


export type Feed = typeof feeds.$inferSelect;
export type FeedTuple = [Feed, User]
export type FeedFormated = {name:string; url:string; user:string | null;}

export async function createFeed(name:string, url: string, user:User):Promise<Feed> {
    const [result] = await db
        .insert(feeds)
        .values({name: name, url: url, user_id: String(user.id)})
        .onConflictDoNothing()
        .returning();
    return result
}

export async function getFeedByURL(url:string):Promise<Feed> {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url))
    return result
} 
/**
 * @returns  Feed[] if formatNames false,
 * and  {name, url, userName}[] if true(by default)
 */
export async function getAllFeeds(formatNames = false) {;
    if (formatNames) {
        const result = await db.select({
            name: feeds.name,
            url: feeds.url,
            id: feeds.id,
            user: users.name
        }).from(feeds).leftJoin(users, eq(users.id, feeds.user_id)) 
        return result
    } else {
        const result = await db.select().from(feeds)
        return result
    }
}


export async function getAllWithUserFeeds(user:User) {
    const result = await db 
        .select({
            id: feeds.id,
            url: feeds.url,
            name: feeds.name,
            createdAt: feeds.createdAt,
            last_fetched_at: feeds.last_fetched_at,
            isFollowed: feed_follows.user_id
        })
        .from(feeds)
        .leftJoin(
            feed_follows,
            and(
                eq(feed_follows.feed_id, feeds.id),
                eq(feed_follows.user_id, String(user.id))
            )
        )
        .orderBy(desc(feeds.createdAt));
    return result
} 


export async function createFeedFollow(user:User, feed:Feed) {
    const [newFollow] = await db
        .insert(feed_follows)
        .values({ feed_id: feed.id, user_id: String(user.id) })
        .onConflictDoNothing()
        .returning();
    return newFollow
}


export async function markFeedFetched(feed:Feed):Promise<Feed> {
    const [update] = await db
        .update(feeds)
        .set({last_fetched_at: new Date().toISOString()})
        .where(eq(feeds.id, feed.id))
        .returning()
    return update 
}


export async function getNextFeedToFetch(limit = 1) {
    const [feed] = await db
        .select()
        .from(feeds)
        .orderBy(sql`${feeds.last_fetched_at} ASC NULLS FIRST`)
        .limit(limit)
    return feed
}

export async function getFeedById(id:string) {
    const [result] = await db
        .select()
        .from(feeds)
        .where(eq(feeds.id, id))
    return result
}
