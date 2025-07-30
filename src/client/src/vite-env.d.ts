/// <reference types="vite/client" />

type Post = {
    url: string;
    feed_id: string;
    title: string;
    id?: string | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    description?: string | null | undefined;
    published_at?: string | Date | undefined | null;
}