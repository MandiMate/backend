import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
    {
        productName: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true }, // e.g. 100
        unit: { type: String, required: true }, // e.g. kg, maund, ton
        unitPrice: { type: Number, required: true }, // per unit rate
        totalAmount: { type: Number, default: 0 }, // Auto-calculated

        seasonId: { type: mongoose.Schema.Types.ObjectId, ref: "Season", required: true },
        agentId: { type: mongoose.Schema.Types.ObjectId, ref: "auth", required: true },
        landlordId: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },
        farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },

        purchaseDate: { type: Date, default: Date.now },

        expense: { type: Number, default: 0 }, // transport, packing etc.
        advance: { type: Number, default: 0 }, // amount given at purchase
        paidToFarmer: { type: Number, default: 0 }, // later payment
        balance: { type: Number, default: 0 }, // Auto-calculated
        extraPayment: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ["pending", "settled", "returned"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// Auto-calculation before save/update
purchaseSchema.pre("validate", function (next) {
    if (this.quantity != null && this.unitPrice != null) {
        this.totalAmount = Number((this.quantity * this.unitPrice).toFixed(2));
    }

    const paid = Number((this.advance || 0) + (this.paidToFarmer || 0));

    if (paid > this.totalAmount) {
        // Overpayment case
        this.balance = 0;
        this.extraPayment = Number((paid - this.totalAmount).toFixed(2));
    } else {
        // Normal case
        this.balance = Number(Math.max(0, this.totalAmount - paid).toFixed(2));
        this.extraPayment = 0;
    }

    // Status auto-update
    if (this.balance === 0 && this.totalAmount > 0) {
        this.status = "settled";
    } else if (this.totalAmount === 0) {
        this.status = "returned";
    } else {
        this.status = this.status || "pending";
    }

    next();
});

const Purchase = mongoose.model("Purchase", purchaseSchema)
export default Purchase;
