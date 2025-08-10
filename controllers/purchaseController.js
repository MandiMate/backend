import Purchase from "../models/purchaseModel.js";
import Season from "../models/seasonModel.js";

// 1. Add a new purchase
export const addPurchase = async (req, res) => {
    try {
        const {
            productName,
            quantity,
            unit,
            unitPrice,
            seasonId,
            landlordId,
            farmerId,
            expense,
            advance,
            paidToFarmer,
            purchaseDate
        } = req.body;

        // Ensure agentId from logged-in user
        const agentId = req.user.id;

        // Check if season is active for this agent
        const season = await Season.findOne({ _id: seasonId, agentId, isActive: true });
        if (!season) {
            return res.status(400).json({ message: "No active season found for this agent" });
        }

        const newPurchase = await Purchase.create({
            productName,
            quantity,
            unit,
            unitPrice,
            seasonId,
            agentId,
            landlordId,
            farmerId,
            expense,
            advance,
            paidToFarmer,
            purchaseDate
        });

        res.status(201).json({
            message: "Purchase added successfully",
            data: newPurchase
        });

    } catch (error) {
        console.error("Add Purchase Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 2. Get all purchases for active season (for dashboard/overview)
export const getPurchasesForActiveSeason = async (req, res) => {
    try {
        const agentId = req.user.id;

        const activeSeason = await Season.findOne({ agentId, isActive: true });
        if (!activeSeason) {
            return res.status(400).json({ message: "No active season found" });
        }

        const purchases = await Purchase.find({ seasonId: activeSeason._id })
            .populate("landlordId", "name contact")
            .populate("farmerId", "name contact")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Purchases fetched successfully",
            data: purchases
        });

    } catch (error) {
        console.error("Get Purchases Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 3. Get single purchase
export const getPurchaseById = async (req, res) => {
    try {
        const { id } = req.params;

        const purchase = await Purchase.findById(id)
            .populate("landlordId", "name contact")
            .populate("farmerId", "name contact");

        if (!purchase) {
            return res.status(404).json({ message: "Purchase not found" });
        }

        res.status(200).json({ message: "Purchase found", data: purchase });

    } catch (error) {
        console.error("Get Purchase Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 4. Update purchase
export const updatePurchase = async (req, res) => {
    try {
        const { id } = req.params;

        let purchase = await Purchase.findById(id);
        if (!purchase) {
            return res.status(404).json({ message: "Purchase not found" });
        }

        // Update fields manually
        Object.assign(purchase, req.body);

        // Save triggers pre("validate") middleware
        await purchase.save();

        res.status(200).json({
            message: "Purchase updated successfully",
            data: purchase
        });

    } catch (error) {
        console.error("Update Purchase Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// 5. Delete purchase
export const deletePurchase = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Purchase.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Purchase not found" });
        }

        res.status(200).json({
            message: "Purchase deleted successfully",
            data: deleted
        });

    } catch (error) {
        console.error("Delete Purchase Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
