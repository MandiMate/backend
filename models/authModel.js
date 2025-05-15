import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, required: true }, 
}, { timestamps: true });

const authentication = mongoose.model("auth", authSchema)

export default authentication