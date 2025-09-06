// services/inventoryService.js
import Inventory from "../models/inventoryModel.js";
import { convertQty } from "../utils/unitConversion.js";

async function findInventory(agentId, seasonId, productName, session = null) {
    const q = Inventory.findOne({ agentId, seasonId, productName });
    if (session) q.session(session);
    return await q.exec();
}

export async function ensureInventory({ agentId, seasonId, productName, unit, session = null }) {
    let inv = await findInventory(agentId, seasonId, productName, session);
    if (!inv) {
        const data = { agentId, seasonId, productName, baseUnit: unit, totalPurchasedQty: 0, totalSoldQty: 0, currentQty: 0 };
        if (session) {
            const created = await Inventory.create([data], { session });
            return created[0];
        } else {
            inv = await Inventory.create(data);
            return inv;
        }
    }
    return inv;
}

function toBase(qty, fromUnit, baseUnit) {
    if (fromUnit === baseUnit) return Number(qty);
    return convertQty(Number(qty), fromUnit, baseUnit);
}

export async function increaseStock({ agentId, seasonId, productName, qty, unit, session = null }) {
    const inv = await ensureInventory({ agentId, seasonId, productName, unit, session });
    const add = toBase(qty, unit, inv.baseUnit);

    if (session) {
        inv.totalPurchasedQty = Number((inv.totalPurchasedQty + add).toFixed(6));
        inv.currentQty = Number((inv.currentQty + add).toFixed(6));
        await inv.save({ session });
        return inv;
    } else {
        // atomic fallback
        const updated = await Inventory.findOneAndUpdate(
            { _id: inv._id },
            { $inc: { totalPurchasedQty: add, currentQty: add } },
            { new: true }
        );
        return updated;
    }
}

export async function decreaseStock({ agentId, seasonId, productName, qty, unit, session = null }) {
    const inv = await ensureInventory({ agentId, seasonId, productName, unit, session });
    const sub = toBase(qty, unit, inv.baseUnit);

    if (session) {
        if (inv.currentQty + 1e-9 < sub) throw new Error(`Insufficient stock. Available ${inv.currentQty} ${inv.baseUnit}`);
        inv.totalSoldQty = Number((inv.totalSoldQty + sub).toFixed(6));
        inv.currentQty = Number((inv.currentQty - sub).toFixed(6));
        await inv.save({ session });
        return inv;
    } else {
        const updated = await Inventory.findOneAndUpdate(
            { _id: inv._id, currentQty: { $gte: sub } },
            { $inc: { totalSoldQty: sub, currentQty: -sub } },
            { new: true }
        );
        if (!updated) throw new Error(`Insufficient stock. Available ${inv.currentQty} ${inv.baseUnit}`);
        return updated;
    }
}

export async function adjustStockDelta({ agentId, seasonId, productName, deltaQty, unit, session = null }) {
    if (!deltaQty || Number(deltaQty) === 0) return await ensureInventory({ agentId, seasonId, productName, unit, session });
    if (Number(deltaQty) > 0) return await increaseStock({ agentId, seasonId, productName, qty: deltaQty, unit, session });
    return await decreaseStock({ agentId, seasonId, productName, qty: Math.abs(deltaQty), unit, session });
}

export async function removePurchaseStock({ agentId, seasonId, productName, qty, unit, session = null }) {
    const inv = await ensureInventory({ agentId, seasonId, productName, unit, session });
    const sub = toBase(qty, unit, inv.baseUnit);

    if (session) {
        if (inv.totalPurchasedQty < sub || inv.currentQty < sub) {
            throw new Error(`Invalid rollback: stock mismatch.`);
        }
        inv.totalPurchasedQty = Number((inv.totalPurchasedQty - sub).toFixed(6));
        inv.currentQty = Number((inv.currentQty - sub).toFixed(6));
        await inv.save({ session });
        return inv;
    } else {
        const updated = await Inventory.findOneAndUpdate(
            { _id: inv._id, totalPurchasedQty: { $gte: sub }, currentQty: { $gte: sub } },
            { $inc: { totalPurchasedQty: -sub, currentQty: -sub } },
            { new: true }
        );
        if (!updated) throw new Error(`Invalid rollback: stock mismatch.`);
        return updated;
    }
}

