import { db } from "../db";
import { desc, eq, inArray } from "drizzle-orm";
import { feed_follows, posts} from "../schema";
import { getUser, User } from "./users";

export type Post = typeof posts.$inferInsert;
export type PostInsert = Omit<Post, "createdAt" | "updatedAt" | "id">;

export async function createPost(post:PostInsert):Promise<Post> {
    const [rec] = await db
        .insert(posts)
        .values({
            title:post.title,
            url: post.url,
            description: post.description || null,
            published_at: post.published_at || null,
            feed_id: post.feed_id
        })
        .onConflictDoNothing()
        .returning()
    return rec
}


export async function getPostsForUser(user:User, limit:number):Promise<Post[]> {
    const user_id = (await getUser(user.name)).id
    const feeds = await db
        .select({feed_id:feed_follows.feed_id})
        .from(feed_follows)
        .where(eq(feed_follows.user_id, user_id))
    const result = await db
        .select()
        .from(posts)
        .where(inArray(posts.feed_id, feeds.map(i => i.feed_id)))
        .orderBy(desc(posts.published_at))
        .limit(limit)
    return result
}


export async function getAllPosts():Promise<Post[]> {
    const result = await db.select().from(posts)
    return result
}