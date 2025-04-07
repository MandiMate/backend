import authentication from "../models/authModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

// Fetch All Signin Users
const Fetch_All = async (req, res) => {
    try {
        let fetchData = await authentication.find()

        res.status(200).send({ status: 200, message: "Success", data: fetchData })

    } catch (error) {
        res.status(400).send({ status: 400, message: "Data Not Found" })
    }
}

// Create User
const register = async (req, res) => {
    try {
        let { userName, email, password} = req.body

        const userExist = await authentication.findOne({ email })

        if (userExist) {
            return res.status(400).send({ message: "User Already Exist" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await authentication.create({
            userName,
            email,
            password: hashedPassword,
        })

        res.status(201).send({ status: 201, message: "User Registered Successfully", newUser })
    } catch (error) {
        console.log("Register Error:", error)
        res.status(500).send({ message: "Internal Server Error" })
    }
}

// Login User
const login = async (req, res) => {
    try {
        let { email, password } = req.body

        const user = await authentication.findOne({ email })

        if (!user) {
            return res.status(400).send({ message: "Invalid Credentials" })
        }

        const validatePass = await bcrypt.compare(password, user?.password)

        if (!validatePass) {
            return res.status(400).send({ message: "Invalid Credentials" })
        }

        const token = jwt.sign({ id: user?._id }, process.env.JWT_TOKEN)
        res.status(200).send({ status: 200, message: "Login Successfully", token, user: { _id: user?._id, userName: user?.userName, email: user?.email} })

    } catch (error) {
        console.log("Login Error:", error)
        res.status(500).send({ message: "Internal Server Error" })
    }
}

// Delete Signip User
const userDelete = async (req, res) => {
    try {
        let { id } = req.params

        let deleteUser = await authentication.findByIdAndDelete(id)

        res.status(200).send({ status: 200, message: "Deleted Successfully", data: deleteUser })
    } catch (error) {
        res.status(400).send({ status: 400, message: "Something Went Wrong" })
    }
}

export { Fetch_All, register, login, userDelete }