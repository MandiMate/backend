import mongoose from "mongoose";

const landlordSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "auth", required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

landlordSchema.index({ agentId: 1, name: 1 });

const Landlord = mongoose.model("Landlord", landlordSchema);
export default Landlord;
