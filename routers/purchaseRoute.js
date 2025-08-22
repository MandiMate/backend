import express from "express";
import {
    addPurchase,
    getPurchasesForActiveSeason,
    getPurchaseById,
    updatePurchase,
    deletePurchase
} from "../controllers/purchaseController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const purchaseRouter = express.Router();

// Purchase Routes
// Add new purchase
purchaseRouter.post("/add", authMiddleware, addPurchase);

// Get all purchases for active season
purchaseRouter.get("/active-season", authMiddleware, getPurchasesForActiveSeason);

// Get single purchase by ID
purchaseRouter.get("/purchase-detail/:id", authMiddleware, getPurchaseById);

// Update purchase
purchaseRouter.put("/update/:id", authMiddleware, updatePurchase);

// Delete purchase
purchaseRouter.delete("/delete/:id", authMiddleware, deletePurchase);

export default purchaseRouter;
