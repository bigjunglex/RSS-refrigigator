import type { Response, Request, NextFunction } from "express"
import { getAllFeeds } from "src/lib/db/queries/feeds"
import { getPostsByFeed } from "src/lib/db/queries/posts";


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