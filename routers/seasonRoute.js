import express from "express";
import { startSeason, getActiveSeason, closeSeason, getAllSeasons } from "../controllers/seasonController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const seasonRouter = express.Router();

// Protected routes
seasonRouter.post("/start", authMiddleware, startSeason);
seasonRouter.get("/active", authMiddleware, getActiveSeason);
seasonRouter.patch("/close/:id", authMiddleware, closeSeason);
seasonRouter.get("/all", authMiddleware, getAllSeasons);

export default seasonRouter;
