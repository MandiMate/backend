import express from "express";
import { fetchAllUsers, login, register, deleteUser, createAdmin } from "../controllers/authController.js";

const authRoute = express.Router();

// Fetch All Users
authRoute.get("/", fetchAllUsers);

// Register Agent or Landlord
authRoute.post("/register", register);

// Login
authRoute.post("/signin", login);

// Delete User
authRoute.delete("/userDelete/:id", deleteUser);

// Create Admin (ONLY backend use)
authRoute.post("/createAdmin", createAdmin);

export default authRoute;
