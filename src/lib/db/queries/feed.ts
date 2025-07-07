import { eq } from "drizzle-orm";
import { readConfig } from "src/config";
import { db } from "../db";
import { users, feeds } from "../schema";
import { type User } from "./users";

export type Feed = typeof feeds.$inferSelect;
type FeedTuple = [Feed, User]

export async function createFeed(name:string, url: string):Promise<FeedTuple> {
    const user = readConfig().currentUserName;
    const [user_rec] = await db.select().from(users).where(eq(users.name, user));
    const [result] = await db.insert(feeds).values({name: name, url: url, user_id: user_rec.id}).returning();
    
    return [result, user_rec]
}

export async function getFeeds(userName:string) {

}