import mongoose from "mongoose";
import Season from "../models/seasonModel.js";

// Start New Season
const createSeason = async (req, res) => {
    try {
        const { name, startDate, endDate } = req.body;

        // Check if any season is already active
        const activeSeason = await Season.findOne({ isActive: true });
        if (activeSeason) {
            return res.status(400).send({ message: "Another season is already active!" });
        }

        const newSeason = await Season.create({
            name,
            startDate,
            endDate,
            isActive: true,
            agentId: new mongoose.Types.ObjectId(),
        });

        res.status(201).send({ status: 201, message: "Season started successfully", data: newSeason });
    } catch (error) {
        res.status(500).send({ message: "Server Error", error });
    }
};

// Close Active Season
const closeSeason = async (req, res) => {
    try {
        const activeSeason = await Season.findOne({ isActive: true });

        if (!activeSeason) {
            return res.status(400).send({ message: "No active season found" });
        }

        activeSeason.isActive = false;
        await activeSeason.save();

        res.status(200).send({ status: 200, message: "Season closed successfully" });
    } catch (error) {
        res.status(500).send({ message: "Server Error", error });
    }
};

// Get All Seasons
const getAllSeasons = async (req, res) => {
    try {
        const seasons = await Season.find().sort({ createdAt: -1 });
        res.status(200).send({ status: 200, message: "Seasons fetched successfully", data: seasons });
    } catch (error) {
        res.status(500).send({ message: "Server Error", error });
    }
};

// Get Active Season Only
const getActiveSeason = async (req, res) => {
    try {
        const activeSeason = await Season.findOne({ isActive: true });
        if (!activeSeason) {
            return res.status(404).send({ message: "No active season found" });
        }
        res.status(200).send({ status: 200, message: "Active season", data: activeSeason });
    } catch (error) {
        res.status(500).send({ message: "Server Error", error });
    }
};

export { createSeason, closeSeason, getAllSeasons, getActiveSeason };