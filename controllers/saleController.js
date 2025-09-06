import Sale from "../models/saleModel.js";
import Season from "../models/seasonModel.js";
import * as inventoryService from "../services/inventoryService.js";


// 1. Add a new sale
export const addSale = async (req, res) => {
    try {
        const {
            productName,
            quantity,
            unit,
            unitPrice,
            seasonId,
            customerName,
            saleDate
        } = req.body;

        const agentId = req.user.id; // from middleware

        // Check if season active hai
        const season = await Season.findOne({ _id: seasonId, agentId, isActive: true });
        if (!season) {
            return res.status(400).json({ message: "No active season found for this agent" });
        }

        // pehle sale create karo
        const newSale = await Sale.create({
            productName,
            quantity,
            unit,
            unitPrice,
            seasonId,
            agentId,
            customerName,
            saleDate
        });

        // inventory update karo (decrease stock)
        try {
            await inventoryService.decreaseStock({
                agentId,
                seasonId,
                productName,
                unit,
                qty: quantity
            });
        } catch (invErr) {
            console.error("Inventory sale update warning:", invErr);

            // agar stock kam ho to sale rollback kar do
            await Sale.findByIdAndDelete(newSale._id);

            return res.status(400).json({
                message: "Insufficient stock for this sale",
                error: invErr.message
            });
        }

        res.status(201).json({
            message: "Sale added successfully",
            data: newSale
        });

    } catch (error) {
        console.error("Add Sale Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// 2. Get all sales for active season
export const getSalesForActiveSeason = async (req, res) => {
    try {
        const agentId = req.user.id;

        const activeSeason = await Season.findOne({ agentId, isActive: true });
        if (!activeSeason) {
            return res.status(400).json({ message: "No active season found" });
        }

        const sales = await Sale.find({ seasonId: activeSeason._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Sales fetched successfully",
            data: sales
        });

    } catch (error) {
        console.error("Get Sales Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// 3. Get single sale
export const getSaleById = async (req, res) => {
    try {
        const { id } = req.params;

        const sale = await Sale.findById(id);
        if (!sale) {
            return res.status(404).json({ message: "Sale not found" });
        }

        res.status(200).json({ message: "Sale found", data: sale });

    } catch (error) {
        console.error("Get Sale Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// 4. Update sale
export const updateSale = async (req, res) => {
    try {
        const { id } = req.params;

        let oldSale = await Sale.findById(id);
        if (!oldSale) {
            return res.status(404).json({ message: "Sale not found" });
        }

        // purani values store kar lo inventory adjust ke liye
        const oldProduct = oldSale.productName;
        const oldQty = oldSale.quantity;
        const oldUnit = oldSale.unit;

        // update fields manually
        Object.assign(oldSale, req.body);

        // save updated
        const updatedSale = await oldSale.save();

        // Inventory Adjust Logic
        if (oldProduct === updatedSale.productName && oldUnit === updatedSale.unit) {
            // 👉 same product & unit
            const diff = updatedSale.quantity - oldQty;
            if (diff > 0) {
                // nayi qty zyada bechi → aur minus karo stock se
                await inventoryService.decreaseStock({
                    agentId: updatedSale.agentId,
                    seasonId: updatedSale.seasonId,
                    productName: updatedSale.productName,
                    unit: updatedSale.unit,
                    qty: diff
                });
            } else if (diff < 0) {
                // purani sale zyada thi → rollback karo (wapis add karo)
                await inventoryService.increaseStock({
                    agentId: updatedSale.agentId,
                    seasonId: updatedSale.seasonId,
                    productName: updatedSale.productName,
                    unit: updatedSale.unit,
                    qty: Math.abs(diff)
                });
            }
        } else {
            // 👉 product ya unit change ho gaya
            // 1. purani sale ko rollback karo (wapis inventory me add)
            await inventoryService.increaseStock({
                agentId: oldSale.agentId,
                seasonId: oldSale.seasonId,
                productName: oldProduct,
                unit: oldUnit,
                qty: oldQty
            });

            // 2. nayi sale minus karo
            await inventoryService.decreaseStock({
                agentId: updatedSale.agentId,
                seasonId: updatedSale.seasonId,
                productName: updatedSale.productName,
                unit: updatedSale.unit,
                qty: updatedSale.quantity
            });
        }

        res.status(200).json({
            message: "Sale updated successfully",
            data: updatedSale
        });

    } catch (error) {
        console.error("Update Sale Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// 5. Delete sale
export const deleteSale = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Sale.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Sale not found" });
        }

        // rollback inventory (deleted sale ka maal wapis add)
        await inventoryService.increaseStock({
            agentId: deleted.agentId,
            seasonId: deleted.seasonId,
            productName: deleted.productName,
            unit: deleted.unit,
            qty: deleted.quantity
        });

        res.status(200).json({
            message: "Sale deleted successfully",
            data: deleted
        });

    } catch (error) {
        console.error("Delete Sale Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
