import { eq, sql } from "drizzle-orm";
import { readConfig } from "src/config";
import { db } from "../db";
import { users, feeds, feed_follows } from "../schema";
import { type User } from "./users";


export type Feed = typeof feeds.$inferSelect;
export type FeedTuple = [Feed, User]
export type FeedFormated = {name:string; url:string; user:string | null;}

export async function createFeed(name:string, url: string):Promise<FeedTuple> {
    const user = readConfig().currentUserName;
    const [user_rec] = await db.select().from(users).where(eq(users.name, user));
    const [result] = await db.insert(feeds).values({name: name, url: url, user_id: user_rec.id}).returning();
    
    return [result, user_rec]
}

export async function getFeedByURL(url:string):Promise<Feed> {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url))
    return result
} 
/**
 * @returns  Feed[] if formatNames false,
 * and  {name, url, userName}[] if true(by default)
 */
export async function getAllFeeds(formatNames:boolean = true) {;
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


