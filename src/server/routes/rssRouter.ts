import { Router } from "express";
import { getFeeds, getFeedWithID } from "../controllers/apiController";

export const rssRouter = Router()

rssRouter.get('/api/feeds', getFeeds)
rssRouter.get('/api/feeds/:id', getFeedWithID)


