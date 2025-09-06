// controllers/inventoryController.js
import Inventory from "../models/inventoryModel.js";

export const listInventory = async (req, res) => {
    try {
        const agentId = req.user.id;
        const { seasonId } = req.query;
        const q = { agentId };
        if (seasonId) q.seasonId = seasonId;
        const rows = await Inventory.find(q).sort({ productName: 1 });
        res.status(200).json({ data: rows });
    } catch (e) {
        console.error("List Inventory Error:", e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getInventoryByProduct = async (req, res) => {
    try {
        const agentId = req.user.id;
        const { seasonId, productName } = req.params;
        const inv = await Inventory.findOne({ agentId, seasonId, productName });
        if (!inv) return res.status(404).json({ message: "No inventory found for this product" });
        res.status(200).json({ data: inv });
    } catch (e) {
        console.error("Get Inventory Error:", e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
