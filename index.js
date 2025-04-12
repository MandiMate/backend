import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routers/authRoute.js"
import cors from "cors"
import seasonRoute from "./routers/seasonRoute.js"
import autoCloseSeason from "./cronJobs/SeasonAutoClose.js"

const app = express()
dotenv.config()
app.use(express.json())
app.use(cors())

app.use("/auth", authRoute)
app.use("/season", seasonRoute);

const PORT = process.env.PORT || 7010
const MONGODB = process.env.MONGODBURI

// Start the cron job when the server starts
autoCloseSeason()

mongoose.connect(MONGODB)
    .then(() => {
        console.log("Mongodb Connected Successfully.");
        app.listen(PORT, () => {
            console.log("Server is Running On Port", PORT);
        })
    }).catch((e) => {
        console.log(e);
    })

