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


export async function getPostsForUser(user:User, limit:number, offset = 0):Promise<Post[]> {
    const user_id = String(user.id)
    const result = await db
        .select({ post: posts })
        .from(feed_follows)
        .innerJoin(posts, eq(feed_follows.feed_id, posts.feed_id))
        .where(eq(feed_follows.user_id, user_id))
        .orderBy(desc(posts.published_at))
        .limit(limit)
        .offset(offset);
    return result.map(p => p.post)
}

export async function getPostByID(id:string):Promise<Post> {
    const [result] = await db.select().from(posts).where(eq(posts.id, id))
    return result
}

export async function getAllPosts():Promise<Post[]> {
    const result = await db.select().from(posts).orderBy(desc(posts.published_at))
    return result
}

export async function getPostsByFeed(feedId:string) {
    const result = await db
        .select()
        .from(posts)
        .where(eq(posts.feed_id, feedId))
        .orderBy(desc(posts.published_at))
    return result
}