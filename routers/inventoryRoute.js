import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { listInventory, getInventoryByProduct } from "../controllers/inventoryController.js";

const inventoryRouter = express.Router();
inventoryRouter.get("/", authMiddleware, listInventory); // ?seasonId=...
inventoryRouter.get("/season/:seasonId/product/:productName", authMiddleware, getInventoryByProduct);

export default inventoryRouter;
