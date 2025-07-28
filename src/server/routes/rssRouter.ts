import { Router } from "express";
import { favoritePost, followFeed, getFavorites, getFeeds, getFeedWithID, getFollowed, unfavoritePost, unfollowFeed } from "../controllers/apiController";
import { authMiddleware } from "../middlewares";


export const rssRouter = Router()


rssRouter.get('/api/feeds', getFeeds)
rssRouter.get('/api/feeds/:id', getFeedWithID)

// auth req paths
const protectedRouter = Router()

protectedRouter.use(authMiddleware)

protectedRouter.post('/api/feeds/:id/follow', followFeed)
protectedRouter.delete('/api/feeds/:id/follow', unfollowFeed)
protectedRouter.get('/api/feeds/followed', getFollowed)

protectedRouter.post('/api/feeds/:postId/favorite', (favoritePost))
protectedRouter.delete('/api/feeds/:postId/favorite', unfavoritePost)
protectedRouter.get('/api/feeds/favorites', getFavorites)

rssRouter.use(protectedRouter)
