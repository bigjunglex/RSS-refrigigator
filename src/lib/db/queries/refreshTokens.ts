import { db } from "../db.js";
import { refresh_tokens } from "../schema.js";
import { eq, and, isNull } from "drizzle-orm";

export type RefreshToken = typeof refresh_tokens.$inferInsert

export async function newRefreshToken(token: string, userId: string, expires: Date):Promise<RefreshToken> {
    const [result] = await db
        .insert(refresh_tokens)
        .values({token: token, userId: userId, expires: expires.toISOString()})
        .onConflictDoNothing()
        .returning()
    return result
}


export async function revokeRefreshToken(token:string) {
    const [result] = await db
        .update(refresh_tokens)
        .set({revoked: new Date().toISOString()})
        .where(eq(refresh_tokens.token, token))
        .returning()
    return result
}


export async function getRefreshToken(token: string) {
    const [result] = await db
        .select()
        .from(refresh_tokens)
        .where(and(
            eq(refresh_tokens.token, token),
            isNull(refresh_tokens.revoked)
        ))
    return result
}