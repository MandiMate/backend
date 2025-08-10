import express from "express";
import { createLandlord, getLandlords, updateLandlord, deleteLandlord } from "../controllers/landlordController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const landlordRoute = express.Router();

landlordRoute.post("/create", authMiddleware, createLandlord);
landlordRoute.get("/", authMiddleware, getLandlords);
landlordRoute.patch("/update/:id", authMiddleware, updateLandlord);
landlordRoute.delete("/delete/:id", authMiddleware, deleteLandlord);

export default landlordRoute;
