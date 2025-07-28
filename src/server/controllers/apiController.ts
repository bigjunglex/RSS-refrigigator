import type { Response, Request, NextFunction } from "express"
import { createFeedFollow, getAllFeeds, getFeedById } from "src/lib/db/queries/feeds"
import { deleteFollow, getFeedFollowsForUser } from "src/lib/db/queries/follows";
import { getPostsByFeed, getPostsForUser } from "src/lib/db/queries/posts";
import { User } from "src/lib/db/queries/users";


export async function getFeeds(req:Request, res:Response, next: NextFunction) {
    try {
        const feeds = await getAllFeeds();
        res.status(200).json(feeds)
    } catch (error) {
        next(error)
    }
    
}


export async function getFeedWithID(req:Request, res:Response, next: NextFunction) {
    const { id } = req.params
    try {
        const feed = await getPostsByFeed(id)

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
    const [ limit, offset ]  = [req.params.limit, req.params.offset].map(x => parseInt(x))
    try {
        const user = res.locals.user as User
        const feeds = await getPostsForUser(user, limit, offset)
        res.status(200).json(feeds)
    } catch (error) {
        next(error)
    }
}


export async function favoritePost(req:Request, res:Response, next: NextFunction) {

}


export async function unfavoritePost() {

}


export async function getFavorites() {

}
