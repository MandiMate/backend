import Season from "../models/seasonModel.js";

// Start a new season
export const startSeason = async (req, res) => {
    try {
        const agentId = req.user.id; // from authMiddleware
        const { name } = req.body;

        // Check if there's already an active season
        const activeSeason = await Season.findOne({ agentId, isActive: true });
        if (activeSeason) {
            return res.status(400).json({ message: "An active season already exists." });
        }

        const season = await Season.create({
            name,
            agentId,
        });

        res.status(201).json({ message: "Season started successfully", season });
    } catch (error) {
        console.error("Start Season Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get active season
export const getActiveSeason = async (req, res) => {
    try {
        const agentId = req.user.id;
        const season = await Season.findOne({ agentId, isActive: true });

        if (!season) {
            return res.status(404).json({ message: "No active season found" });
        }

        res.status(200).json({ season });
    } catch (error) {
        console.error("Get Active Season Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Close season
export const closeSeason = async (req, res) => {
    try {
        const agentId = req.user.id;
        const { id } = req.params;

        const season = await Season.findOne({ _id: id, agentId });
        if (!season) {
            return res.status(404).json({ message: "Season not found" });
        }

        if (!season.isActive) {
            return res.status(400).json({ message: "Season is already closed" });
        }

        season.isActive = false;
        season.endDate = new Date();
        await season.save();

        res.status(200).json({ message: "Season closed successfully", season });
    } catch (error) {
        console.error("Close Season Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all seasons (history)
export const getAllSeasons = async (req, res) => {
    try {
        const agentId = req.user.id;
        const seasons = await Season.find({ agentId }).sort({ startDate: -1 });

        res.status(200).json({ seasons });
    } catch (error) {
        console.error("Get All Seasons Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
