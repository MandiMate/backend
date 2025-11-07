import mongoose from "mongoose";

const productSummarySchema = new mongoose.Schema({
    productName: { type: String, required: true },
    totalPurchasedQty: { type: Number, default: 0 },
    totalPurchasedAmount: { type: Number, default: 0 },
    totalSoldQty: { type: Number, default: 0 },
    totalSoldAmount: { type: Number, default: 0 },
    remainingQty: { type: Number, default: 0 },
    profitOrLoss: { type: Number, default: 0 },
}, { _id: false });

const seasonReportSchema = new mongoose.Schema({
    seasonId: { type: mongoose.Schema.Types.ObjectId, ref: "Season", required: true },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "auth", required: true },
    totalPurchases: { type: Number, default: 0 },
    totalPurchaseAmount: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalSalesAmount: { type: Number, default: 0 },
    totalExpense: { type: Number, default: 0 },
    totalAdvance: { type: Number, default: 0 },
    totalPaidToFarmer: { type: Number, default: 0 },
    totalProfitOrLoss: { type: Number, default: 0 },
    productWiseSummary: [productSummarySchema],
    generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("SeasonReport", seasonReportSchema);
