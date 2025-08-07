import type { Response, Request, NextFunction } from "express"
import { createFavorite, deleteFavorite, getFavoritePostsForUser } from "src/lib/db/queries/favorites";
import { createFeedFollow, getAllFeeds, getFeedById } from "src/lib/db/queries/feeds"
import { deleteFollow, getFeedFollowsForUser } from "src/lib/db/queries/follows";
import { getAllPosts, getPostByID, getPostsByFeed, getPostsForUser } from "src/lib/db/queries/posts";
import { type User } from "src/lib/db/queries/users";


export async function getFeeds(req:Request, res:Response, next: NextFunction) {
    try {
        const feeds = await getAllFeeds();
        if(feeds.length < 1) {
            throw new Error('[FEED]: Not Found')
        }
        res.status(200).json(feeds)
    } catch (error) {
        next(error)
    }
    
}


export async function getFeedWithID(req:Request, res:Response, next: NextFunction) {
    const { id } = req.params
    try {
        const feed = await getPostsByFeed(id)
        if(feed.length < 1) {
            throw new Error('[FEED]: Not Found')
        }
        res.status(200).json(feed)
    } catch (error) {
        next(error)   
    }
}


export async function followFeed(req:Request, res:Response, next: NextFunction) {
    const { id } = req.params
    try {
        const user = res.locals.user as User
        const feed = await getFeedById(id)
        const follow = await createFeedFollow(user, feed)

        res.status(200).json(follow)
    } catch (error) {
        next(error)
    }
}


export async function unfollowFeed(req:Request, res:Response, next: NextFunction) {
    const { id } = req.params
    try {
        const user = res.locals.user as User
        const feed = await getFeedById(id)
        const unfollow = await deleteFollow(user, feed)

        res.status(200).json({...unfollow, unfollowed: true})
    } catch (error) {
        next(error)
    }
}


export async function getFollowed(req:Request, res:Response, next: NextFunction) {
    const limit = parseInt(String(req.query.limit)) || 100
    const offset = parseInt(String(req.query.offset)) || 0

    try {
        const user = res.locals.user as User
        const feeds = await getPostsForUser(user, limit, offset)
        if(feeds.length < 1) {
            throw new Error('[FEED]: Not Found')
        }
        res.status(200).json(feeds)
    } catch (error) {
        next(error)
    }
}


export async function favoritePost(req:Request, res:Response, next: NextFunction) {
    const { id } = req.params
    try {
        const user = res.locals.user as User;
        const post = await getPostByID(id);
        if(!post) throw new Error('[POST]: post not foud')
        const entry = await createFavorite(user, post)
        console.log('[FAVORITES]: ', entry)
        res.status(200).json(entry)
    } catch (error) {
        next(error)        
    }
}


export async function unfavoritePost(req:Request, res:Response, next: NextFunction) {
    const { id } = req.params
    try {
        const user = res.locals.user as User;
        const post = await getPostByID(id);
        if(!post) throw new Error('[POST]: post not foud')
        const entry = await deleteFavorite(user, post)
        console.log('[FAVORITES]: removed from favorites ', entry)
        res.status(200).json(entry)
    } catch (error) {
        next(error)        
    }
}


export async function getFavorites(req:Request, res:Response, next: NextFunction) {
    const [ limit, offset ]  = [req.params.limit, req.params.offset].map(x => parseInt(x))
    try {
        const user = res.locals.user as User;
        const posts = await getFavoritePostsForUser(user, limit, offset)
        if (posts.length < 1) {
            throw new Error('[FAVORITES]: 0 posts added to favorite');
        }
        res.status(200).json(posts)
    } catch (error) {
        next(error)
    }
}


export async function getPosts(req:Request, res:Response, next: NextFunction) {
    try {
        const posts = await getAllPosts()
        if(posts.length < 1) {
            throw new Error('[POSTS]: 0 post found');
        }
        res.status(200).json(posts)
    } catch (error) {
        next(error)
    }
}