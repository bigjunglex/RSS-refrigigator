import express from "express";
import { rssRouter, protectedRouter } from "./routes/rssRouter.js";
import { errorCatcher, middleWares } from "./middlewares.js";
import { authRouter } from "./routes/authRouter.js";
import cors from "cors"

const PORT = 8080
const app = createApp()

app.listen(PORT, () => {
    console.log('API listining on ', PORT)
})

export default function createApp() {
    const app = express()
    app.disable("x-powered-by")
    app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

    app.use(middleWares)
    app.use(authRouter)
    app.use(rssRouter)
    app.use('/api/feeds', protectedRouter)
    app.use(errorCatcher)

    return app
}


