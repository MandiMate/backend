import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    productName: { type: String, required: true, trim: true },
    baseUnit: { type: String, required: true, enum: ["kg", "maund", "ton", "piece"] },

    seasonId: { type: mongoose.Schema.Types.ObjectId, ref: "Season", required: true },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "auth", required: true },

    totalPurchasedQty: { type: Number, default: 0 }, // in baseUnit
    totalSoldQty: { type: Number, default: 0 },      // in baseUnit
    currentQty: { type: Number, default: 0 },        // in baseUnit
}, { timestamps: true });

inventorySchema.index({ agentId: 1, seasonId: 1, productName: 1 }, { unique: true });

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
