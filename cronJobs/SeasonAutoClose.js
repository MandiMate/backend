import cron from "node-cron";
import Season from "../models/seasonModel.js";

const autoCloseSeason = () => {
    // Run every day at midnight
    cron.schedule("0 0 * * *", async () => {
        try {
            const now = new Date();
            
            const expiredSeasons = await Season.find({
                isActive: true,
                endDate: { $lte: now }, // If endDate is less than or equal to now
            });

            for (const season of expiredSeasons) {
                season.isActive = false;
                await season.save();
                console.log(`Auto closed season: ${season.name}`);
            }
        } catch (error) {
            console.error("Auto-close season error:", error);
        }
    });
};

export default autoCloseSeason;