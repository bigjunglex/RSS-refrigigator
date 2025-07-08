import { desc, eq } from "drizzle-orm";
import { readConfig } from "src/config";
import { db } from "../db";
import { users, feeds, feed_follows } from "../schema";
import { type User } from "./users";
import { date } from "drizzle-orm/mysql-core";

export type Feed = typeof feeds.$inferSelect;
export type FeedTuple = [Feed, User]

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

export async function getAllFeeds(formatNames:boolean = true) {
    let result;
    if (formatNames) {
        result = await db.select({
            name: feeds.name,
            url: feeds.url,
            user: users.name
        }).from(feeds).leftJoin(users, eq(users.id, feeds.user_id))
    } else {
        result = await db.select().from(feeds)
    }

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


export async function markFeedFetched(feed:Feed) {
    const [update] = await db
        .update(feeds)
        .set({last_fetched_at: new Date()})
        .where(eq(feeds.id, feed.id))
        .returning()
    return update
}


export async function getNextFeedToFetch() {
    const [feed] = await db
        .select()
        .from(feeds)
        .orderBy(desc(feeds.last_fetched_at))
    return feed
}