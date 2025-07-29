import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../schema";

export type User = typeof users.$inferInsert;
export type UserSelect = typeof users.$inferSelect;

export async function createUser(name:string, hashed:string) {
    const [result] = await db.insert(users).values({name:name, hashedPassword: hashed}).returning()
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

export async function updateUserPasswordById(id:string, hashed:string) {
    const [result] = await db
        .update(users)
        .set({hashedPassword:hashed})
        .where(eq(users.id, id))
        .returning()
    return result
}

export async function getUserByID(id:string):Promise<UserSelect> {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
    return result
}