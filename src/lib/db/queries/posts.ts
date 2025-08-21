import { db } from "../db";
import { and, desc, eq } from "drizzle-orm";
import { feed_follows, post_favorites, posts} from "../schema";
import { User } from "./users";


export type Post = typeof posts.$inferInsert;
export type PostReturn = typeof posts.$inferSelect & { isAdded?: boolean }
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


export async function getPostsForUser(user:User, limit:number, offset = 0):Promise<PostReturn[]> {
    const user_id = String(user.id)
    const result = await db
        .select({
            id: posts.id,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
            title: posts.title,
            url: posts.url,
            feed_id: posts.feed_id,
            description: posts.description,
            published_at:posts.published_at,
            isAdded: post_favorites.post_id
        })
        .from(feed_follows)
        .innerJoin(posts, eq(feed_follows.feed_id, posts.feed_id))
        .leftJoin(
            post_favorites,
            and(
                eq(post_favorites.post_id, posts.id),
                eq(post_favorites.user_id, user_id)
            )
        )
        .where(eq(feed_follows.user_id, user_id))
        .orderBy(desc(posts.published_at))
        .limit(limit)
        .offset(offset);
    return result.map(p => ({...p, isAdded: Boolean(p.isAdded)}))
}




export async function getPostByID(id:string):Promise<Post> {
    const [result] = await db.select().from(posts).where(eq(posts.id, id))
    return result
}

export async function getAllPosts(limit:number, offset: number):Promise<Post[]> {
    const result = await db
        .select()
        .from(posts)
        .orderBy(desc(posts.published_at))
        .limit(limit)
        .offset(offset)
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

