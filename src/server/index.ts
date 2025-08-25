import express, { Response } from "express";
import { rssRouter, protectedRouter } from "./routes/rssRouter";
import { errorCatcher, middleWares } from "./middlewares";
import { authRouter } from "./routes/authRouter";

const app = express()
const PORT = 8080


if (process.env.NODE_ENV !== 'prod') {
    app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
} 


app.disable("x-powered-by")
app.use(middleWares)
app.use(authRouter)
app.use(rssRouter)
app.use('/api/feeds', protectedRouter)
app.use(errorCatcher)


app.listen(PORT, () => {
    console.log('API listining on ', PORT)
})