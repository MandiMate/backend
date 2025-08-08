import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date, default: null },
        isActive: { type: Boolean, default: true },
        agentId: { type: mongoose.Schema.Types.ObjectId, ref: "auth", required: true }
    },
    { timestamps: true }
)

// Ensure only one active season per agent (prevents duplicates)
seasonSchema.index(
    { agentId: 1, isActive: 1 },
    { unique: true, partialFilterExpression: { isActive: true } }
);

const Season = mongoose.model("Season", seasonSchema);

export default Season;