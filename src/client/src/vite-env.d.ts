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
    isAdded?:boolean;
}

type Navigate = (to:string) => void
type RouterContext = { currentPath: string; navigate: Navigate }

type PostsView = { 
    authStatus: boolean; 
    posts: Post[] | null | undefined; 
    setPosts: Dispatch<SetStateAction<Post[]| null | undefined>>;
    trigger: boolean;
    setTrigger:  Dispatch<SetStateAction<boolean>>;
    followTrigger?: boolean;
}

type Feed = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    user_id: string;
    last_fetched_at: string | null;
    url: string;
    isFollowed?: boolean;
}