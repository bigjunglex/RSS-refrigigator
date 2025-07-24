import { post_favorites, posts} from "../schema";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../db";
import { User } from "./users";
import { Post } from "./posts";


export async function createFavorite(user:User, post:Post) {
    if (user.id && post.id) {
        const [result] = await db
            .insert(post_favorites)
            .values({ user_id: (user.id), post_id: post.id})  
            .returning()
        return result
    }
    return null
}

export async function deleteFavorite(user:User, post:Post) {
    if (user.id && post.id) {
        const [result] = await db
            .delete(post_favorites)
            .where(
                and(
                    eq(post_favorites.user_id, user.id),
                    eq(post_favorites.post_id, post.id)
                )
            )
            .returning()
        return result
    }
    return null
}


export async function getFavoritePostsForUser(user:User, limit:number, offset = 0):Promise<Post[]> {
    const result = await db
        .select({post: posts})
        .from(post_favorites)
        .innerJoin(posts, eq(post_favorites.post_id, posts.id))
        .where(eq(post_favorites.user_id, String(user.id)))
        .orderBy(desc(posts.published_at))
        .limit(limit)
        .offset(offset);
    return result.map(p => p.post)
}