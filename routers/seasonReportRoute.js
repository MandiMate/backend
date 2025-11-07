import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
    deleteSeasonReport,
    generateSeasonReport,
    getAllSeasonReports,
    getSeasonReportById
} from "../controllers/seasonReportController.js";

const seasonReportRouter = express.Router();

// Generate new report for a season
seasonReportRouter.post("/generate/:seasonId", authMiddleware, generateSeasonReport);

// Get all reports (for agent)
seasonReportRouter.get("/all", authMiddleware, getAllSeasonReports);

// Get single report
seasonReportRouter.get("/detail/:id", authMiddleware, getSeasonReportById);

// Delete a report (admin/agent only for duplicates)
seasonReportRouter.delete("/delete/:id", authMiddleware, deleteSeasonReport);

export default seasonReportRouter;
