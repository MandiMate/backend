import Landlord from "../models/landlordModel.js";

// Create Landlord
export const createLandlord = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const agentId = req.user.id;

        if (!name) {
            return res.status(400).json({ message: "Landlord name is required" });
        }

        const newLandlord = await Landlord.create({
            name,
            phone,
            address,
            agentId
        });

        res.status(201).json({
            message: "Landlord added successfully",
            data: newLandlord
        });
    } catch (error) {
        console.error("Create Landlord Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get All Landlords for Logged-in Agent
export const getLandlords = async (req, res) => {
    try {
        const agentId = req.user.id;
        const landlords = await Landlord.find({ agentId, isActive: true }).sort({ createdAt: -1 });

        res.status(200).json({ data: landlords });
    } catch (error) {
        console.error("Get Landlords Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update Landlord
export const updateLandlord = async (req, res) => {
    try {
        const { id } = req.params;
        const agentId = req.user.id;

        const updated = await Landlord.findOneAndUpdate(
            { _id: id, agentId },
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Landlord not found" });
        }

        res.status(200).json({ message: "Landlord updated successfully", data: updated });
    } catch (error) {
        console.error("Update Landlord Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Soft Delete Landlord
export const deleteLandlord = async (req, res) => {
    try {
        const { id } = req.params;
        const agentId = req.user.id;

        const deleted = await Landlord.findOneAndUpdate(
            { _id: id, agentId },
            { isActive: false },
            { new: true }
        );

        if (!deleted) {
            return res.status(404).json({ message: "Landlord not found" });
        }

        res.status(200).json({ message: "Landlord removed (soft delete)", data: deleted });
    } catch (error) {
        console.error("Delete Landlord Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
