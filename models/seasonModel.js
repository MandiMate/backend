import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: false },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "auth", required: true },
    createdAt: { type: Date, default: Date.now }
});

const Season = mongoose.model("Season", seasonSchema);
export default Season;