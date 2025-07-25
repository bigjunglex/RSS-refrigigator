import express from "express"
import helmet from "helmet"
import { rssRouter } from "./routes/rssRouter";

const app = express();
const PORT = 8080;

app.use(helmet())
app.use(express.json())
app.use(rssRouter)


app.listen(PORT, () => {
    console.log('API listining on ', PORT)
})