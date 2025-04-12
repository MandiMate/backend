import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import authentication from "../models/authModel.js";

dotenv.config()

const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).send({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        
        const user = await authentication.findById(decoded.id).select("-password");

        if (!user) return res.status(401).send({ message: "User not found" });

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ message: "Invalid Token" });
    }
};

export default protect;