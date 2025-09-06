// routers/saleRoute.js
import express from "express";
import { addSale, getSalesForActiveSeason, getSaleById, updateSale, deleteSale } from "../controllers/saleController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const salesRouter = express.Router();

salesRouter.post("/add", authMiddleware, addSale);
salesRouter.get("/active", authMiddleware, getSalesForActiveSeason);
salesRouter.get("/singleSale/:id", authMiddleware, getSaleById);
salesRouter.put("/update/:id", authMiddleware, updateSale);
salesRouter.delete("/delete/:id", authMiddleware, deleteSale);

export default salesRouter;
