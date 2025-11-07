import Purchase from "../models/purchaseModel.js";
import Sale from "../models/saleModel.js";
import Inventory from "../models/inventoryModel.js";
import Season from "../models/seasonModel.js";
import SeasonReport from "../models/seasonReportModel.js";

export const generateSeasonReport = async (req, res) => {
    try {
        const agentId = req.user.id;
        const { seasonId } = req.params;

        // Check season validity
        const season = await Season.findOne({ _id: seasonId, agentId });
        if (!season) return res.status(404).json({ message: "Season not found" });

        // Prevent duplicate report
        const existingReport = await SeasonReport.findOne({ seasonId, agentId });
        if (existingReport) {
            return res.status(400).json({
                message: "Season report already generated for this season",
                data: existingReport
            });
        }

        // Fetch all relevant data
        const purchases = await Purchase.find({ seasonId, agentId });
        const sales = await Sale.find({ seasonId, agentId });
        const inventory = await Inventory.find({ seasonId, agentId });

        // Basic totals
        const totalPurchaseAmount = purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
        const totalSalesAmount = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
        const totalExpense = purchases.reduce((sum, p) => sum + (p.expense || 0), 0);
        const totalAdvance = purchases.reduce((sum, p) => sum + (p.advance || 0), 0);
        const totalPaidToFarmer = purchases.reduce((sum, p) => sum + (p.paidToFarmer || 0), 0);

        // Group product-wise
        const productMap = {};

        // Purchases summary
        for (const p of purchases) {
            if (!productMap[p.productName]) {
                productMap[p.productName] = {
                    productName: p.productName,
                    totalPurchasedQty: 0,
                    totalPurchasedAmount: 0,
                    totalSoldQty: 0,
                    totalSoldAmount: 0,
                    remainingQty: 0,
                    profitOrLoss: 0
                };
            }
            productMap[p.productName].totalPurchasedQty += p.quantity;
            productMap[p.productName].totalPurchasedAmount += p.totalAmount;
        }

        // Sales summary
        for (const s of sales) {
            if (!productMap[s.productName]) {
                productMap[s.productName] = {
                    productName: s.productName,
                    totalPurchasedQty: 0,
                    totalPurchasedAmount: 0,
                    totalSoldQty: 0,
                    totalSoldAmount: 0,
                    remainingQty: 0,
                    profitOrLoss: 0
                };
            }
            productMap[s.productName].totalSoldQty += s.quantity;
            productMap[s.productName].totalSoldAmount += s.totalAmount;
        }

        // Remaining qty & profit/loss
        for (const key in productMap) {
            const item = productMap[key];
            item.remainingQty = Math.max(0, item.totalPurchasedQty - item.totalSoldQty);
            item.profitOrLoss = Number((item.totalSoldAmount - item.totalPurchasedAmount).toFixed(2));
        }

        const productWiseSummary = Object.values(productMap);

        // Total Profit/Loss
        const totalProfitOrLoss = productWiseSummary.reduce((sum, p) => sum + p.profitOrLoss, 0);

        // Save report
        const report = await SeasonReport.create({
            seasonId,
            agentId,
            totalPurchases: purchases.length,
            totalPurchaseAmount,
            totalSales: sales.length,
            totalSalesAmount,
            totalExpense,
            totalAdvance,
            totalPaidToFarmer,
            totalProfitOrLoss,
            productWiseSummary
        });

        res.status(201).json({
            message: "Season report generated successfully",
            data: report
        });

    } catch (error) {
        console.error("Generate Season Report Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Get all reports (for admin or agent)
export const getAllSeasonReports = async (req, res) => {
    try {
        const agentId = req.user.id;
        const reports = await SeasonReport.find({ agentId })
            .populate("seasonId", "seasonName startDate endDate")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "All season reports fetched",
            data: reports
        });
    } catch (error) {
        console.error("Get Reports Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get single report by ID with season name
export const getSeasonReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const agentId = req.user.id;

        const report = await SeasonReport.findOne({ _id: id, agentId })
            .populate({
                path: "seasonId",
                select: "name startDate endDate" // name field bhi fetch karo
            });

        if (!report) {
            return res.status(404).json({ message: "Season report not found" });
        }

        res.status(200).json({
            message: "Season report fetched",
            data: report
        });
    } catch (error) {
        console.error("Get Season Report Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Delete a season report
export const deleteSeasonReport = async (req, res) => {
    try {
        const { id } = req.params;
        const agentId = req.user.id; // ensure only same agent can delete

        const report = await SeasonReport.findOne({ _id: id, agentId });
        if (!report) {
            return res.status(404).json({ message: "Report not found or unauthorized" });
        }

        await SeasonReport.deleteOne({ _id: id });

        res.status(200).json({
            message: "Season report deleted successfully",
            data: report
        });
    } catch (error) {
        console.error("Delete Season Report Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};