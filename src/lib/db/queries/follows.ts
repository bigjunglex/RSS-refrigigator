import { db } from "../db";
import { eq } from "drizzle-orm";
import { users, feeds, feed_follows } from "../schema";
import { getUser } from "./users";

export type Follow = typeof feed_follows.$inferInsert;

export async function getFeedFollowsForUser(userName: string) {
    const userId = (await getUser(userName)).id
    const result = await db
        .select({name:feeds.name})
        .from(feed_follows)
        .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
        .where(eq(feed_follows.user_id, userId))
    
    return result 
}