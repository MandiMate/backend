import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    landlordId: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "auth", required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

farmerSchema.index({ landlordId: 1, name: 1 });

let Farmer = mongoose.model("Farmer", farmerSchema);
export default Farmer;
