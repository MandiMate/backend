import Farmer from "../models/farmerModel.js";

// Create Farmer
export const createFarmer = async (req, res) => {
    try {
        const { name, phone, address, landlordId } = req.body;
        const agentId = req.user.id;

        if (!name || !landlordId) {
            return res.status(400).json({ message: "Farmer name and landlord name are required" });
        }

        const newFarmer = await Farmer.create({
            name,
            phone,
            address,
            landlordId,
            agentId
        });

        res.status(201).json({
            message: "Farmer added successfully",
            data: newFarmer
        });
    } catch (error) {
        console.error("Create Farmer Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get Farmers by Landlord
export const getFarmersByLandlord = async (req, res) => {
    try {
        const { landlordId } = req.params;
        const agentId = req.user.id;

        const farmers = await Farmer.find({ landlordId, agentId, isActive: true }).sort({ createdAt: -1 });

        res.status(200).json({ data: farmers });
    } catch (error) {
        console.error("Get Farmers Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update Farmer
export const updateFarmer = async (req, res) => {
    try {
        const { id } = req.params;
        const agentId = req.user.id;

        const updated = await Farmer.findOneAndUpdate(
            { _id: id, agentId },
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Farmer not found" });
        }

        res.status(200).json({ message: "Farmer updated successfully", data: updated });
    } catch (error) {
        console.error("Update Farmer Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Soft Delete Farmer
export const deleteFarmer = async (req, res) => {
    try {
        const { id } = req.params;
        const agentId = req.user.id;

        const deleted = await Farmer.findOneAndUpdate(
            { _id: id, agentId },
            { isActive: false },
            { new: true }
        );

        if (!deleted) {
            return res.status(404).json({ message: "Farmer not found" });
        }

        res.status(200).json({ message: "Farmer removed (soft delete)", data: deleted });
    } catch (error) {
        console.error("Delete Farmer Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
