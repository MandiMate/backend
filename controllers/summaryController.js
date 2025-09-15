import mongoose from "mongoose";
import Purchase from "../models/purchaseModel.js";
import Sale from "../models/saleModel.js";

// Get Season Summary Landlord Wise
export const getSeasonSummary = async (req, res) => {
    try {
        const { seasonId } = req.params;
        const agentId = req.user.id; // From authMiddleware

        const summary = await Purchase.aggregate([
            {
                $match: {
                    seasonId: new mongoose.Types.ObjectId(seasonId),
                    agentId: new mongoose.Types.ObjectId(agentId)
                }
            },
            {
                $group: {
                    _id: "$landlordId",
                    totalPurchases: { $sum: "$totalAmount" },
                    totalPaid: { $sum: { $add: ["$advance", "$paidToFarmer"] } },
                }
            },
            {
                $addFields: {
                    pendingBalance: { $subtract: ["$totalPurchases", "$totalPaid"] }
                }
            },
            {
                $lookup: {
                    from: "landlords",
                    localField: "_id",
                    foreignField: "_id",
                    as: "landlordInfo"
                }
            },
            { $unwind: "$landlordInfo" },
            {
                $project: {
                    _id: 0,
                    landlordId: "$landlordInfo._id",
                    landlordName: "$landlordInfo.name",
                    contact: "$landlordInfo.contact",
                    totalPurchases: 1,
                    totalPaid: 1,
                    pendingBalance: 1
                }
            }
        ]);

        // 2. Sales aggregate (season + agent wise)
        const salesSummary = await Sale.aggregate([
            {
                $match: {
                    seasonId: new mongoose.Types.ObjectId(seasonId),
                    agentId: new mongoose.Types.ObjectId(agentId),
                },
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" },
                },
            },
        ]);

        const totalSales = salesSummary.length > 0 ? salesSummary[0].totalSales : 0;


        // Totals for summary cards
        const totals = {
            totalPurchases: summary.reduce((sum, item) => sum + item.totalPurchases, 0),
            totalPaid: summary.reduce((sum, item) => sum + item.totalPaid, 0),
            totalPending: summary.reduce((sum, item) => sum + item.pendingBalance, 0),
            totalSales,
        };

        res.status(200).json({
            message: "Season summary fetched successfully",
            totals, // Summary cards data
            landlords: summary // Landlord-wise table data
        });

    } catch (error) {
        console.error("Season Summary Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get Landlord Summary Farmer Wise
export const getLandlordDetailSummary = async (req, res) => {
    try {
        const { seasonId, landlordId } = req.params;
        const agentId = req.user.id; // authMiddleware se

        const summary = await Purchase.aggregate([
            {
                $match: {
                    seasonId: new mongoose.Types.ObjectId(seasonId),
                    landlordId: new mongoose.Types.ObjectId(landlordId),
                    agentId: new mongoose.Types.ObjectId(agentId)
                }
            },
            {
                $group: {
                    _id: "$farmerId",
                    totalPurchases: { $sum: "$totalAmount" },
                    totalPaid: { $sum: { $add: ["$advance", "$paidToFarmer"] } },
                }
            },
            {
                $addFields: {
                    pendingBalance: { $subtract: ["$totalPurchases", "$totalPaid"] }
                }
            },
            {
                $lookup: {
                    from: "farmers",
                    localField: "_id",
                    foreignField: "_id",
                    as: "farmerInfo"
                }
            },
            { $unwind: "$farmerInfo" },
            {
                $project: {
                    _id: 0,
                    farmerId: "$farmerInfo._id",
                    farmerName: "$farmerInfo.name",
                    contact: "$farmerInfo.contact",
                    totalPurchases: 1,
                    totalPaid: 1,
                    pendingBalance: 1
                }
            }
        ]);

        res.status(200).json({
            message: "Landlord farmer-wise summary fetched successfully",
            data: summary
        });

    } catch (error) {
        console.error("Landlord Detail Summary Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get Farmer Purchase History (inside a specific season)
export const getFarmerPurchaseHistory = async (req, res) => {
    try {
        const { seasonId, farmerId } = req.params;
        const agentId = req.user.id; // from authMiddleware

        const purchases = await Purchase.find({
            seasonId: new mongoose.Types.ObjectId(seasonId),
            farmerId: new mongoose.Types.ObjectId(farmerId),
            agentId: new mongoose.Types.ObjectId(agentId)
        })
            .populate("landlordId", "name contact")
            .populate("farmerId", "name contact")
            .sort({ purchaseDate: -1 });

        if (!purchases || purchases.length === 0) {
            return res.status(404).json({ message: "No purchases found for this farmer in this season" });
        }

        // Farmer Info (from first purchase, since all have same farmerId)
        const farmerInfo = {
            farmerId: purchases[0].farmerId._id,
            farmerName: purchases[0].farmerId.name,
            farmerContact: purchases[0].farmerId.contact,
            landlordName: purchases[0].landlordId?.name || "",
            landlordContact: purchases[0].landlordId?.contact || ""
        };

        res.status(200).json({
            message: "Farmer purchase history fetched successfully",
            farmerInfo,
            purchases
        });

    } catch (error) {
        console.error("Farmer Purchase History Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
