import express from "express";
import { createSeason, closeSeason, getAllSeasons, getActiveSeason } from "../controllers/seasonController.js";

const seasonRoute = express.Router();

// Get All Seasons
seasonRoute.get("/", getAllSeasons);

// Start New Season
seasonRoute.post("/create", createSeason);

// Close Active Season
seasonRoute.patch("/close", closeSeason);

// Get Active Season Only
seasonRoute.get("/active", getActiveSeason);

export default seasonRoute;