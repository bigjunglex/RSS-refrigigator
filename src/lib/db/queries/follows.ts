import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { users, feeds, feed_follows } from "../schema";
import { getUser, User } from "./users";
import { Feed } from "./feed";

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

export async function deleteFollow(user:User, feed:Feed) {
    const [user_id, feed_id] = [user.id, feed.id] as string[];
    const [result] = await db
        .delete(feed_follows)
        .where(
            and(
                eq(feed_follows.feed_id, feed_id),
                eq(feed_follows.user_id, user_id)
            )
        )
        .returning()
    return result
}