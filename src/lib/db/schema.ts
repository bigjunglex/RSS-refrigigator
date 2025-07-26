import { sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const users = sqliteTable("users", {
    id: text("id").primaryKey().$defaultFn(() => nanoid() ).notNull(),
    createdAt: text("created_at").$defaultFn(() => new Date().toISOString()).notNull(),
    updatedAt: text("updated_at")
        .notNull()
        .$defaultFn(() => new Date().toISOString())
        .$onUpdate(() => new Date().toISOString()),
    name: text("name").notNull().unique(),
    hashedPassword: text("hashed_password").notNull()
})

export const feeds = sqliteTable("feeds", {
    id: text("id").primaryKey().$defaultFn(() => nanoid() ).notNull(),
    createdAt: text("created_at").$defaultFn(() => new Date().toISOString()).notNull(),
    updatedAt: text("updated_at")
        .notNull()
        .$defaultFn(() => new Date().toISOString())
        .$onUpdate(() => new Date().toISOString()),
    last_fetched_at: text("last_fetched_at"),
    name: text("name").notNull(),
    url: text("url").notNull().unique(),
    user_id: text("user_id").references(() => users.id, {onDelete: 'cascade'}).notNull(), 
})


export const feed_follows = sqliteTable("feed_follows", {
    id: text("id").primaryKey().$defaultFn(() => nanoid() ).notNull(),
    createdAt: text("created_at").$defaultFn(() => new Date().toISOString()).notNull(),
    updatedAt: text("updated_at")
        .notNull()
        .$defaultFn(() => new Date().toISOString())
        .$onUpdate(() => new Date().toISOString()),
    user_id: text("user_id").references(() => users.id, {onDelete: 'cascade'}).notNull(),
    feed_id: text("feed_id").references(() => feeds.id, {onDelete: 'cascade'}).notNull()
}, (t) => [unique().on(t.feed_id, t.user_id)])


export const posts = sqliteTable("posts", {
    id: text('id').primaryKey().$defaultFn(() => nanoid()).notNull(),
    createdAt: text("created_at").$defaultFn(() => new Date().toISOString()).notNull(),
    updatedAt: text("updated_at")
        .notNull()
        .$defaultFn(() => new Date().toISOString())
        .$onUpdate(() => new Date().toISOString()),
    title: text("title").notNull(),
    url: text("url").notNull().unique(),
    description: text("description"),
    published_at: text("published_at").$defaultFn(() => new Date().toISOString()),
    feed_id: text("feed_id").references(() => feeds.id).notNull()
})


export const post_favorites = sqliteTable("post_favorites", {
    id: text("id").primaryKey().$defaultFn(() => nanoid() ).notNull(),
    createdAt: text("created_at").$defaultFn(() => new Date().toISOString()).notNull(),
    user_id: text("user_id").references(() => users.id, {onDelete: 'cascade'}).notNull(),
    post_id: text("post_id").references(() => posts.id, {onDelete: 'cascade'}).notNull()
}, (t) => [unique().on(t.post_id, t.user_id)]);