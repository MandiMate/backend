import express from "express";
import { Fetch_All, login, register, userDelete } from "../controllers/authController.js";

const authRoute = express.Router()

// Fetch All Users Data
authRoute.get("/", Fetch_All)

// SignUp
authRoute.post("/register", register)

// Login
authRoute.post("/signin", login)

// Delete User
authRoute.delete("/userDelete/:id", userDelete)


export default authRoute