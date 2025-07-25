import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../schema";

export type User = typeof users.$inferInsert;

export async function createUser(name:string) {
    const [result] = await db.insert(users).values({name:name}).returning()
    return result
}

export async function getUser(name:string) {
    const [result] = await db.select().from(users).where(eq(users.name, name))
    return result
}

export async function dropUsers() {
    const [result] = await db.delete(users).returning()
    return result
}

export async function getUsers() {
    const result = await db.select().from(users)
    return result
}