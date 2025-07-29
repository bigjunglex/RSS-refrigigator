import { Router } from "express";
import { favoritePost, followFeed, getFavorites, getFeeds, getFeedWithID, getFollowed, unfavoritePost, unfollowFeed } from "../controllers/apiController";
import { authMiddleware } from "../middlewares";



export const rssRouter = Router()
export const protectedRouter = Router()

rssRouter.get('/api/feeds', getFeeds)
rssRouter.get('/api/feeds/:id', getFeedWithID)

protectedRouter.use(authMiddleware)
protectedRouter.post('/:id/follow', followFeed)
protectedRouter.delete('/:id/follow', unfollowFeed)
protectedRouter.get('/posts/followed', getFollowed)

protectedRouter.post('/:id/favorite', favoritePost)
protectedRouter.delete('/:id/favorite', unfavoritePost)
protectedRouter.get('/posts/favorites', getFavorites)

