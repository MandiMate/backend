// routes/summaryRoute.js
import express from "express";
import { getFarmerPurchaseHistory, getLandlordDetailSummary, getSeasonSummary } from "../controllers/summaryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const sumamaryRoute = express.Router();

sumamaryRoute.get("/season-summary/:seasonId", authMiddleware, getSeasonSummary);
sumamaryRoute.get("/season/:seasonId/landlord/:landlordId", authMiddleware, getLandlordDetailSummary);
sumamaryRoute.get("/season/:seasonId/farmer/:farmerId", authMiddleware, getFarmerPurchaseHistory);

export default sumamaryRoute;
