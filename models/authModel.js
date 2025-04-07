import mongoose from "mongoose";

const authSchema = mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

})

const authentication = mongoose.model("auth", authSchema)

export default authentication