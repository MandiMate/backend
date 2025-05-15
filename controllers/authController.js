import authentication from "../models/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Fetch All Users
const fetchAllUsers = async (req, res) => {
    try {
        const users = await authentication.find();
        res.status(200).send({ status: 200, message: "Success", data: users });
    } catch (error) {
        console.log("Fetch Error:", error);
        res.status(400).send({ status: 400, message: "Data Not Found" });
    }
};

// Register New User (Agent or Landlord)
const register = async (req, res) => {
    try {
        const { userName, email, password, role } = req.body;
        
        const existingUser = await authentication.findOne({ email });

        if (existingUser) {
            return res.status(400).send({ message: "User Already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await authentication.create({
            userName,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).send({ status: 201, message: "User Registered Successfully", newUser });
    } catch (error) {
        console.log("Register Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await authentication.findOne({ email });

        if (!user) {
            return res.status(400).send({ message: "No Account Found. Please Create an Account First." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send({ message: "Invalid Password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_TOKEN,
        );

        res.status(200).send({
            status: 200,
            message: "Login Successfully",
            token,
            user: {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log("Login Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// Delete User (by ID)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await authentication.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).send({ message: "User Not Found" });
        }

        res.status(200).send({ status: 200, message: "User Deleted Successfully", data: deletedUser });
    } catch (error) {
        console.log("Delete Error:", error);
        res.status(400).send({ status: 400, message: "Something Went Wrong" });
    }
};

// Admin Create (Manual only by DB directly)
const createAdmin = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        const existingAdmin = await authentication.findOne({ email });

        if (existingAdmin) {
            return res.status(400).send({ message: "Admin Already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await authentication.create({
            userName,
            email,
            password: hashedPassword,
            role: 1 // Fixed role for Admin
        });

        res.status(201).send({ status: 201, message: "Admin Created Successfully", newAdmin });
    } catch (error) {
        console.log("Create Admin Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

export { fetchAllUsers, register, login, deleteUser, createAdmin };
