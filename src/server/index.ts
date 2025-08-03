import express from "express";
import { rssRouter, protectedRouter } from "./routes/rssRouter";
import { errorCatcher, middleWares } from "./middlewares";
import { authRouter } from "./routes/authRouter";
import cors from "cors"

const app = express()
const PORT = 8080

app.disable("x-powered-by")
app.use(cors({ origin: 'http://localhost:5173', credentials: true}));

app.use(middleWares)
app.use(authRouter)
app.use(rssRouter)
app.use('/api/feeds', protectedRouter)
app.use(errorCatcher)


app.listen(PORT, () => {
    console.log('API listining on ', PORT)
})