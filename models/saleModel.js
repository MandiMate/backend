import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
    {
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true }, // kg, quintal, bag etc.
        unitPrice: { type: Number, required: true }, // per unit price
        totalAmount: { type: Number }, // auto calculate = quantity * unitPrice

        seasonId: { type: mongoose.Schema.Types.ObjectId, ref: "Season", required: true },
        agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },

        customerName: { type: String }, // optional
        saleDate: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

// auto calculate totalAmount
saleSchema.pre("save", function (next) {
    this.totalAmount = this.quantity * this.unitPrice;
    next();
});

export default mongoose.model("Sale", saleSchema);
