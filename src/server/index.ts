import express from "express";
import { rssRouter } from "./routes/rssRouter";
import { errorCatcher, middleWares } from "./middlewares";
import { authRouter } from "./routes/authRouter";

const app = express()
const PORT = 8080

app.use(middleWares)
app.use(authRouter)
app.use(rssRouter)
app.use(errorCatcher)


app.listen(PORT, () => {
    console.log('API listining on ', PORT)
})