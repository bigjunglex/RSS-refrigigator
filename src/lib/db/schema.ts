import { time } from "console";
import { isNull, sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, text, unique } from "drizzle-orm/pg-core";
import { title } from "process";


export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
})

export const feeds = pgTable("feeds", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    last_fetched_at: timestamp("last_fetched_at"),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    name: text("name").notNull(),
    url: text("url").notNull().unique(),
    user_id: uuid("user_id").references(() => users.id, {onDelete: 'cascade'}).notNull(), 
})


export const feed_follows = pgTable("feed_follows", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    user_id: uuid("user_id").references(() => users.id, {onDelete: 'cascade'}).notNull(),
    feed_id: uuid("feed_id").references(() => feeds.id, {onDelete: 'cascade'}).notNull()
}, (t) => [unique().on(t.feed_id, t.user_id)])


export const posts = pgTable("posts", {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    title: text("title").notNull(),
    url: text("url").notNull().unique(),
    description: text("description"),
    published_at: timestamp("published_at").defaultNow(),
    feed_id: uuid("feed_id").references(() => feeds.id).notNull()
})


export const post_favorites = pgTable("post_favorites", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    user_id: uuid("user_id").references(() => users.id, {onDelete: 'cascade'}).notNull(),
    post_id: uuid("post_id").references(() => posts.id, {onDelete: 'cascade'}).notNull()
}, (t) => [unique().on(t.post_id, t.user_id)]);