import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoute from "./routers/authRoute.js";
import seasonRouter from "./routers/seasonRoute.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoute);
app.use("/season", seasonRouter);

const PORT = process.env.PORT || 7010;
const MONGODB = process.env.MONGODBURI;

mongoose.connect(MONGODB)
    .then(() => {
        console.log("MongoDB Connected Successfully.");
        app.listen(PORT, () => {
            console.log("Server is Running On Port", PORT);
        });
    })
    .catch((error) => {
        console.log(error);
    });
