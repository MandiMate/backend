import express from "express";
import { createFarmer, getFarmersByLandlord, updateFarmer, deleteFarmer } from "../controllers/farmerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const farmerRoute = express.Router();

// farmers Routes
farmerRoute.post("/create", authMiddleware, createFarmer);
farmerRoute.get("/by-landlord/:landlordId", authMiddleware, getFarmersByLandlord);
farmerRoute.patch("/update/:id", authMiddleware, updateFarmer);
farmerRoute.delete("/delete/:id", authMiddleware, deleteFarmer);

export default farmerRoute;
